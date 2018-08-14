import React, { Component } from "react";
import axios from "axios";
import SingleTag from "./SingleTag";
import "../index.css";

export default class TagCloud extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTag: null
    };
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            padding: "10px 0px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start"
            // maxWidth: 600,
          }}
        >
          {this.props.tags.map((tag, i) => {
            return (
              <SingleTag
                key={i}
                tag={tag}
                currentTag={this.state.currentTag}
                updateCurrentTag={tag => this.setState({ currentTag: tag })}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
