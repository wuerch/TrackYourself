import {useContext, useEffect} from 'react'
import UserContext from '../components/UserContext';

async function handleContext(){
    const {userContext, setUserContext} = useContext(UserContext);

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
            }
            
        })
        }

    },[])
    
    


}
module.exports = {handleContext}