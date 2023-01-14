import Head from "next/head";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from "next/router";

import React, {useState, useEffect, useContext} from 'react'
import Cookies from 'js-cookie';
import GoogleButton from '../assets/GoogleButton.png'
import Popup from '../components/Popup'

function Index (){
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");

  const [emailConfirmed, setEmailConfirmed] = useState(true)
  const [credentialsIncorrect, setCredentialsIncorrect] = useState(false)

  function handleChange ( event ) {
    var eventName = event.target.name

    if( eventName === "email") {
        setEmail(event.target.value)
    } else if ( eventName === "password") {
        setPassword(event.target.value)
    }
  }


  async function handleSubmit(e){
      e.preventDefault()
  
      await fetch('/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }).then((res) => res.json()
      ).then((res) => { 
        if(res.status==401){
            setEmailConfirmed((prev)=> !prev)
        }  
        if(res.status==200){
            router.push("/weights")
        }
        if(res.status==400){
            setCredentialsIncorrect((prev) => !prev)
            setEmail("")
            setPassword("")
        }
      })
  }
  useEffect(() => {
    const token = Cookies.get('x-auth-cookie');
  
    if(token){

      fetch("/auth/access", {
        method: 'POST',
        credentials: 'include', 
        headers: { 
          "Content-Type" : "application/json",
          'Accept': 'application/json'
        },
      }).then(res => {
        return res.json()    
      }).then(res => {
        if(res.status == 200){
          router.push("/weights")
          console.log("200")
        }else{
          console.log(res)
        }
      })
  
    }

  },[])

 

  return(
  <div className="flex flex-col items-center justify-center h-screen">
    <Head>
      <title>Home</title>
    </Head>
    {emailConfirmed === false ? <Popup cbFunction={() => {setEmailConfirmed((prev) => !prev);}} data="Die Email ist noch nicht aktiviert." /> : ""}
    {credentialsIncorrect === true ? <Popup cbFunction={() => {setCredentialsIncorrect((prev) => !prev);}} data="Die Daten stimmen leider nicht." /> : ""}

    <Image className="cursor-pointer w-[240px]"src={GoogleButton} onClick={() => router.push("/auth/google")}></Image>

    <div className='flex w-60 md:w-80 items-center'>
            <hr className='h-[2px] basis-0 grow'/>
            <p className='p-2'>or</p>
            <hr className='h-[2px] basis-0 grow'/>
    </div>

    <form onSubmit={handleSubmit} action="/auth/login" method="POST" className="flex flex-col">
      <input onChange={handleChange} placeholder="your@email.com" name="email" value={email} className="rounded mt-2 text-black w-40"></input>
      <input type="password" onChange={handleChange} placeholder="password" name="password" value={password} className="rounded mt-2 text-black w-40"></input>
      <button className="border-[1px] rounded mt-4"><h1 className='gradient px-4 text-[32px] font-semibold mytransition transition'>Login</h1></button>
    </form>
    <p className='mt-4'>You don't have an account?</p>
    <Link href="/register" className="mt-4 border-[1px] rounded transition"><p className="p-2">Register</p></Link>
    
    
  </div>
  )
}

export default Index;

Index.getLayout = function PageLayout(page){
	return(
		<>
		{page}
		</>
    )
}