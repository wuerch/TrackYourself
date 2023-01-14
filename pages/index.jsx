import React, {useEffect} from 'react'
import Link from "next/link";
import Image from 'next/image';
import Waitlist from '../components/Waitlist'
import Cookies from 'js-cookie';
import { useRouter } from "next/router";

import {Exercises, Meals, Weights, Stretching, Email} from '../assets/index'

function Index() {
    const router = useRouter()

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
  return (
    <div>
        <div>
            <h1 className='text-[48px] mt-8'>Lose weight, get fit and stay fit</h1>
            <h2 className='mb-4'>You will:</h2>
            <ul>
                <li>• have <b>more Energy</b></li>
                <li>• <b>hold your weight consistently</b></li>
                <li>• learn with <b>less effort</b></li>
                <li>• be <b>healthy forever</b></li>
                <p className='mt-4'>... without Jojo-Effect!</p>
            </ul>
            <Waitlist />
        </div>



        <div>
            <h1 className='text-[48px] mt-8'>How does it work?</h1>

            <p>You get access to an app in the appstore, there you can:</p>
            <ul>
                <li className='my-4 text-[24px]'>• track your Weight</li>
                <div className='w-[60%] md:w-[20%] mx-[20%] md:mx-[40%]'><Image alt="Weights Image" src={Weights} /></div>
        
                <li className='my-4 text-[24px]'>• track your Calories</li>
                <div className='w-[60%] md:w-[20%] mx-[20%] md:mx-[40%]'><Image alt="Meals Image" src={Meals} /></div>
                <li className='my-4 text-[24px]'>• track your Exercises</li>
                <div className='w-[60%] md:w-[20%] mx-[20%] md:mx-[40%]'><Image alt="Exercises Image" src={Exercises} /></div>
                <li className='my-4 text-[24px]'>• get <b>Access to Courses</b> about Nutrition and Stretching</li>
                <div className='w-[60%] md:w-[20%] mx-[20%] md:mx-[40%]'><Image alt="Stretching Image" src={Stretching} /></div>
                <li className='my-4 text-[24px]'>• get <b>daily update emails from your results</b></li>
                <div className='w-[60%] md:w-[20%] mx-[20%] md:mx-[40%]'><Image alt="Email Image" src={Email} /></div>

                
            </ul>


            <div>
                {/* <Link href="/login"><button className="mt-4 border-[1px] rounded mytransition transition"><p className='gradient p-2'>Test the app in the browser</p></button></Link> */}
            </div>
            <Waitlist />
            <div className='mb-14'/>
            
        </div>



    </div>
  )
}

export default Index


Index.getLayout = function PageLayout(page){
	return(
		<>
		{page}
		</>
    )
}