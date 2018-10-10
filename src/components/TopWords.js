import React, { Component } from "react";
import { mean, standardDeviation } from "simple-statistics";
import shuffle from "shuffle-array";

// components
import SingleWordItem from "./SingleWordItem";

export default class TopWords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mean: 0,
      sd: 0,
      list: [],
      tab: "tab1"
    };
  }

  componentDidMount() {
    const values = this.props.list.map(item => {
      return this.props.calcValue(item);
    });

    const avg = mean(values);
    const sd = standardDeviation(values);
    const list = this.props.shuffle
      ? shuffle(this.props.list)
      : this.props.list;
    this.setState({ mean: avg, sd: sd, list });
  }

  render() {
    const { list } = this.state;
    const { screenWidth, suppList } = this.props;

    let isSmall = screenWidth < 500;

    const renderTab = () => {
      return (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {list.map((tag, i) => {
              return (
                <SingleWordItem
                  key={i}
                  tag={tag}
                  isSmall={isSmall}
                  mainValue={Number(
                    Math.floor(this.props.calcValue(tag) * 100).toFixed(0)
                  )}
                />
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              padding: 5,
              alignItems: "center"
            }}
          >
            {suppList.map((tag, i) => {
              return (
                <div
                  key={i}
                  style={{
                    margin: 2,
                    display: "flex",
                    alignItems: isSmall ? "center" : "stretch",
                    padding: 2,
                    border: "1px solid rgba(0,0,0,0.02)",
                    backgroundColor: "rgba(240,242,245,0.15)"
                  }}
                >
                  <div style={{ padding: "0px 2px" }}>
                    <div
                      style={{
                        fontSize: isSmall ? 13 : 15,
                        color: "rgba(0,0,0,0.7)",
                        fontWeight: "400"
                      }}
                    >
                      {tag.term}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <span
              style={{
                fontStyle: "italic",
                color: "rgba(0,0,0,0.2)",
                fontSize: 12,
                padding: 5
              }}
            >
              percentage of recent articles that contain the term
            </span>
          </div>
        </div>
      );
    };

    const tabList = [
      {
        key: "tab1",
        tab: "Frequency"
      },
      {
        key: "tab2",
        tab: "Trends"
      }
    ];

    const contentList = {
      tab1: renderTab(),
      tab2: <p>content2</p>
    };
    return renderTab();
  }
}
