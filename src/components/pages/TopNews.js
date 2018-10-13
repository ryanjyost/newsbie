import React, { Component } from "react";
import axios from "axios";
import SingleTopic from "../SingleTopic";
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
      .get(`https://birds-eye-news-api.herokuapp.com/top_news`, {
        Accept: "application/json"
      })
      .then(res => {
        this.setState({ topics: res.data.topics, batches: res.data.batches });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.topics.length < 1) {
      return (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Loader
            loaderHeight={"300px"}
            loadingMessage={"Loading and analyzing the news..."}
          />
        </div>
      );
    } else {
      return (
        <div style={{ width: "100%" }}>
          {this.state.topics.map((topic, i) => {
            return (
              <SingleTopic
                key={i}
                topic={topic}
                allTagBatches={this.state.batches}
                styles={this.props.styles}
              />
            );
          })}
        </div>
      );
    }
  }
}
