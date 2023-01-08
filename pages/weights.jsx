import React from 'react'
import {MapWeights, AddWeight} from '../components/weights/';
import {handleContext} from '../functions/handleContext';


function Weights() {
  handleContext();
  
  return (
    <div className='min-h-screen'>
    <AddWeight />
    <MapWeights />
    </div>

  )
}

export default Weights