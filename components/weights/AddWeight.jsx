import React, {useState, useContext} from 'react'
import UserContext from '../UserContext';

function AddWeight(props) {
  const {userContext, setUserContext} = useContext(UserContext);
  
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [weight, setWeight] = useState("");

  function handleChange ( event ) {
    var eventName = event.target.name

    if( eventName === "date") {
        setDate(event.target.value)
    } else if ( eventName === "weight") {
        setWeight(event.target.value.replace(/[^0-9.,]/mg, ""))
    }
  }
  async function handleSubmit(e) {
    e.preventDefault()  

    await fetch("/api/weights", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date,
        weight,
      }),
    }).then( res => { 
      return res.json() 
    }).then( res => {
      if(res.status === 200){
        // props.setWeights( (prev) => [...prev, {date: date, weight: weight}] );
        setUserContext((prev) => {
          return {
            ...prev,
            weights: [...prev.weights, {date: date, weight: weight}]
          }
        })

        setDate(() => new Date().toISOString().slice(0,10));
        setWeight("");
      }else if(res.status === 400){
        alert("Date already exists.")
        setWeight("");
      }
    }).catch(error => console.error('Error:', error));

  }

  return (
    <div>
        <form className="text-black flex flex-col md:flex-row w-[80%] mx-[10%]" action="/api/weights" method="POST">
                <input onChange={handleChange} className="mt-2 rounded h-8 w-full" type="date" name="date" placeholder='Date' value={date}></input>
                <input onChange={handleChange} className="mt-2 rounded h-8 w-full" type="text" name="weight" placeholder='Weight in kg' value={weight}></input>
                <button onClick={handleSubmit} className="border-[1px] rounded mt-2 h-8 w-full bg-[#369623] mb-2"><p className='text-white'>Add</p></button>
        </form>
    </div>
  )
}

export default AddWeight