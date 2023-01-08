import {useState} from 'react';
import Layout from '../components/Layout'
import './index.css'
import UserContext from '../components/UserContext'

const MyApp = ({ Component, pageProps }) => {
    const [userContext, setUserContext] = useState(null)

    if(Component.getLayout){
      return Component.getLayout(<Component {...pageProps} />)
    }
    return (
      
      <UserContext.Provider value={{userContext, setUserContext}}>
        <Layout>
        <Component {...pageProps}/>
        </Layout>
      </UserContext.Provider>
    
    )
  }
export default MyApp