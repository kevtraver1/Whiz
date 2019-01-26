import React, { Component } from "react";
import "./Home.css";

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Whiz</h1>
          <p>A simple app to help you find a bathroom near you</p>
        </div>
      </div>
    );
  }
}