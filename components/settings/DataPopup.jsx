
import React from 'react'

function DataPopup({data, setDataPopup}) {
    
    async function handleDataPopup(){
      setDataPopup((prev) => !prev)
      await fetch("/api/account", {
          method: 'GET',
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json',
          },
      }).then( res => { 
          return res.json() 
      }).then( res => {
          // if(res.status === 200){
            
          // }
      })
      
  } 
  return (
    <div className='fixed h-full w-full inset-0 ] bg-[rgba(0,0,0,0.6)]'>
        <div className='flex items-center h-full justify-center'>
            <div className='bg-stone-100 rounded w-3/4 h-1/4 md:w-1/2 flex justify-center items-center flex-col'>
                <p className='text-black'>{data}</p>
                <button className='text-black border-[1px] border-black rounded mt-6'><p className='px-2 py-1' onClick={() => handleDataPopup()}>Okay</p></button>
            </div>
            
        </div>
    </div>
  )
}

export default DataPopup