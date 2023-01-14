import React, {useEffect, useContext} from 'react'
import UserContext from '../UserContext';
import { MdClear} from "react-icons/md";

function MapExercises(props) {
  const {userContext, setUserContext} = useContext(UserContext);

    function filterWorkouts(workoutsArray, deletedExercise, date){
      const mappedWorkouts = workoutsArray.map(object => {  
        if(object.date === date){
            const filteredExercises = object.exercises.filter(exercise => {
              return(
                exercise.exercise !== deletedExercise.exercise 
                | exercise.sets !== deletedExercise.sets 
                | exercise.reps !== deletedExercise.reps 
                | exercise.weight !== deletedExercise.weight 
                | exercise.duration !== deletedExercise.duration 
              )
            })
            return {
              date: object.date,
              _id: object._id,
              exercises: filteredExercises
            }
        }else{
            return object
        }
      })
      return mappedWorkouts;
    }
    
    async function handleDelete({exercise}, date){
    
      //DELETE REQUEST
      
      await fetch(`/api/workouts`, {
             method: 'DELETE',
             credentials: 'include', 
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({
               exercise: exercise,
               date: date
             }),
      }).then(res => {
        return res.json()    
      }).then(res => {
        if(res.status === 200){        

          setUserContext((prev) => {
            return {
              ...prev,
              workouts: filterWorkouts(userContext.workouts, exercise, date)
            }
          })
        }
      }).catch(error => console.error('Error:', error));
      
    }

  return (
    <div>
     
      { userContext? userContext.workouts ? userContext.workouts.length > 0 ? userContext.workouts.map((workout, index) => {
          return (
            <div key={index} className="">
              {workout.exercises ? workout.exercises.length > 0 ? <div>
                <p className='gradient'>{workout.date.slice(0,10)}</p>
                <div className='flex justify-around'>
                    <p className='basis-0 grow'>Exercise</p>
                    <p className='basis-0 grow whitespace-nowrap'>Sets x Reps</p>
                    {/* <p className='basis-0 grow'>Gewicht</p> */}
                    <p className='basis-0 grow'>Duration</p>
                    <div className='basis-0 grow-[0.5]'><p>Delete</p></div>
                </div>
                <hr/>      
             </div>: "" : ""}

              {workout.exercises ? workout.exercises.length > 0 ? 
                  
                workout.exercises.map((exercise, index) => {
                  return(
                    <div key={index} className='flex justify-around'>
                      <p className='basis-0 grow min-w-0'>{exercise.exercise}</p>
                      <p className='basis-0 grow'>{exercise.sets | exercise.reps ? exercise.sets + (exercise.reps ? " x " +exercise.reps : "") : ""}</p>
                      {/* <p className='basis-0 grow'>{exercise.weight ? exercise.weight + " kg" : ""}</p> */}
                      <p className='basis-0 grow'>{exercise.duration ? exercise.duration + " min" : ""}</p>
                      <div className='basis-0 grow-[0.5] flex justify-center'><div onClick={() => handleDelete({exercise}, workout.date)} className='bg-[#BA1000] w-min hover:cursor-pointer'><MdClear /></div></div>
                    </div>
                  )
              }) : "" : ""}
            </div>
          )
        }).reverse() : "" : "" :""
      } 
    </div>
  )
}

export default MapExercises