import React, { Component } from "react";
import { PageHeader, ListGroup, Button } from "react-bootstrap";
import "./Home.css";
import { API } from "aws-amplify";
import Geocode from "react-geocode";
import { GoogleApiWrapper, Marker, Map } from 'google-maps-react';
import 'react-rangeslider/lib/index.css'
Geocode.setApiKey('AIzaSyC8nqzSV8q-WBq5IeKMDgUtQDTqeK2F7NA');

const mapStyles = {
  width: '100%',
  height: '50%',
  
};
export class Home extends Component {
  constructor(props) {
    super(props);
    const { lat, lng } = this.props.initialCenter;
    this.state = {
      isLoading: true,
      bathrooms: [],
      radius: 10,      //default radius is 10 miles
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker
      currentLocation: {      // lattidue and longitude of user current locations
        lat: lat,
        lng: lng
      },
      isLoadingMap: true,    //wait until map is loaded and user location is discovered
      address: null,
    };
  }
  //when user clickks marker bring them update page to show details about bathroom
  onMarkerClick = (props, marker, e) =>
  this.props.history.push(marker.to);
  
  routeChange = (props, marker, e) =>
    this.props.history.push(`bathroom/new`);
  
  
  handleSliderOnChange = (value) => {
    this.setState({
      radius: value
    })
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
    try {
      this.getUserLocation();

    } catch (e) {
    alert(e);
    }
   
  }


  getUserLocation(){
    //check if geolocation is supported
    if (navigator.geolocation) {
      //get users cuurent location which will be used for bathroom location returning corrdinate object
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = position.coords;
          // Get address from latidude & longitude.
          Geocode.fromLatLng(coords.latitude, coords.longitude).then(
            response => {
              this.setState({address: response.results[0].formatted_address});
              
            },
            error => {
              console.error(error);
            }
          );
          //set longitude and latidue from postion object
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            },
            error: null,
            //set to false to display current location on map and allow user to create bathroom
            isLoadingMap: false
          });
        },
        (error) => this.setState(
          {error: error.message}
        ),{maximumAge:60000, timeout:5000, enableHighAccuracy:true}
      );

    }
  }
  async getBathrooms(){
    try {
      const bathrooms = await this.bathrooms();
      this.setState({ bathrooms });

    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }
  //get list of all bathrooms within mile radius of users current location
  bathrooms() { 
    var radius = "10000000";
    return API.get("list", `/list_bathrooms?latitude=${this.state.currentLocation.lat}&longitude=${this.state.currentLocation.lng}&radius=${radius}`, {
      body:  null
    });
  }
  //loop through all batrhooms returned from list_bathroom api and display them as clickable markers on map centered at users current location
  renderBathroomsList(bathrooms) {
    return (
      <div style={{width: '100%', height: 415}}> 
        <Map google={this.props.google} zoom={this.props.zoom} style={mapStyles} initialCenter={this.state.currentLocation}>
          {bathrooms.map((marker, i) =>{
            return(
                <Marker key={marker.Bathroom_Id}
                  to={`/bathrooms/${marker.Bathroom_Id}`}
                  name={marker.Address}
                  title={'Bathroom'} 
                  onClick={this.onMarkerClick}
                  position={{lat: marker.Latitude, lng: marker.Longitude}}
                />
            )
          })} 
        </Map>
      </div>
    )
  }
//defaule view 
  renderLander() {
    return (
      <div className="lander">
        <h1>Whiz</h1>
        <p>A simple bathroom tracking app</p>
      </div>
    );
  }

  renderBathrooms() {
    return (
      <div className="bathrooms">

        <PageHeader>Your Bathrooms in your area</PageHeader>
        <Button color="primary" className="px-4" 
        onClick={this.routeChange}>
        Create New Bathroom
        </Button>

        <ListGroup>
          {!this.state.isLoading && this.renderBathroomsList(this.state.bathrooms)}
        </ListGroup>

      </div>
    );
  }

  render() {
    //wait till user location is grabed before creating map/view
    if (this.state.isLoadingMap){
      return "Geolocation is not supported by this browser or error occured getting you location. Please Refresh the page.";
    }else if(this.state.isLoading){
      this.getBathrooms();
    }
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderBathrooms() : this.renderLander()}
      </div>
    );
  }
}
//needed for map
export default GoogleApiWrapper({
  apiKey: 'AIzaSyCd1aKPVphlEKHiRYbfFAhskWl67Apd6sg'
})(Home);
//default values for map
Home.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: 50.7128,
    lng: -80.0060
  },
  centerAroundCurrentLocation: false,
  visible: true,
};