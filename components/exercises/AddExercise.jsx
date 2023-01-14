import React, {useState, useContext} from 'react'
import UserContext from '../UserContext';

function AddExercise(props) {
    const {userContext, setUserContext} = useContext(UserContext);

  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [newWorkout, setNewWorkout] = useState(
            { exercise: "", sets: "", reps:"", weight: "", duration: ""}
  );

  function handleChange(event) { //updating single workout state
    const { name, value } = event.target;

    var eventName = event.target.name

    if( eventName === "date") {
      setDate(value);
    }else if(eventName === "exercise"){
      setNewWorkout((prev) => {
        return {...prev, [name]: value.replace(/[^a-zA-zäöüÄÖÜß]/, "")}
      }
      );
    }else if( eventName === "sets"){
      setNewWorkout((prev) => {
        return {...prev, [name]: value.replace(/[^0-9]/,"")}
      }
      );
    }else if( eventName === "reps"){
      setNewWorkout((prev) => {
        return {...prev, [name]: value.replace(/[^0-9]/,"")}
      }
      );
    }else if( eventName === "weight"){
      setNewWorkout((prev) => {
        return {...prev, [name]: value.replace(/[^0-9,.]/,"")}
      }
      );
    }
    else if( eventName === "duration"){
      setNewWorkout((prev) => {
        return {...prev, [name]: value.replace(/[^0-9,.]/,"")}
      }
      );
    }
  }

  function handleAdding(workoutsArray){
    //console.log(workoutsArray)
    let obj = workoutsArray.find(o => o.date === date + "T00:00:00.000Z")
    if(obj){
      console.log("Date found, added to the object.")

      const mappedWorkouts = workoutsArray.map(object => {
        if(object.date === date + "T00:00:00.000Z"){
          return{ 
            ...object, 
            exercises: [...object.exercises, newWorkout] //changed the value here
            } 
        }else{
          return object
        }
      }
    )

    return mappedWorkouts;

    }else{
      console.log("No date found, created a new one.")
      return [...workoutsArray, {date: date + "T00:00:00.000Z", exercises: [newWorkout]}]
    }
  
  }
  
  async function handleSubmit(e){
    e.preventDefault()
  
    await fetch(userContext.base_url + `/api/workouts`, {
            method: 'POST',
            credentials: 'include', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(
              {
                date: date + "T00:00:00.000Z",
                exercises: {
                  exercise: newWorkout.exercise,
                  sets: newWorkout.sets,
                  reps: newWorkout.reps,
                  weight: newWorkout.weight,
                  duration: newWorkout.duration
                }
              }
            ),
    }).then(res => {
      return res.json()    
    }).then(res => {
      if(res.status == 200){

      //props.setWorkouts(handleAdding(props.workouts));

      setUserContext((prev) => {
        return {
            ...prev,
            workouts: handleAdding(userContext.workouts)
        }
      })
        
      //RESET INPUTS
      setNewWorkout({
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
        duration: ""
        })
      }else{
        console.log("AddWorkout Else")
      }
    }).catch(/*error => console.error('Error:', error)*/);


  }
  
  return (
    <div>
        <form className="text-black flex flex-col md:flex-row w-[80%] mx-[10%]" action="/api/workouts" method="POST">
          <input onChange={handleChange} className="mt-2 rounded h-8 w-full" type="date" name="date" placeholder='Date' value={date}></input>
          <input onChange={handleChange} className="mt-2 rounded h-8 w-full" name="exercise" placeholder='Exercise' value={newWorkout.exercise}></input>
          <input onChange={handleChange} className="mt-2 rounded h-8 w-full" name="sets" placeholder='Sets' value={newWorkout.sets}></input>
          <input onChange={handleChange} className="mt-2 rounded h-8 w-full" name="reps" placeholder='Reps' value={newWorkout.reps}></input>
          {/* <input onChange={handleChange} className="mt-2 rounded h-8 w-full" name="weight" placeholder='Weight' value={newWorkout.weight}></input> */}
          <input onChange={handleChange} className="mt-2 rounded h-8 w-full"name="duration" placeholder='Duration in min' value={newWorkout.duration}></input>
          <button onClick={handleSubmit} className="border-[1px] rounded mt-2 h-8 w-full bg-[#369623] mb-2"><p className='text-white'>Add</p></button>
        </form>
    </div>
  )
}

export default AddExercise