import React, {useContext} from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import UserContext from '../UserContext';

function MapWeights() {
    const {userContext, setUserContext} = useContext(UserContext);

    async function handleDelete({weight}){
    
        //DELETE REQUEST
        await fetch(`/api/weights`, {
               method: 'DELETE',
               credentials: 'include', 
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({
                 _id: weight._id,
                 date: weight.date
               }),
        }).then(res => {
          return res.json()    
        }).then(res => {
          if(res.status === 200){
            
            const filteredWeights = userContext.weights.filter(singleWeight => singleWeight.date != weight.date)
            
            setUserContext((prev) => {
                return {
                    ...prev, 
                    weights:filteredWeights}
            })
            
           
          }
        }).catch(error => console.error('Error:', error));
    
        
      }
    
  return (
    <div>

      {userContext ? userContext.weights.length > 0 ? <div>
            <div className='flex justify-around'>
              <p className='basis-0 grow'>Date</p>
              <p className='basis-0 grow'>Weight</p>
              <p className='basis-0 grow'>Delete</p>
            </div>    
            <hr/>       
      </div>: "" : ""}

      {userContext? userContext.weights.length > 0 ? userContext.weights.map((weight, index) => {
                  return (
                    <div key={index} index={weight._id} className='flex justify-around'>
                      <p className='basis-0 grow'>{weight.date === null? "" : weight.date.slice(8,10) + "." + weight.date.slice(5,7)}</p>
                      <p className='basis-0 grow'>{weight.weight} kg</p>
                      <div className='basis-0 grow'><button className='bg-[#BA1000] hover:cursor-pointer' onClick={(props) => handleDelete({weight})}><ClearIcon /></button></div>
                    </div>
                  )
          }).reverse() : "" : ""
      }
      
    </div>
  )
}

export default MapWeights