import React, {useContext} from 'react'
import UserContext from '../UserContext';

function Popup({data, cbFunction}) {
  const {userContext, setUserContext} = useContext(UserContext);

    async function handleDelete(){
        await fetch("/api/account", {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }).then( res => { 
            return res.json() 
          }).then( res => {
            if(res.status === 200){
                window.open('/auth/logout', '_self')
            }
          }).catch(error => console.error('Error:', error));

    }
  return (
    <div className='fixed h-full w-full inset-0 ] bg-[rgba(0,0,0,0.6)]'>
        <div className='flex items-center h-full justify-center'>
            <div className='bg-stone-100 rounded w-3/4 h-1/4 md:w-1/2 flex justify-center items-center flex-col'>
                <p className='text-black'>{data}</p>
                <div className='flex'>
                    <button className='text-black border-[1px] border-black bg-red-600 rounded mt-6 mr-2'><p className='px-2 py-1' onClick={() => handleDelete()}>Löschen</p></button>
                    <button className='text-black border-[1px] border-black rounded mt-6 ml-2'><p className='px-2 py-1' onClick={() => cbFunction()}>Behalten</p></button>
                </div>
                
            </div>
            
        </div>
    </div>
  )
}

export default Popup