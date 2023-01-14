import React, {useState} from 'react'
import Popup from './Popup';

function Waitlist() {
  const [email, setEmail] = useState("")
  const [toggle, setToggle] = useState(false)

  async function handleClick(e){
    e.preventDefault();
    if(email.length > 8){
      setToggle((prev)=> !prev)

      fetch("/api/waitlist", {
        method: 'POST',
        credentials: 'include', 
        headers: { 
          "Content-Type" : "application/json",
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email:email,
        })
      }).then(res => {
        return res.json()    
      }).then(res => {
        if(res.status == 200){
          setEmail("");
          console.log("200")
        }else{
          console.log(res)
        }
      })

    }

  }
  function handleChange ( event ) {
    setEmail(event.target.value)
  }
  return (
    <div>
      {toggle === true ? <Popup cbFunction={() => {setToggle((prev) => !prev);}} data="You will be notified!" /> : ""}
      <h1 className='text-[48px] mt-8'>Get notified on release</h1>

      <form onSubmit={handleClick} className='flex flex-col w-[90%] mx-[5%] md:w-[40%] md:mx-[30%]'>
        <input onChange={handleChange} placeholder='email@example.com' name="email" value={email} className="rounded mt-2 text-black"></input>
        <button className="mt-4 border-[1px] rounded mytransition transition"><p className='gradient p-2'>Notify me</p></button>
      </form>
      
    </div>
  )
}

export default Waitlist