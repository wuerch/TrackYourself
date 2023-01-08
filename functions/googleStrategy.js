const passport = require('passport'); //OAuth
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userdata.model.js')
//import User from '../models/User';

const googleLoginStrategy = new GoogleStrategy(
  {
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    callbackURL: `${process.env.GOOGLE_CALLBACK_URL}`,
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    //das wird ausgeführt wenn AUTH erfolgreich war
    console.log(profile.name.givenName + " " + profile.name.familyName + " authenticated");
  
    try{
      const user = await User.findOne({email: profile.emails[0].value})
      
      if(user){
        //console.log(user);
        done(null, user);
      }else if(!user){

        const newUser= new User({
          provider: profile.provider,
          email: profile.emails[0].value,
          name: {
             firstName: profile.name.givenName,
             familyName: profile.name.familyName
          },
          confirmed: true,
          sendDailyEmail: true
        }).save().then( () => {
          console.log("New User created: " + profile.displayName);
          done(null, newUser)
          }
        )
      }
  
    }catch(err){
      console.log(err)
    }
  },
);

passport.use(googleLoginStrategy);