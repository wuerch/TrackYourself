const router = require("express").Router();
const passport = require("passport");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const User = require('../models/userdata.model.js');
// const { sendEmailScript } = require("../functions_and_services/dailyEmail/sendEmail.js");
const { sendEmail } = require("../functions/emails/confirmationEmail/confirmationEmail.js");
require('dotenv').config()

function routes(app) {
    
    function generateJWT(user){
        const token = jwt.sign(
        {
            expiresIn: '12h',
            provider: user.provider,
            email: user.email
        },
        `${process.env.JWT_KEY}`,
        );
        return token;
    };
    function handleUserData(user){
        //HANDLE NEW WEEK
        const year = new Date().getFullYear()
        var days = Math.floor((new Date() - new Date(year, 0, 1)) / (24 * 60 * 60 * 1000));
        var week = Math.ceil(days / 7);

        if(!user.workoutList){
            user.workoutList = [];        
        }

        let obj
        user.workoutList ? obj = user.workoutList.find(o => o.year === year && o.week === week) : ""

        if(!obj){
            const newWeek = user.defaultWorkoutList.map((exercise, index) => {
                return {exercise: exercise, id: index +1, checked: false}
            })
            obj = {
                year: year,
                week: week,
                exercises: newWeek
            }

            user.workoutList.push(obj)
            console.log(JSON.stringify(user.workoutList))
            // data = data.map((item, index) => ({ ...item, id: index + 1 }))
        }

        
        const data = {
            weights: user.weights,
            kalorien: user.kalorien,
            workouts: user.workouts,
            sendDailyEmail: user.sendDailyEmail,
            base_url: process.env.CLIENT_URL,
            defaultWorkoutList: user.defaultWorkoutList,
            workoutList: user.workoutList
        }
        return data

    }
    // router.post('/cookie', async function(req,res){
    //     res.status(200).redirect(`${process.env.CLIENT_URL}/auth/cookie2`);

    // })
    router.post('/login', async (req,res)=> {
        
        if(req.body.email == ''){
            return res.json({ status: 400}) 
        }
        
        //query mongoose model for the email
        var user = await User.findOne({
            email: req.body.email,
        })
        if (!user) {
            return res.json({ status: 400}) //wenn kein User mit der Email gefunden wird:
        }
        if(user.confirmed == false){
            return res.json({status: 401})
        }
        
        //es wird geprüft ob das Password stimmt
        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        )

        if(isPasswordValid == true){
            const token = generateJWT(user);

            const data = {
                weights: user.weights,
                kalorien: user.kalorien,
                workouts: user.workouts,
                sendDailyEmail: user.sendDailyEmail,
                base_url: process.env.CLIENT_URL,
                defaultWorkoutList: user.defaultWorkoutList,
                workoutsList: user.workoutsList
            }
        
            //SET THE COOKIE !!!
            res.cookie('x-auth-cookie', token);
            res.json({ status: 200, user: data, 'x-auth-cookie': token})
        }else{
            return res.json({ status: 400})
        }

    })
    router.post('/register', async function(req,res){

        try {
            console.log(req.body)
            //create a hashed password in order to not save the real password
            const newPassword = await bcrypt.hash(req.body.password, 10)

            //Check if user exists
            // const UserData = await User.findOne({email: req.body.email})
            // if(UserData){
            // 	console.log(UserData)
            // 	return res.json({status: 400})
            // }

            //Creating a new User through the Users model
            await User.create({
                provider: 'register-form',
                email: req.body.email,
                password: newPassword,
            })
            const emailToken = jwt.sign(
                {
                    email: req.body.email,
                }, `${process.env.JWT_KEY}`
            );
            const url = `${process.env.CLIENT_URL}/auth/confirmation/${emailToken}`
            sendEmail(req.body.email, url);

            return res.json({status: 200});

        } catch (err) {
            console.log(err)
            res.json({ status: 'error', error: 'Something went wrong...' })

        }
    })
    router.get('/confirmation/:token', async function(req,res){
        try{
            var userdata;
            jwt.verify(req.params.token , `${process.env.JWT_KEY}`, (err, user) => {
                if(err){
                    console.log(err)
                    return res.json({ status: 403 })
                }else{
                    userdata = user;
                }	
            });
            console.log(userdata)
            await User.updateOne({email: userdata.email}, {confirmed: true});
            //res.json({ status: 200})
            const token = generateJWT(userdata);
            res.cookie('x-auth-cookie', token);
            res.status(200).redirect(`${process.env.CLIENT_URL}`);

        }catch(e){
            console.log(e)
            res.json({ status: 'error'})
        }

    })
    
    router.get('/google',passport.authenticate('google', {scope: ['profile', 'email']/*, prompt: 'select_account'*/}));
    
    router.get("/google/callback", passport.authenticate("google", {
        failureRedirect: "/login/failed",
        session: false,
        }), (req, res) => {
        //console.log(req.user)
        const token = generateJWT(req.user);
        res.cookie('x-auth-cookie', token);
        res.redirect(`${process.env.CLIENT_URL}`);
        }
    );

    router.post("/access", async function(req, res){
    
        var token;
        req.body['x-auth-token'] ? token = req.body['x-auth-token'] : token = req.cookies['x-auth-cookie'];
                
        await jwt.verify(token , `${process.env.JWT_KEY}`, async (err, user) => {
            if(err){
                res.cookie('x-auth-cookie', {expires: Date.now()});
                return res.json({ status: 403 })
            }else{
                //query mongoose model for the email
                var user = await User.findOne({
                    email: req.body.email,
                })
                if (!user) {
                    return res.json({ status: 400}) //wenn kein User mit der Email gefunden wird:
                }
                if(user.confirmed == false){
                    return res.json({status: 401})
                }
                const data = handleUserData(user);
                return res.json({ status: 200, user: data})
                
            }	
        });

    })
    
    router.get("/logout", function(req, res){
        res.cookie('x-auth-cookie', {expires: Date.now()});
        res.status(202).redirect(`${process.env.CLIENT_URL}`);
    })



    return router;

  };
  
  module.exports = routes;