import React from 'react'
import AddKalorien from '../components/kalorien/AddKalorien';
import MapKalorien from '../components/kalorien/MapKalorien';
import {handleContext} from '../functions/handleContext';


function Kalorien() {
  handleContext();

  return (
    <div className='min-h-screen'>
    <AddKalorien />
    <MapKalorien />
    
    </div>
  )
}

export default Kalorien