import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      bathrooms: []
    };
  }
  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
  
    try {
      const bathrooms = await this.bathrooms();
      this.setState({ bathrooms });
    } catch (e) {
      alert(e);
    }
  
    this.setState({ isLoading: false });
  }
  
  bathrooms() {
    
    var test = "foobar"
    return API.get("app", `/?test=${test}`);
  }
  renderBathroomsList(bathrooms) {
    console.log("Response");
    console.log(bathrooms);
    return [{}].concat(bathrooms).map(
      (bathroom, i) =>
        i !== 0
          ? <LinkContainer
              key={bathroom.bathroomId}
              to={`/bathrooms/${bathroom.bathroomId}`}
            >
              <ListGroupItem header={bathroom.content.trim().split("\n")[0]}>
                {"Created: " + new Date(bathroom.createdAt).toLocaleString()}
              </ListGroupItem>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to="/bathrooms/new"
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> Create a new bathroom
                </h4>
              </ListGroupItem>
            </LinkContainer>
    );
  }

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
        <ListGroup>
          {!this.state.isLoading && this.renderBathroomsList(this.state.bathrooms)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderBathrooms() : this.renderLander()}
      </div>
    );
  }
}