import React from 'react'
import { AddExercise, MapExercises } from '../components/exercises'
import {handleContext} from '../functions/handleContext';

function Exercises() {
  handleContext();

  return (
    <div className='min-h-screen'>
    <AddExercise />
    <MapExercises />

    </div>
  )
}

export default Exercises