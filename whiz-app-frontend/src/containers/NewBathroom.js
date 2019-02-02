import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewBathroom.css";
import { API } from "aws-amplify";

export default class NewBathroom extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      rating: "",
      review:  ""
    };
  }

  validateForm() {
    return this.state.rating.length > 0;
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
        review:  this.state.review
      });
      //this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  
  createBathroom(bathroom) {
    return API.post("create", "/create_bathroom", {
      body: bathroom
    });
  }
  render() {
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