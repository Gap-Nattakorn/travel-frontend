
/*global google*/
import React, { useEffect, useState } from "react";
import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  DirectionsRendererProps
  
} from "react-google-maps";
const  MapPlan = (props) =>  {
  const locations = props.location;
  const countLocations = locations.length;
  const waypoints = [];
  console.log(locations);
  const [directions, setDirections] = useState();
  const [origin] = useState(props.origin);
  const [destination] = useState(locations[countLocations-1].location);
  if(countLocations >= 1){
    for(var i = 0; i < (countLocations-1); i++){
      waypoints.push({location:locations[i].location})
    }
  }
  
    //setOrigin(locations[0].location);
      //setDestination(locations[1].location);

  useEffect(() => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: locations[countLocations-1].location,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        console.log(result)
        console.log(status)
        if (status === google.maps.DirectionsStatus.OK) {
          // console.log(result);
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
    
  },[])

  
    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
        //defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
        defaultZoom={5}
        
      >
        <DirectionsRenderer
          directions={directions}
          options={{draggable:false}}
        />
      </GoogleMap>
    ))

    return (
      <div>
        <GoogleMapExample
          containerElement={<div style={{ height: `15rem`, width: "100%" }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  
}

export default MapPlan;
