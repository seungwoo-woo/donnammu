import React from 'react'
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';


function NewMap(props) {

  const {mapView, mapOptionOnOff} = props

  mapView()
  return (
    <>
      <Button sx={{height:'40px', width:'100%', padding: 0}} variant='contained' color='error' onClick={mapOptionOnOff}>
        지적도 보기 On / Off
      </Button>
      <Paper id="myMap" sx={{mt:2, mb:5,  width: '100%', height: '600px' }}></Paper>
    </>
  )
}

export default NewMap