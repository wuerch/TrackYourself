//Running Script

function sendEmailScript(date, dateLastWeek, recipient_email, weightLastWeek, weightToday, workoutLastWeek, workoutToday){

    const { spawn } = require('child_process');

    const childPython = spawn('python', ['./functions_and_services/dailyEmail/sendEmail.py', date, dateLastWeek, recipient_email, weightLastWeek, weightToday, workoutLastWeek, workoutToday]);

    //Any Output will be printed here
    childPython.stdout.on('data', (data) => {
        console.log(`${data}`);
        
        //console.log(`stdout: ${data}`);
        return {status: "200", data: data.toString()};

    });
    //Any Error will be printed
    childPython.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
        
        
    //Status Code (0 => No Error, 1 => Error
    childPython.on('close', (code) => {
        if(code == 1){
            console.log(`Error, no Email send to: ${recipient_email}`)
        }else if(code == 0){
            
        }
    });

}

module.exports = {sendEmailScript};