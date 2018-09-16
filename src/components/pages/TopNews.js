import React, { Component } from "react";
import axios from "axios";
import SingleTopic from "../SingleTopic";
import { Row, Col } from "react-bootstrap";

export default class TopNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: []
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:8000/top_news`, {
        Accept: "application/json"
      })
      .then(res => {
        console.log(res.data);
        this.setState({ topics: res.data.topics });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Row style={{ padding: "50px 20px", margin: "0px 10px" }}>
        <SingleTopic topic={this.state.topics[0]} />
      </Row>
    );
  }
}
