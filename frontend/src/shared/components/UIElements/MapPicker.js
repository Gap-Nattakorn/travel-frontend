import React, { useState, useEffect } from 'react'
 
import MapPicker from 'react-google-map-picker'
import LoadingSpinner from './LoadingSpinner';
 
const DefaultLocation = { lat: 13.7244416, lng: 100.3529128};
const DefaultZoom = 10;
 
const Picker = (props) => {
 
  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  // const [location, setLocation] = useState();
  const [zoom, setZoom] = useState(DefaultZoom);


   useEffect(()=>{
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
           var pos = {
             lat: position.coords.latitude,
             lng: position.coords.longitude
           }; 
        
           setDefaultLocation(pos)
          //  setLocation(pos)
           props.getLocation({lat:pos.lat,lng:pos.lng})

        })
        }else {
          alert("test");
          setDefaultLocation(DefaultLocation)
          // setLocation(DefaultLocation)
          props.getLocation({lat:DefaultLocation.lat,lng:DefaultLocation.lng})

        }
   },[props.getLocation])
  
 
  function handleChangeLocation (lat, lng){
    //setLocation({lat, lng});
    props.getLocation({lat, lng})
  }
  
  function handleChangeZoom (newZoom){
    setZoom(newZoom);
  }
 
  // function handleResetLocation(){
  //   setDefaultLocation({ ... DefaultLocation});
  //   setZoom(DefaultZoom);
  // }

  // if(!defaultLocation){
  //     setDefaultLocation(DefaultLocation)
  //     setLocation(DefaultLocation)
  // }
 
  return (
    <React.Fragment>
    {!defaultLocation && <LoadingSpinner asOverlay/>}
    {defaultLocation && <MapPicker defaultLocation={defaultLocation}
      zoom={zoom}
      style={{height:'300px',marginBottom:'20px'}}
      onChangeLocation={handleChangeLocation} 
      onChangeZoom={handleChangeZoom}
      apiKey='AIzaSyDfK98MiY6PIOgnaRS3xqYSi4bqW6z2LwQ'/>}
    </React.Fragment>
  )
}
export default Picker;
