import React, { Component } from "react";
import { ic_close } from "react-icons-kit/md/ic_close";
import { mean, standardDeviation, zScore, median } from "simple-statistics";
import shuffle from "shuffle-array";
import { Link } from "react-router-dom";
import { Icon as AntIcon } from "antd";
import { Icon } from "react-icons-kit";
import { wikipedia } from "react-icons-kit/icomoon/wikipedia";

// components
import { Card, Progress } from "antd";
import { androidTime } from "react-icons-kit/ionicons/androidTime";

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
    console.log("LIST", this.props.list);
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
              const val = zScore(
                this.props.calcValue(tag),
                this.state.mean,
                this.state.sd
              );
              let wikiUrl = tag ? tag.term.replace(/ /g, "+") : "";

              const renderLinks = () => {
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "rgba(0, 0, 0, 0.25)"
                    }}
                  >
                    <a
                      style={{ marginRight: 5 }}
                      target="_blank"
                      href={`http://www.google.com/search?q=${wikiUrl}`}
                    >
                      <AntIcon type="google" size={20} />
                    </a>
                    <a
                      style={{
                        display: "flex",
                        marginRight: 5
                      }}
                      target="_blank"
                      href={`https://en.wikipedia.org/w/index.php?search=${wikiUrl}&title=Special:Search&fulltext=1`}
                    >
                      <Icon icon={wikipedia} size={20} />
                    </a>
                    <a
                      target="_blank"
                      href={`https://twitter.com/search?q=${wikiUrl}`}
                    >
                      <AntIcon type="twitter" size={20} />
                    </a>
                  </div>
                );
              };

              return (
                <div
                  key={i}
                  style={{
                    margin: 5,
                    display: "flex",
                    alignItems: isSmall ? "center" : "stretch",
                    padding: 10,
                    border: "1px solid rgba(0,0,0,0.02)",
                    backgroundColor: "rgba(240,242,245,0.15)"
                  }}
                >
                  <div>
                    <Progress
                      style={{ color: "#1890ff" }}
                      type="circle"
                      percent={Number(
                        Math.floor(this.props.calcValue(tag) * 100).toFixed(0)
                      )}
                      width={isSmall ? 40 : 60}
                    />
                  </div>
                  <div style={{ padding: "0px 10px" }}>
                    <div
                      style={{
                        fontSize: isSmall ? 16 : 20,
                        color: "rgba(0,0,0,0.75)",
                        fontWeight: "500"
                      }}
                    >
                      {tag.term}
                    </div>
                    {!isSmall && renderLinks()}
                  </div>
                </div>
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
