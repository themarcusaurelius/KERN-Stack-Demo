import React, { useState, useEffect } from 'react';
import '../App.css';
import { compose, withProps, withHandlers } from "recompose";
import {
  withScriptjs,
  BicyclingLayer,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { green } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Map = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB6kASRMis5abYOVOoo-j6Q-RT4RwBlKno",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
      console.log(clickedMarkers)
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={14}
    defaultCenter={{ lat: 30.2672, lng: -97.7431 }}
    defaultOptions={{
      scrollwheel: false,
      zoomControl: true,
      mapTypeId: 'terrain',
      styles: [
        {
          featureType: "water",
          stylers: [
            { saturation: 43 },
            { lightness: -11 },
            { hue: "#0088ff" }
          ]
        },
        {
          featureType: "road",
          elementType: "geometry.fill",
          stylers: [
            { hue: "#ff0000" },
            { saturation: -100 },
            { lightness: 99 }
          ]
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#808080" }, { lightness: 54 }]
        },
        {
          featureType: "landscape.man_made",
          elementType: "geometry.fill",
          stylers: [{ color: "#ece2d9" }]
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [{ color: "#ccdca1" }]
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#767676" }]
        },
        {
          featureType: "road",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#ffffff" }]
        },
        { featureType: "poi", stylers: [{ visibility: "on" }] },
        {
          featureType: "landscape.natural",
          elementType: "geometry.fill",
          stylers: [{ visibility: "on" }, { color: "#b8cb93" }]
        },
        { featureType: "poi.park", stylers: [{ visibility: "on" }] },
        {
          featureType: "poi.sports_complex",
          stylers: [{ visibility: "on" }]
        },
        { featureType: "poi.medical", stylers: [{ visibility: "on" }] },
        {
          featureType: "poi.business",
          stylers: [{ visibility: "simplified" }]
        }
      ]
    }}
  >
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={40}
    >
      {props.reports.map(data => (
        <Marker
          icon={{
            url: "https://image.flaticon.com/icons/svg/939/939855.svg",
            scaledSize: { height: 20, width: 20 },
            fixedRotation: true,
          }}
          onClick={() => console.log(data._source)}
          position={{ lat: parseFloat(data._source.location.lat), lng: parseFloat(data._source.location.lon) }}
          title={data._source.crime_type}
        /> 
      ))}
    </MarkerClusterer>
    ))}
    <BicyclingLayer/>
  </GoogleMap>
);

const Dashboard = () => {
  const [hasError, setErrors] = useState(false);
  const [reports, setReports] = useState([]);
  const classes = useStyles();
  const [state, setState] = useState({
    age: '',
    name: 'hai',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  async function fetchData() {
    const allReports = await fetch("/api/data/test", { method: 'GET' })
    
    allReports
      .json()
      .then(res => setReports(res.data))
      .catch(err => setErrors(err));
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <React.Fragment>
      {console.log(JSON.stringify(hasError))}
      <div className="Map">
        <Map
          reports={reports}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB6kASRMis5abYOVOoo-j6Q-RT4RwBlKno"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={
            <div
              style={{
                height: `100%`,
                borderRadius: "6px",
                overflow: "hidden"
              }}
            />
          }
          mapElement={<div style={{ height: `100%` }} />}
        >
        </Map>
      </div>
      <FormControl className={classes.formControl}>
        <NativeSelect
          value={state.age}
          onChange={handleChange}
          name="age"
          className={classes.selectEmpty}
          inputProps={{ 'aria-label': 'age' }}
        >
          <option value="">All</option>
         {reports.map(data => (
             <option value={data._source.crime_type}>{data._source.crime_type}</option>
          ))} 
        </NativeSelect>
        <FormHelperText>Select Crime type</FormHelperText>
      </FormControl>
    </React.Fragment>
  );
}

export default Dashboard;