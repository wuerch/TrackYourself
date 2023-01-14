import React, {useState, useContext} from 'react'
import UserContext from '../UserContext';

function AddKalorien(props) {
    const {userContext, setUserContext} = useContext(UserContext);

  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [mahlzeit, setMahlzeit] = useState(
            { mahlzeit: "", gewicht: "", kalorien:""}
  );

  function handleChange(event) { //updating single workout state
    const { name, value } = event.target;

    var eventName = event.target.name

    if( eventName === "date") {
      setDate(value);
    }else if(eventName === "mahlzeit"){
      setMahlzeit((prev) => {
        return {...prev, [name]: value.replace(/[^a-zA-zäöüÄÖÜß 1-9]/, "")}
      }
      );
    }else if( eventName === "gewicht"){
      setMahlzeit((prev) => {
        return {...prev, [name]: value.replace(/[^0-9]/,"")}
      }
      );
    }else if( eventName === "kalorien"){
      setMahlzeit((prev) => {
        return {...prev, [name]: value.replace(/[^0-9]/,"")}
      }
      );
    }
  }
  function handleAdding(kalorienArray){
    //console.log(workoutsArray)
    let obj = kalorienArray.find(o => o.date === date + "T00:00:00.000Z")
    if(obj){
      console.log("Date found, added to the object.")
   
      const mappedKalorien = kalorienArray.map(object => {
        if(object.date === date + "T00:00:00.000Z"){
          return{ 
            ...object, 
            mahlzeiten: [...object.mahlzeiten, mahlzeit]
            } 
        }else{
          return object
        }
      }
    )
    return mappedKalorien;

    }else{
      console.log("No date found, created a new one.")
      return [...kalorienArray, {
        date: date + "T00:00:00.000Z",
        mahlzeiten: [{
          mahlzeit: mahlzeit.mahlzeit,
          gewicht: Number(mahlzeit.gewicht),
          kalorien: Number(mahlzeit.kalorien),
          
        }]
      }]
    }
  
  }
  async function handleSubmit(e){
    e.preventDefault()
  
    await fetch(userContext.base_url + `/api/mahlzeit`, {
            method: 'POST',
            credentials: 'include', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(
              {
                date: date + "T00:00:00.000Z",
                mahlzeit: {
                  mahlzeit: mahlzeit.mahlzeit,
                  gewicht: Number(mahlzeit.gewicht),
                  kalorien: Number(mahlzeit.kalorien),
                  
                }
              }
            ),
    }).then(res => {
      return res.json()    
    }).then(res => {
      if(res.status === 200){

        setUserContext((prev) => {
            return {
                ...prev,
                kalorien: handleAdding(userContext.kalorien)
            }
        })
        //RESET INPUTS
        setMahlzeit({
          mahlzeit: "",
          gewicht: "",
          kalorien: "",
          })
      }else{
        
      }
    }).catch(/*error => console.error('Error:', error)*/);
  }

  return (
    <div>
        <form className="text-black flex flex-col md:flex-row w-[80%] mx-[10%]" action="/api/workouts" method="POST">
          <input onChange={handleChange} className="mt-2 rounded h-8 w-[100%]" type="date" name="date" placeholder='Date' value={date}></input>
          <input onChange={handleChange} className="mt-2 rounded h-8 w-full" name="mahlzeit" placeholder='Meal' value={mahlzeit.mahlzeit}></input>
          <input onChange={handleChange} className="mt-2 rounded h-8 w-full" name="gewicht" placeholder='Gramm' value={mahlzeit.gewicht}></input>
          <input onChange={handleChange} className="mt-2 rounded h-8 w-full" name="kalorien" placeholder='Calories' value={mahlzeit.kalorien}></input>
          <button onClick={handleSubmit} className="border-[1px] rounded mt-2 h-8 w-full bg-[#369623]"><p className='text-white'>Add</p></button>
        </form>
    </div>
  )
}

export default AddKalorien