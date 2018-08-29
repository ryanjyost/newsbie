import React, { Component } from "react";
import axios from "axios";
import SingleTag from "./SingleTag";
import "../index.css";

export default class TagCloud extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let tags = this.props.tags.slice(0, 30);
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
          {/*let topTags = res.data.batch.tags.sort((a,b) => {*/}
          {/*if(a.tf > b.tf){*/}
          {/*return 1*/}
          {/*} else if(b.tf > a.tf){*/}
          {/*return -1*/}
          {/*} else {*/}
          {/*return 0*/}
          {/*}*/}
          {/*})*/}

          {tags.map((tag, i) => {
            return (
              <SingleTag
                key={i}
                tag={tag}
                updateCurrentTag={tag => this.setState({ currentTag: tag })}
                handleClick={() =>
                  this.props.onClickTag(
                    this.props.currentTag
                      ? this.props.currentTag.term === tag.term
                        ? null
                        : tag
                      : tag
                  )
                }
                isFilter={this.props.isFilter}
                currentTag={this.props.currentTag}
              />
            );
          })}
          {this.props.currentTag && this.props.isFilter ? (
            <div
              onClick={() => this.props.onClickTag(null)}
              style={{
                padding: "3px 6px",
                color: "rgba(0,0,0,0.6)",
                fontSize: 10,
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "1px solid #f2f2f2",
                height: 20,
                marginTop: 3,
                marginLeft: 5,
                backgroundColor: "#fcfcfc"
              }}
            >
              <span style={{ transform: "rotate(45deg)", marginRight: 3 }}>
                +
              </span>Clear Filter
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
