const router = require("express").Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require('../models/userdata.model.js')
const Waitlist = require('../models/waitlist.model.js')
const nodemailer = require('nodemailer');
const { userDataEmail } = require("../functions/emails/userDataEmail.js");

function verifyToken(req, res){
    var token;
    req.body['x-auth-token'] ? token = req.body['x-auth-token'] : token = req.cookies['x-auth-cookie'];

    var userData;
    if (token == null){
        return res.json({status: 401})
    }
    jwt.verify(token , `${process.env.JWT_KEY}`, async (err, user) => {

        if(err){
        return res.json({status: 403})
        }
        userData = user
    })
    return userData
}

function routes(app) {

    // router.post("/waitlist", async (req,res) => {
    //     await Waitlist.create({email: req.body.email});
    //     res.json({status: 200})
    // })
    
    router.get("/user", async (req,res) => {
      const userData = verifyToken(req, res);

      if(userData){
        const savedUser = await User.findOne({email: userData.email})
        if(savedUser){
          const data = {
            weights: savedUser.weights,
            kalorien: savedUser.kalorien,
            workouts: savedUser.workouts,
            sendDailyEmail: savedUser.sendDailyEmail,
            base_url: process.env.CLIENT_URL,
            defaultWorkoutList: savedUser.defaultWorkoutList
          }
          return res.json({status: 200, user: data});
        }else{
            
        }
      }

    })

    // router.get("/weights", async (req, res) => {
    //     // console.log("IN ROUTE:" + JSON.stringify(req.cookies))
    //     const userData = verifyToken(req, res);
    //     //console.log(userData)
      

    //     try{
    //         if(userData){
    //             const savedUser = await User.findOne({email: userData.email})
    //             const weights = savedUser.weights;
        
    //             if(savedUser){
    //                 return res.json({status: 200, data: weights});
    //             }else{
                    
    //             }
    //         }
    //     }catch(err){
    //         console.log(err)
    //     }
    // })

    router.post("/weights", async (req, res) => {
        const userData = verifyToken(req, res);

        if(userData){
            const query = await User.findOne({"email": userData.email, "weights.date" : req.body.date})
            //console.log(query)

            if(query){
                //console.log(query)
                return res.json({status: 400})
            }else{
                //console.log(query)
                await User.updateOne({email: userData.email}, {$push: { "weights": {
                    date: req.body.date,
                    weight: Number(req.body.weight.replace(/,/, ".")),
                }}});
            }
            return res.json({status: 200});

        }
    })

    router.delete("/weights", async (req, res) => {
        const userData = verifyToken(req, res);

        if(userData){
            await User.updateOne({"email": userData.email},{$pull: {"weights": {"date": req.body.date}}}, function(err) {
          //console.log(err);
        }).clone().catch(function(err){ console.log(err)})
        //console.log("Deleted weight.")

            return res.json({status: 200});

        }
    })
    // router.get("/workouts", async (req,res) => {
    //     const userData = verifyToken(req, res);

    //     try{
    //         if(userData){
    //             const savedUser = await User.findOne({email: userData.email})
    //             const workouts = savedUser.workouts;
        
    //             if(savedUser){
    //                 return res.json({status: 200, data: workouts});
    //             }else{
    //                 return res.json({ status: '403'})
    //             }
    //         }
    //     }catch(err){
    //         console.log(err)
    //     }
        
    // })
    router.post("/workouts", async (req,res) => {
        async function createDate(query){
      
            const updateDocument = {
                $push: { "workouts": 
                            {
                                date: req.body.date,
                            }
                }					
            };

            await User.updateOne(query, updateDocument);
            console.log("A new Date was created.")
        }
        async function createExercise(query){

            const updateDocument = {
                $push: { "workouts.$[workout].exercises": 
                            {
                                exercise: req.body.exercises.exercise,
                                sets: req.body.exercises.sets,
                                reps: req.body.exercises.reps,
                                weight: req.body.exercises.weight,
                                duration: req.body.exercises.duration,
                            }
                }					
            };

            const options = {
                arrayFilters: [
                  {
                    "workout.date": req.body.date,
                  },
                ],
            };
            
            await User.updateOne(query, updateDocument, options);
            console.log("Created a new exercise.")
        }
        //Wenn ein treffer gefunden wird, der identisch ist, zu diesem Workout hinzufügen
        // async function addToExercise(query){

        //     //FIND A ENTRY THAT IS EQUAL 
        //     await User.find({"email": user.email, "workouts.exercises.exercise": req.body.exercise})

        //     //ADD TO THE ENTRY THAT IS EQUAL

        //     //await User.updateOne(query, updateDocument, options);

        // }
        const userData = verifyToken(req, res);
        if(userData){
              
            const query = { email: userData.email };

            await User.find({"email": userData.email , "workouts.date": req.body.date}, async function (err, document) {

                if(document.length === 0){
                    await createDate(query);
                }

                try{
                    await createExercise(query);
                    return res.json({status: 200});
                    
                }catch(err){ //wenn kein passendes Datum unter workouts.date gefunden wird wird eines erstellt.
                    await createDate(query);
                    await createExercise(query);
                    return res.json({status: 200});
                }
            }).clone().catch(function(err){ console.log(err)})

        }
    })
    router.delete("/workouts", async (req,res) => {
        const userData = verifyToken(req, res);

        if(userData){

            //DELETING Exercise
            const query = {"email": userData.email, "workouts.date": req.body.date}
            const updateDocument = {
          $pull: { "workouts.$[workout].exercises": 
                {
                  exercise: req.body.exercise.exercise,
                  sets: req.body.exercise.sets ? Number(req.body.exercise.sets) : null,
                                reps: req.body.exercise.reps ? Number(req.body.exercise.reps) : null,
                  weight: req.body.exercise.weight ? Number(req.body.exercise.weight) : null,
                                duration: req.body.exercise.duration ? Number(req.body.exercise.duration) : null,
                }
          }					
        };

        const options = {
          arrayFilters: [
            {
            "workout.date": req.body.date,
            },
          ],
        };

            //FINDING THE USER WITH THE MATCHING DAY
            var data = await User.findOne({"email": userData.email, "workouts.date" : req.body.date})
            
            //Getting the amount of exercises
            var data = data.workouts.filter(workout => workout.date.toISOString() == req.body.date)
            var data = data[0].exercises
            const length = data.length

            //IF LENGTH IS == 0 THAN DELETE THE WHOLE OBJECT
            if (length == 1){
                await User.updateOne({"email": userData.email},{$pull: {"workouts": {"date": req.body.date}}}, function(err) {
            }).clone().catch(function(err){ console.log(err)})
                console.log("Deleted Workout")

            }else if (length > 1){
                await User.updateOne(query, updateDocument, options);
                console.log("Deleted Exercise")
            }
            return res.json({status: 200});
        }
    })
    // router.get("/mahlzeit", async (req,res) => {
    //     const userData = verifyToken(req, res);

    //     if(userData){
    //         const savedUser = await User.findOne({email: userData.email})
    //         const kalorien = savedUser.kalorien;

    //         if(savedUser){
    //             return res.json({status: 200, data: kalorien});
    //         }else{
    //             return res.json({ status: '403'})
    //         }
    //     }

    // })
  
   
    router.post("/workoutlist", async (req,res) => {
        const userData = verifyToken(req,res);

        if(userData){
            const query = { "email": userData.email, "workoutsList.year": req.body.year, "workoutsList.week": req.body.week};
        
            const updateDocument = {
                $set: { "workoutsList.$[obj].exercises": req.body.exercises},
                
            };
            const options = {
                arrayFilters: [
                    {
                    "obj.year": req.body.year,
                    "obj.week": req.body.week
                    },
                ],
            };
            
            await User.updateOne(query, updateDocument, options);
            return res.json({status:200})  
        }

    })
    router.post("/workoutlist/newexercise", async (req,res) => {
        const userData = verifyToken(req,res);

        if(userData){
            //console.log(req.body)
            const query = { "email": userData.email, "workoutsList.year": req.body.year, "workoutsList.week": req.body.week};

            const updateDocument = {
                $push: { "workoutsList.$[obj].exercises": req.body.exercise},
                
            };
            const options = {
                arrayFilters: [
                    {
                    "obj.year": req.body.year,
                    "obj.week": req.body.week
                    },
                ],
            };
            
            await User.updateOne(query, updateDocument, options);
            return res.json({status:200})  

            // await User.updateOne(
            //     { email: userData.email }, 
            //     { $push: { workoutsList: object} },
            // );
            // return res.json({status: 200})
        }

    })
    router.post("/workoutlist/createweek", async (req,res) => {
        const userData = verifyToken(req,res);
        //console.log(req.body)

        const object = {
            year: req.body.year,
            week: req.body.week,
            exercises: req.body.defaultWorkoutList
        }

        await User.updateOne(
            { email: userData.email }, 
            { $push: { workoutsList: object} },
        );
        return res.json({status: 200})

    })
    
    router.post("/defaultworkoutlist", async (req,res) => {
        const userData = verifyToken(req,res);

        if(userData){
            await User.findOneAndUpdate(
                { email: userData.email }, 
                { $set: { defaultWorkoutList: req.body.defaultWorkoutList } },
            );
        }
        //console.log("Setted")
        return res.json({status:200});
    })
   
    router.post("/mahlzeit", async (req,res) => {
        const userData = verifyToken(req, res);

        if(userData){
            const query = await User.findOne({"email": userData.email, "kalorien.date" : req.body.date})

            //If the query has data, the date exists.
            if(query){
                //Adding to the date.
                const updateDocument = {
                    $push: { "kalorien.$[object].mahlzeiten": 
                                {
                                    mahlzeit: req.body.mahlzeit.mahlzeit,
                                    gewicht: req.body.mahlzeit.gewicht,
                                    kalorien: req.body.mahlzeit.kalorien
                                }
                    }					
                };
            
                const options = {
                    arrayFilters: [
                      {
                        "object.date": req.body.date,
                      },
                    ],
                };
                    
                await User.updateOne({"email": userData.email, "kalorien.date" : req.body.date}, updateDocument, options);
                //console.log("Created a new Mahlzeit.")
            }else{
                await User.updateOne({email: userData.email}, {$push: { "kalorien": {
                    date: req.body.date,
                    mahlzeiten: {
                        mahlzeit: req.body.mahlzeit.mahlzeit,
                        gewicht: req.body.mahlzeit.gewicht,
                        kalorien: req.body.mahlzeit.kalorien
                    }
                }}});
            }
            return res.json({status: 200});
        }

    })
    router.delete("/mahlzeit", async (req,res) => {
        const userData = verifyToken(req, res);

        if(userData){
            
            //FINDING THE USER WITH THE MATCHING DAY
            var data = await User.findOne({"email": userData.email, "kalorien.date" : req.body.date})
        
            //Getting the amount of exercises
            var data = data.kalorien.filter(workout => workout.date.toISOString() == req.body.date)
            var data = data[0].mahlzeiten
            const length = data.length
          
            //IF LENGTH IS == 0 DELETE THE WHOLE OBJECT
            if (length == 1){
                await User.updateOne({"email": userData.email},{$pull: {"kalorien": {"date": req.body.date}}}, function(err) {
            }).clone().catch(function(err){ console.log(err)})
                
            }else if (length > 1){
                //DELETING only a single Mahlzeit
                const query = {"email": userData.email, "kalorien.date": req.body.date}
                
                const updateDocument = {
                    $pull: { "kalorien.$[tag].mahlzeiten": 
                                {
                                    mahlzeit: req.body.mahlzeit.mahlzeit,
                                    gewicht:  req.body.mahlzeit.gewicht /*? req.body.mahlzeit.gewicht : null*/,
                                    kalorien: req.body.mahlzeit.kalorien /*? req.body.mahlzeit.kalorien : null*/,
                                }
                    }					
                };
                const options = {
                    arrayFilters: [
                    {
                        "tag.date": req.body.date,
                    },
                    ],
                };

                await User.updateOne(query, updateDocument, options);
            }
            return res.json({status: 200});

        }
    })


    router.get("/account", async (req,res) => {
        const verifiedUser = verifyToken(req, res);
        if(verifiedUser){
            var user = await User.findOne({email: verifiedUser.email})
            user.password = undefined;
            userDataEmail(verifiedUser.email, user)            
        }
    })
    router.delete("/account", async (req,res) => {
        const userData = verifyToken(req, res);

        if(userData){
            await User.deleteOne({"email": userData.email}, function(err) {
                if(err){
                    res.json({status: 400}) 
                }
            }).clone().catch(function(err){ console.log(err)})
            res.json({status: 200})
        }
    })
    router.patch("/account/sendEmail", async (req,res) => {
        const userData = verifyToken(req, res);

        if(userData){
            await User.updateOne({email: userData.email}, {sendDailyEmail: !req.body.checkbox});
            //console.log(req.body.checkbox)
            //console.log(await User.findOne({email: userData.email}))
            res.json({status: 200});
        }
    })
  
    return router;
  };
  
  module.exports = routes;