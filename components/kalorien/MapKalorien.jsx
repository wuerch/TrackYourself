import React, {useEffect, useContext} from 'react'
import UserContext from '../UserContext';
import { MdClear} from "react-icons/md";

function MapKalorien() {
    const {userContext, setUserContext} = useContext(UserContext);

    function handleFilter(kalorienArray, deletedMahlzeit, date){
        
        const mappedKalorien = kalorienArray.map(object => {
            
        if(object.date === date){
            const filteredMahlzeiten = object.mahlzeiten.filter(mahlzeit => {
                return(
                mahlzeit.mahlzeit !== deletedMahlzeit.mahlzeit 
                | mahlzeit.gewicht !== deletedMahlzeit.gewicht 
                | mahlzeit.kalorien !== deletedMahlzeit.kalorien 
                )
            })
            return {
                date: object.date,
                _id: object._id,
                mahlzeiten: filteredMahlzeiten
            }
        }else{
            return object
        }
        })
        return mappedKalorien;
    }

    async function handleDelete({mahlzeit}, date){
    
        //DELETE REQUEST
        await fetch(userContext.base_url + `/api/mahlzeit`, {
            method: 'DELETE',
            credentials: 'include', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                mahlzeit: mahlzeit,
                date: date
            }),
        }).then(res => {
        return res.json()    
        }).then(res => {
        if(res.status === 200){

            const filteredKalorien = handleFilter(userContext.kalorien, mahlzeit, date)

            setUserContext((prev) => {
                return {
                    ...prev,
                    kalorien: filteredKalorien
                }
            })

        }
        }).catch(error => console.error('Error:', error));
        
    }

  return (
    <div className='text-red flex flex-col mt-2'>
        {   //First we iterating through the date object and adding the header if the day exists, afterward we add we meals
            userContext ? userContext.kalorien ? userContext.kalorien.length > 0 ? userContext.kalorien.map((tag, index) => {
                return (
                <div key={index}>
                      {tag.mahlzeiten ? tag.mahlzeiten.length > 0 ? <div>
                        <p className='gradient'>{tag.date.slice(0,10)}</p>
                        <div className="flex justify-around">
                          <p className='basis-0 grow'>Meal</p>
                          <p className='basis-0 grow'>Gramm</p>
                          <p className='basis-0 grow'>Calories</p>
                          <p className='basis-0 grow-[0.5]'>Delete</p>
                        </div>
                      <hr/>
                        
                      </div>: "" : ""
                    }
                    {tag.mahlzeiten.map((mahlzeit, index)=>{
                        return (
                        <div key={index} className='flex justify-around'>
                            <p className='basis-0 grow'>{mahlzeit.mahlzeit}</p>
                            <p className='basis-0 grow'>{mahlzeit.gewicht} g</p>
                            <p className='basis-0 grow'>{mahlzeit.kalorien} kcal</p>
                            <div className='basis-0 grow-[0.5] flex justify-center'><div className='w-min h-min bg-[#BA1000] hover:cursor-pointer' onClick={() => handleDelete({mahlzeit}, tag.date)}><MdClear /></div></div>
                        </div>
                        )
                    })}
                </div>
                )
                

            }): "" : "" : ""
        }
    
      
    </div>)
}

export default MapKalorien