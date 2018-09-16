import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

export default class SingleTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props.topic);
    return (
      <Row
        style={{
          position: "relative",
          borderRadius: 3,
          backgroundColor: "#fff"
        }}
        className={"shadow"}
      >
        <h1>hey</h1>
      </Row>
    );
  }
}
