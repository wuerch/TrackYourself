const schedule = require('node-schedule')
const User = require('../../../models/userdata.model.js');
const { sendMail } = require('./sendMail.js');

schedule.scheduleJob("0 20 * * *", async () => { //"0 16 * * *" => everyday at 16 o'clock

    const users = await User.find({sendDailyEmail: true}); //GETTING ALL THE USERS WHERE sendDailyEmail == true

    //DECLARING DAYS
    const dateLastWeek = new Date();
    dateLastWeek.setHours(hours = 0, min=0, sec=0, ms=0 );
    dateLastWeek.setHours(-7 * 24 +1)

    const dateToday = new Date();
    dateToday.setHours(hours = 1, min=0, sec=0, ms=0 );


    //SENDING FOR EACH USER A EMAIL
    users.forEach((user) => {
        //FILTERING DATA

        const weightLastWeek = user.weights.filter(weight => { /*console.log(weight.date);*/ return weight.date == dateLastWeek.toString()});
        const weightToday = user.weights.filter(weight => weight.date == dateToday.toString());

        const workoutLastWeek = user.workouts.filter(workout => workout.date == dateLastWeek.toString());
        const workoutToday = user.workouts.filter(workout => workout.date == dateToday.toString());

        const kalorienLastWeek = user.kalorien.filter(tag => tag.date == dateLastWeek.toString());
        const kalorienToday = user.kalorien.filter(tag => tag.date == dateToday.toString());


        sendMail(
            dateToday, 
            dateLastWeek, 
            user.email, 
            weightLastWeek, 
            weightToday,
            workoutLastWeek,
            workoutToday,
            kalorienLastWeek,
            kalorienToday,
        );
    
    })

    console.log("CronJob successfull, sended all Emails.")
})