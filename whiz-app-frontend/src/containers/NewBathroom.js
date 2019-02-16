import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./NewBathroom.css";
import { API } from "aws-amplify";
import { GoogleApiWrapper, InfoWindow, Marker, Map } from 'google-maps-react';
import Geocode from "react-geocode";
import StarRatingComponent from 'react-star-rating-component';
Geocode.setApiKey('AIzaSyC8nqzSV8q-WBq5IeKMDgUtQDTqeK2F7NA');

const mapStyles = {
  width: '100%',
  height: '50%',
  
};

export class NewBathroom extends Component {
  constructor(props) {
    super(props);

    const { lat, lng } = this.props.initialCenter;
    this.state = {
      isLoading: null,  //loading for submiting bathroom 
      rating: 1,        //Rating for the bathroom 1-10
      review:  "",      // Review for bathroom
      address: "Address", //the physcial addres for the bathroom
      error:null,       //store any error messages 
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker
      currentLocation: {      // lattidue and longitude of user current locations
        lat: lat,
        lng: lng
      },
      isLoadingMap: true    //wait until map is loaded and user location is discovered
    };

  }
  //delete this after list is set up
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };
  //chaniges rating value based off user input
  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
  }
  //first thing called to get the user current location
  componentDidMount() {
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
        )
      );
    }
  }
  //make sure thier is a review given by user before creating bathroom
  validateForm() {
    return  this.state.review.length > 0;
  }
  //if change occured in one of feilds update the value 
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  //called when user submits create bathroom request
  handleSubmit = async event => {
    event.preventDefault();
    //loading is true to show loading image to user while bathroom is created
    this.setState({ isLoading: true });
    try {
      await this.createBathroom({
        rating: this.state.rating,
        review:  this.state.review,
      });
      //this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  //call lambda function via api gatewate to create new bathroom
  createBathroom(bathroom) {
    /*
      parameters sent to api to create new bathroom
      username: (string)username of person creating the bathroom
      latitiude: (float) lattidue of bathroom location
      longitude: (float)  longitude of bathroom location
      address: (string) pyhscial address of bathroom
      review: (string) user review of bathroom
      rating: (int) 1-10 review of bathroom 
    */
    return API.post("create", `/create_bathroom?username=${this.props.username}&review=${bathroom.review}&rating=${bathroom.rating}&address=${this.state.address}&latitude=${this.state.currentLocation.lat}&longitude=${this.state.currentLocation.lng}`, {      
      body: bathroom
    });
  }
  //render what user will see
  render() {
    //wait till user location is grabed before creating map/view
    if (this.state.isLoadingMap){
      return "Geolocation is not supported by this browser.";
    }
    return (
      <div className="NewBathroom">
        <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="map">
          <ControlLabel>Map</ControlLabel>
          <div style={{width: '100%', height: 415}}> 
          <Map google={this.props.google} zoom={this.props.zoom} style={mapStyles} initialCenter={this.state.currentLocation}>
            <Marker onClick={this.onMarkerClick} name={this.state.address}/>
            <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow} onClose={this.onClose}>
              <div>
                <h4>{this.state.selectedPlace.name}</h4>
              </div>
            </InfoWindow>
          </Map>  
          </div>    
          </FormGroup>
          <FormGroup controlId="Address">
          <ControlLabel>Address</ControlLabel>
          <FormControl
              readOnly={true}
              value={this.state.address}
            />
          </FormGroup>
          <FormGroup controlId="rating">
          <ControlLabel>Rating</ControlLabel>
          
          <div>
            <StarRatingComponent name="rate1" starCount={10} value={this.state.rating} onStarClick={this.onStarClick.bind(this)}/>
          </div>
          </FormGroup>
          <FormGroup controlId="review">
          <ControlLabel>Review</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.review}
              componentClass="textarea"
            />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}
//needed for map
export default GoogleApiWrapper({
  apiKey: 'AIzaSyCd1aKPVphlEKHiRYbfFAhskWl67Apd6sg'
})(NewBathroom);
//default values for map
NewBathroom.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: 50.7128,
    lng: -80.0060
  },
  centerAroundCurrentLocation: false,
  visible: true,
};