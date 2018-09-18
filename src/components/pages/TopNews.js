import React, { Component } from "react";
import axios from "axios";
import SingleTopic from "../SingleTopic";
import { Row, Col } from "react-bootstrap";
import Loader from "../../components/Loader";

export default class TopNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      batches: []
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:8000/top_news`, {
        Accept: "application/json"
      })
      .then(res => {
        console.log(res.data);
        this.setState({ topics: res.data.topics, batches: res.data.batches });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (!this.state.topics.length) {
      return (
        <div>
          <Loader
            loaderHeight={"100vh"}
            loadingMessage={"Loading and analyzing the news..."}
          />
        </div>
      );
    } else {
      return (
        <Row
          style={{
            padding: "50px 20px",
            margin: "0px 10px",
            maxWidth: 800,
            margin: "auto"
          }}
        >
          {this.state.topics.map((topic, i) => {
            return (
              <SingleTopic
                key={i}
                topic={topic}
                allTagBatches={this.state.batches}
              />
            );
          })}
        </Row>
      );
    }
  }
}
