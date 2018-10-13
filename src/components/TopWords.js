import React, { Component } from "react";
import { mean, standardDeviation } from "simple-statistics";
import shuffle from "shuffle-array";
import { Link } from "react-router-dom";

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
    const list = this.props.shuffle
      ? shuffle(this.props.list)
      : this.props.list;
    this.setState({ list });
  }

  render() {
    const { list } = this.state;
    const {
      screenWidth,
      suppList,
      isRelatedWords,
      isTermAnalysis
    } = this.props;

    let isSmall = screenWidth < 500;

    const renderTab = () => {
      return (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {list.map((tag, i) => {
              return (
                <SingleWordItem
                  isTermAnalysis={isTermAnalysis}
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
                        fontSize: isSmall ? 15 : 17,
                        color: "rgba(0,0,0,0.7)",
                        fontWeight: "400"
                      }}
                    >
                      {/*<Link*/}
                      {/*to={`/app/terms/${tag.term.replace(" ", "-")}`}*/}
                      {/*className={"hoverUnderline"}*/}
                      {/*// style={{*/}
                      {/*//   fontSize: isSmall ? 15 : 17,*/}
                      {/*//   color: "rgba(0,0,0,0.7)",*/}
                      {/*//   fontWeight: "400"*/}
                      {/*// }}*/}
                      {/*>*/}
                      {tag.term}
                      {/*</Link>*/}
                      <span
                        style={{
                          marginLeft: 5,
                          fontSize: isSmall ? 14 : 16,
                          color: "rgba(0,0,0,0.4)"
                        }}
                      >
                        {Number(this.props.calcValue(tag) * 100).toFixed(1)}%
                      </span>
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
              {isRelatedWords
                ? `percentage frequency in recent articles that contain "${
                    this.props.termRelatedTo
                  }"`
                : "percentage frequency in" +
                  " a balanced sample of recent articles"}
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
