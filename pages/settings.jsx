import React, {useState, useContext, useEffect} from 'react'
import UserContext from '../components/UserContext';
import {DataPopup, DeletePopup} from '../components/settings'
import { useRouter } from "next/router";

function Settings() {
    const router = useRouter()
    const [deletePopup, setDeletePopup] = useState(false)
    const [dataPopup, setDataPopup] = useState(false);
    const [confirmed, setConfirmed] = useState(true);

    const {userContext, setUserContext} = useContext(UserContext);

    //COSTUM HANDLE CONTEXT
    useEffect(() => {
        if(!userContext){

            fetch('/api/user', {
            method: 'GET',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            },
            
        }).then((res) => res.json()
        ).then((res) => { 
            
            if(res.status==200){
                setUserContext(res.user)
                setConfirmed(res.user.sendDailyEmail)
            }else{
                router.push("/")
            }
            
        })
        }else{
            setConfirmed(userContext.sendDailyEmail)
        }

    },[])

    

    

    async function handleClick(){

        await fetch(`/api/account/sendEmail`, {
            method: 'PATCH',
            credentials: 'include', 
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({
                checkbox: confirmed
            })
        }).then(res => res.json()    
        ).then(res => {
        if(res.status === 200){     
            setConfirmed((prev) => (!prev)); 
        }   
        }).catch(error => {console.error('Error:', error)});
    }

  return (
    <div className='min-h-screen'>
    
        {dataPopup === true ? <DataPopup data="Wir senden dir deine Daten" setDataPopup={setDataPopup} cbFunction={() => setDataPopup((prev) => !prev)}/>: ""}
        {deletePopup === true ? <DeletePopup data="Willst du deinen Account wirklich löschen?" cbFunction={() => setDeletePopup((prev) => !prev)}/>: ""}

        
        <div className='flex justify-center'>
            <input type="checkbox" className='w-4 mr-2' onChange={handleClick} value={confirmed} checked={confirmed}/><p>Ich will Emails bekommen</p>
        </div>
        <button className='border-[1px] rounded p-2' onClick={() => {setDataPopup((prev) => !prev)}}>Ich will meine gespeicherten Daten</button>
        <div><button className='bg-red-700 border-[1px] rounded p-2' onClick={() => setDeletePopup((prev) => !prev)}>Account löschen</button></div>
    
    
    </div>
  )
}

export default Settings