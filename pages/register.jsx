import React, {useState} from 'react'
import Popup from '../components/Popup';
import { useRouter } from "next/router";





function Registrieren() {
  const router = useRouter()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailSend, setEmailSend] = useState(false)
    const [userExists, setUserExists] = useState(false)
    const [eingabeNull, setEingabeNull] = useState(false)
    const [notCreatable, setNotCreatable] = useState(false)

    function handleChange ( event ) {
        var eventName = event.target.name

        if( eventName === "email") {
        setEmail(event.target.value)
        } else if ( eventName === "password") {
        setPassword(event.target.value)
        }
    }
    async function handleSubmit(e) {
        e.preventDefault()
    
        if(email.length === 0 | password.length === 0){
          setEingabeNull((prev)=>!prev)
          setEmail("");
          setPassword("");
          return
        }
    
        const res = await fetch(`/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })
    
        const data = await res.json()
        console.log(data)
        if(data.status == 200){
          setEmailSend((prev) => !prev)
        } else if(1<0){
          setUserExists((prev) => !prev)
        }else{
          setEmail("");
          setPassword("");
          setNotCreatable((prev) => !prev)
          //alert("Something went wrong")
        }
        setEmail("");
        setPassword("");
      }

  return (
    <div className='flex justify-center h-screen items-center'>
        {emailSend === true ? <Popup setEmailSend={setEmailSend} cbFunction={() => {setEmailSend((prev) => !prev); router.push("/")}} data="Wir haben dir eine Email mit einem Aktivierungslink geschickt." /> : ""}
        {userExists === true ? <Popup setEmailSend={setUserExists} cbFunction={() => {setUserExists((prev) => !prev);}} data="Diese Email ist schon vergeben." /> : ""}
        {eingabeNull === true ? <Popup setEmailSend={setEingabeNull} cbFunction={() => {setEingabeNull((prev) => !prev);}} data="Die Eingabefelder dürfen nicht leer bleiben." /> : ""}
        {notCreatable === true ? <Popup setEmailSend={setNotCreatable} cbFunction={() => {setNotCreatable((prev) => !prev);}} data="Dieser Nutzer lässt sich nicht erstellen." /> : ""}

        
        <div className='#18181b w-[80%] h-[80%] md:w-[60%] rounded-xl border-[1px] border-[rgb(255,255,255)] shadow-[0_1px_60px_-15px_rgba(255,255,255,0.6)] flex justify-center items-center'>
          <form className="form flex flex-col" action="/register" method="POST">
                  
            <input onChange={handleChange} name="email" placeholder='Your Email' value={email} className="text-black rounded w-40"></input>
            <input onChange={handleChange} type="password" name="password" placeholder='Your Password' value={password} className="text-black rounded mt-2 w-40"></input>
            <button onClick={handleSubmit} className="mt-4 border-[1px] rounded mytransition transition"><p className='gradient p-2'>Register</p></button>
                    
          </form>
        </div>
        
   

    
    </div>
  )
}

export default Registrieren

Registrieren.getLayout = function PageLayout(page){
	return(
		<>
		{page}
		</>
    )
}