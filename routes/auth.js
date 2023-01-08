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
    router.post('/cookie', async function(req,res){
        res.status(200).redirect(`${process.env.CLIENT_URL}/auth/cookie2`);

    })
    router.post('/login', async (req,res)=> {
        
        if(req.body.email == ''){
            return res.json({ status: 400}) 
        }
        //query mongoose model for the email
        const user = await User.findOne({
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
        
            //SET THE COOKIE !!!
            res.cookie('x-auth-cookie', token);
            res.json({ status: 200, weights: user.weights, workouts: user.workouts, sendEmail: user.sendDailyEmail, kalorien: user.kalorien})
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

        const token = req.cookies['x-auth-cookie'];
        
        await jwt.verify(token , `${process.env.JWT_KEY}`, (err, user) => {
            if(err){
                res.cookie('x-auth-cookie', {expires: Date.now()});
                return res.json({ status: 403 })
            }else{
                return res.json({ status: 200 })
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