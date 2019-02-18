import React, { Component } from "react";
import { API } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Bathrooms.css";
import StarRatingComponent from 'react-star-rating-component';

export default class Bathrooms extends Component {
  constructor(props) {
    super(props);


    this.state = {
      isLoading: null,
      isDeleting: null,
      bathroom: null,
      key: null,
      user_review: "",
      user_rating:1
    };
  }

  async componentDidMount() {
    try {
      const bathroom_data = await this.getBathroom();
      var keys = Object.keys(bathroom_data.Reviews);
      this.setState({
        bathroom:bathroom_data,
        users: keys
      });
    } catch (e) {
      alert(e);
    }
  }

  getBathroom() {
    return API.get("get", `/get_bathroom?bathroom_id=${this.props.match.params.id}`);
  }
  addBathroomReview() {
    return API.get("update", `/add_review?bathroom_id=${this.props.match.params.id}&username=${this.props.username}&user_rating=${this.state.user_rating}&user_review=${this.state.user_review}`);
  }

  validateForm() {
    return this.state.user_review;
  }
  

  
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
    //chaniges rating value based off user input
    onStarClick(nextValue, prevValue, name) {
      this.setState({user_rating: nextValue});
    }

  
  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    this.addBathroomReview();
    this.setState({ isLoading: false });
    this.props.history.push("/");

  }
  
  
  render() {
    return (
      <div className="Bathrooms">
        {this.state.bathroom &&
          <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="Address">
          <ControlLabel>Address</ControlLabel>
          <FormControl
              readOnly={true}
              value={this.state.bathroom.Address}
            />
          </FormGroup>
          <FormGroup controlId="rating">
          <ControlLabel>Overwall Rating</ControlLabel>
          
          <div>
            <StarRatingComponent name="rate1" starCount={10} value={this.state.bathroom.Rating} />
          </div>
          </FormGroup>

          <FormGroup controlId="review">
          <ControlLabel>Reviews</ControlLabel>
          {this.state.users.map((user, i) =>{
            return(
            <div key={user}>              
            <ControlLabel>{user}</ControlLabel>
              <div>
                <StarRatingComponent name="rate1" starCount={10} value={this.state.bathroom.Reviews[user].User_Rating} />
              </div>
              <FormControl
              readOnly={true}
              value={this.state.bathroom.Reviews[user].User_Review}
              componentClass="textarea"
            />
            </div>
            )
          })}
           
          </FormGroup>
          <FormGroup controlId="user_rating">
          <ControlLabel>Rating</ControlLabel>
          
          <div>
            <StarRatingComponent name="rate1" starCount={10} value={this.state.user_rating} onStarClick={this.onStarClick.bind(this)}/>
          </div>
          </FormGroup>
          <FormGroup controlId="user_review">
          <ControlLabel>Add a Review</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.user_review}
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
              text="Add Review"
              loadingText="Adding…"
            />
          </form>}
      </div>
    );
  }
}