const nodemailer = require('nodemailer');

function sendMail(date, dateLastWeek, recipient_email, weightLastWeek, weightToday, workoutLastWeek, workoutToday, kalorienLastWeek, kalorienToday){

    function formatWeight(){
        var body = "<h1>Gewicht</h1>"

        if(weightLastWeek.length > 0 && weightToday.length > 0){
            body = body + `<p>Dein <b>Gewicht letzte Woche</b>: ${weightLastWeek[0].weight} kg</p>
                    <p>Dein <b>Gewicht heute</b>: ${weightToday[0].weight} kg<p>
                    <p>Das ist ein <b>Unterschied</b> von: <b>${weightToday[0].weight - weightLastWeek[0].weight} kg</b></p>
            `
        }else if(weightLastWeek.length > 0){
            body = body + `<p>Dein <b>Gewicht letzte Woche</b>: ${weightLastWeek.weight} kg</p>
                    <p>Dein <b>Gewicht heute</b>: Du hast dein Gewicht heute nicht gemessen.</p>
            `
        }else if(weightToday.length > 0){
            body = body + `<p>Dein <b>Gewicht letzte Woche</b>: Du hast letzte Woche dein Gewicht nicht gemessen.</p>
                    <p>Dein <b>Gewicht heute</b>: ${weightToday[0].weight} kg</p>
            `
        }else{
            body = body + "<p>Du hast dein <b>Gewicht</b> letzte Woche und heute <b>nicht gemessen</b>.</p>"
        }
        body = body + "<br>"
        return body
    }
    function formatKalorien(){
        function formattedMahlzeit(array){
            var output = ""
            var kcalTotal = 0;
            console.log(array)
            for(i = 0; i<array[0].mahlzeiten.length; i++){
                //output = output + array[0].exercises[i]

                output = output + `<p>Mahlzeit: ${array[0].mahlzeiten[i].mahlzeit}</p>`
                if(array[0].mahlzeiten[i].weight){
                    output = output + `
                        <p>Gewicht: ${array[0].mahlzeiten[i].gewicht} g</p>
                    `
                }
                if(array[0].mahlzeiten[i].kalorien){
                    output = output + `
                        <p>Kaloren: ${array[0].mahlzeiten[i].kalorien} kcal</p>
                    `
                    kcalTotal = kcalTotal + array[0].mahlzeiten[i].kalorien;
                }
                output = output + `
                <br>
                <p>Das sind <b>insgesamt ${kcalTotal} kcal</b>.</p>
                <br>
                `
            }

            return output
        }
        var body = "<h1>Kalorien</h1>";
        

        if(kalorienLastWeek.length > 0 && kalorienToday.length > 0){
            body = body + `<p>Deine <b>Mahlzeiten letzte Woche</b>:</p>
                    <hr>
                    ${formattedMahlzeit(kalorienLastWeek)}
                    <p>Deine <b>Mahlzeiten heute</b>:<p>
                    <hr>
                    ${formattedMahlzeit(kalorienToday)}
            `
        }else if(kalorienLastWeek.length > 0){
            body = body + `<p>Deine <b>Mahlzeiten letzte Woche</b>:</p>
                    <hr>
                    ${formattedMahlzeit(kalorienLastWeek)}
                    <p>Du hast heute dein Essen nicht gemessen.<p>
            `
        }else if(kalorienToday.length > 0){
            body = body + `<p>Du hast <b>letzte Woche</b> dein <b>Essen nicht gemessen</b>.</p>
                    <p>Deine <b>Mahlzeiten heute</b>:<p>
                    <hr>
                    ${formattedMahlzeit(kalorienToday)}
            `
        }else{
            body = body + "<p>Du hast deine <b>Mahlzeiten</b> letzte Woche und heute <b>nicht gemessen</b>.</p><br>"
        }

        return body

    }
    function formatÜbungen(){
        function formattedWorkouts(array){
            output = ""
            for(i = 0; i<array[0].exercises.length; i++){
                //output = output + array[0].exercises[i]

                output = output + `<p>Übung: ${array[0].exercises[i].exercise}</p>`
                if(array[0].exercises[i].sets && array[0].exercises[i].reps){
                    output = output + `
                        <p>Sets: ${array[0].exercises[i].sets}</p>
                        <p>Reps: ${array[0].exercises[i].reps}</p>
                    `
                }else if(array[0].exercises[i].sets){
                    output = output + `<p>Sets: ${array[0].exercises[i].sets}</p>`
                }else if(array[0].exercises[i].reps){
                    output = output + `<p>Reps: ${array[0].exercises[i].reps}</p>`
                }

                if(array[0].exercises[i].weight){
                    output = output + `<p>Gewicht: ${array[0].exercises[i].weight} kg</p>`
                }
                if(array[0].exercises[i].duration){
                    output = output + `<p>Länge: ${array[0].exercises[i].duration} min</p>`
                }
                output = output + `<br>`
            }
            return output
        }
        var body = "<h1>Trainingseinheiten</h1>"

        if(workoutLastWeek.length > 0 && workoutToday.length > 0){
            body = body + `<p>Deine <b>Trainingseinheiten letzte Woche</b>:</p>
                    <hr>
                    ${formattedWorkouts(workoutLastWeek)}
                    <p>Deine <b>Trainingseinheiten heute</b>:<p>
                    <hr>
                    ${formattedWorkouts(workoutToday)}
            `
        }else if(workoutLastWeek.length > 0){
            body = body + `<p>Deine <b>Trainingseinheiten letzte Woche</b>:</p>
                    <hr>
                    ${formattedWorkouts(workoutLastWeek)}
                    <p>Du hast heute nicht traniert.<p>
            `
        }else if(workoutToday.length > 0){
            body = body + `<p>Du hast letzte Woche nicht trainiert.</p>
                    <p>Deine <b>Trainingseinheiten heute</b>:<p>
                    <hr>
                    ${formattedWorkouts(workoutToday)}
            `
        }else{
            body = body + "<p>Du hast deine <b>Trainingseinheiten</b> letzte Woche und heute <b>nicht gemessen</b>.</p><br>"
        }
       
        return body
    }

    function body(){

        return (`
            <h1>Deine Ergebnisse am ${date.toLocaleDateString("de-DE", { weekday: 'long' })}, dem ${date.getDate()+"."+(date.getMonth() + 1)+"."+date.getFullYear()}</h1>
                ${formatWeight()}
                ${formatKalorien()}
                ${formatÜbungen()}
            `
        )

    }


    GOOGLE_SMTP_EMAIL = process.env.GOOGLE_SMTP_EMAIL
    GOOGLE_SMTP_PW = process.env.GOOGLE_SMTP_PW

    // create a transporter object using your desired transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GOOGLE_SMTP_EMAIL,
            pass: GOOGLE_SMTP_PW
        }
    });

    // define the email options
    let mailOptions = {
        from: '"Workout Tracker" <your-email@example.com>',
        to: recipient_email,
        subject: `Deine Ergebnisse am ${date.toLocaleDateString("de-DE", { weekday: 'long' })}, dem ${date.getDate()+"."+(date.getMonth() + 1)+"."+date.getFullYear()}`,
        html: body()
    };

    // send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            // console.log(`Email sent: ${info.response}`);
        }
    });
    //console.log('Executed:' + weightLastWeek.length + ", " + weightToday.length + ", " + workoutLastWeek.length + ", " + workoutToday.length)


}
module.exports = {sendMail};