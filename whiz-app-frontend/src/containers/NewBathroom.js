import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewBathroom.css";
import { API } from "aws-amplify";
import { GoogleApiWrapper, InfoWindow, Marker, Map } from 'google-maps-react';
import Geocode from "react-geocode";
Geocode.setApiKey('AIzaSyC8nqzSV8q-WBq5IeKMDgUtQDTqeK2F7NA');

const mapStyles = {
  width: '50%',
  height: '50%'
};

export class NewBathroom extends Component {
  constructor(props) {
    super(props);

    this.file = null;
    const { lat, lng } = this.props.initialCenter;
    this.state = {
      isLoading: null,
      rating: "",
      review:  "",
      address: "Address",
      error:null,
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker
      currentLocation: {
        lat: lat,
        lng: lng
      },
      isLoadingMap: true
    };

  }




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

  componentDidMount() {
    if (navigator.geolocation) {
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
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            },
            error: null,
            isLoadingMap: false
          });
        },
        (error) => this.setState(
          {error: error.message}
        )
      );
    }
  }

  validateForm() {
    return this.state.rating.length > 0 && this.state.review.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    event.preventDefault();
  
    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
      return;
    }
  
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
  
  createBathroom(bathroom) {
    //var user_id = this.props.username
    console.log(bathroom)
    console.log(this.state.currentLocation)
    console.log(this.state.address)
    return API.post("create", `/create_bathroom?username=${this.props.username}&review=${bathroom.review}&rating=${bathroom.rating}&address=${this.state.address}&latitude=${this.state.currentLocation.lat}&longitude=${this.state.currentLocation.lng}`, {      body: bathroom
    });
  }

  render() {
    //wait till user location is grabed before creating map/view
    if (this.state.isLoadingMap){
      return null;
    }
    return (
      <div className="NewBathroom">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="rating">
          <ControlLabel>Rating</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.rating}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="review">
          <ControlLabel>Review</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.review}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>
          <Map
            google={this.props.google}
            zoom={14}
            style={mapStyles}
            initialCenter={this.state.currentLocation}
          >
          <Marker
          onClick={this.onMarkerClick}
          name={this.state.address}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
          </InfoWindow>
          </Map>
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

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCd1aKPVphlEKHiRYbfFAhskWl67Apd6sg'
})(NewBathroom);
NewBathroom.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: 50.7128,
    lng: -80.0060
  },
  centerAroundCurrentLocation: false,
  visible: true,
};