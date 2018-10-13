import React, { Component } from "react";
import axios from "axios/index";
import SingleWordItem from "../SingleWordItem";
import Loader from "../Loader";
import numeral from "numeral";
import { Card, Icon as AntIcon } from "antd";

export default class Trends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comparisons: null,
      currentComparison: null,
      positiveTab: "day",
      brandNewTab: "day",
      negativeTab: "day",
      neutralTab: "day"
    };
  }

  componentDidMount() {
    axios
      .get("https://birds-eye-news-api.herokuapp.com/trends", {
        Accept: "application/json"
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          currentComparison: res.data.comparisons.threeHours,
          comparisons: res.data.comparisons
        });
      })
      .catch(err => console.log(err));
  }

  displayTextForTab(tab) {
    switch (tab) {
      case "threeHours":
        return "3 hours ago";
      case "twelveHours":
        return "12 hours ago";
      case "day":
        return "1 day ago";
      case "week":
        return "1 week ago";
      case "month":
        return "1 month ago";
      default:
        return "";
    }
  }

  render() {
    const { styles } = this.props;
    const { positiveTab, brandNewTab, negativeTab, neutralTab } = this.state;
    const isSmall = styles.screenWidth < 500;
    const cardMaxWidth = 1100;
    const tabList = [
      { key: "threeHours", tab: "3 hours" },
      { key: "twelveHours", tab: "12 hours" },
      { key: "day", tab: "24 hours" },
      { key: "week", tab: "week" },
      { key: "month", tab: "month" }
    ];

    const renderPositive = () => {
      return (
        <Card
          style={{
            width: "100%",
            maxWidth: cardMaxWidth,
            marginBottom: 30
          }}
          tabList={tabList}
          activeTabKey={positiveTab}
          onTabChange={key => this.setState({ positiveTab: key })}
        >
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {this.state.comparisons[positiveTab].positive.map((item, i) => {
              return (
                <SingleWordItem
                  isPercentageChange
                  key={i}
                  tag={item.tag}
                  isSmall={isSmall}
                  mainValue={Number(item.diff).toFixed(0)}
                  compValMain={Number(item.tag.freq * 100).toFixed(1)}
                  compValPrev={Number(item.match.freq * 100).toFixed(1)}
                />
              );
            })}
          </div>
        </Card>
      );
    };

    const renderBrandNew = () => {
      return (
        <Card
          style={{
            width: "100%",
            maxWidth: cardMaxWidth,
            marginBottom: 30
          }}
          tabList={tabList}
          activeTabKey={brandNewTab}
          onTabChange={key => this.setState({ brandNewTab: key })}
        >
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {this.state.comparisons[brandNewTab].brandNew.map((item, i) => {
              return (
                <SingleWordItem
                  key={i}
                  tag={item.tag}
                  isSmall={isSmall}
                  mainValue={Number(item.tag.freq * 100).toFixed(0)}
                  color={"rgb(135, 208, 104)"}
                />
              );
            })}
          </div>
        </Card>
      );
    };

    const renderNeutral = () => {
      return (
        <Card
          style={{
            width: "100%",
            maxWidth: cardMaxWidth,
            marginBottom: 30
          }}
          tabList={tabList}
          activeTabKey={neutralTab}
          onTabChange={key => this.setState({ neutralTab: key })}
        >
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {this.state.comparisons[neutralTab].neutral.map((item, i) => {
              return (
                <SingleWordItem
                  key={i}
                  tag={item.tag}
                  isSmall={isSmall}
                  mainValue={Number(item.tag.freq * 100).toFixed(0)}
                />
              );
            })}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#d8d8d8",
              width: "100%",
              textAlign: "right"
            }}
          >
            as a percentage of recent headlines
          </div>
        </Card>
      );
    };

    const renderNegative = () => {
      return (
        <Card
          style={{
            width: "100%",
            maxWidth: cardMaxWidth,
            marginBottom: 30
          }}
          tabList={tabList}
          activeTabKey={negativeTab}
          onTabChange={key => this.setState({ negativeTab: key })}
        >
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {this.state.comparisons[negativeTab].negative.map((item, i) => {
              return (
                <SingleWordItem
                  isPercentageChange
                  key={i}
                  tag={item.tag}
                  isSmall={isSmall}
                  mainValue={Number(item.diff).toFixed(0)}
                  compValMain={Number(item.tag.freq * 100).toFixed(1)}
                  compValPrev={Number(item.match.freq * 100).toFixed(1)}
                />
              );
            })}
          </div>
        </Card>
      );
    };

    if (!this.state.comparisons) {
      return <Loader loaderHeight={"100vh"} />;
    } else {
      return (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding:
                styles.screenWidth > 500
                  ? "100px 20px 50px 20px"
                  : "100px 10px 50px 10px"
            }}
          >
            {/* ============ POSITIVE  ============ */}
            <h4
              style={{
                marginBottom: 15,
                fontWeight: "normal",
                color: "rgba(0,0,0,0.5)"
              }}
            >
              Terms{" "}
              <span style={{ color: "rgb(135, 208, 104)", fontWeight: "bold" }}>
                increasing in frequency
              </span>{" "}
              compared to{" "}
              <span>
                <strong>{this.displayTextForTab(positiveTab)}</strong>
              </span>
            </h4>
            {renderPositive()}

            {/* ============ POSITIVE  ============ */}
            <h4
              style={{
                marginBottom: 15,
                fontWeight: "normal",
                color: "rgba(0,0,0,0.5)"
              }}
            >
              Terms{" "}
              <span style={{ color: "rgb(255, 85, 0)", fontWeight: "bold" }}>
                declining in frequency
              </span>{" "}
              compared to{" "}
              <span>
                <strong>{this.displayTextForTab(negativeTab)}</strong>
              </span>
            </h4>
            {renderNegative()}

            {/* ============ POSITIVE  ============ */}
            <div style={{ marginBottom: 15 }}>
              <h4
                style={{
                  fontWeight: "normal",
                  color: "rgba(0,0,0,0.5)",
                  marginBottom: 5
                }}
              >
                Terms{" "}
                <span style={{ color: "#1890ff", fontWeight: "bold" }}>
                  gaining initial traction
                </span>{" "}
                that were rare{" "}
                <span>
                  <strong>{this.displayTextForTab(brandNewTab)}</strong>
                </span>
              </h4>
              <h6 style={{ color: "rgba(0,0,0,0.3)", marginTop: 5 }}>
                These terms had the below frequencies recently, but were
                negligible at the beginning of the time frame.{" "}
              </h6>
            </div>
            {renderBrandNew()}

            {/* ============ NEUTRAL  ============ */}
            <div>
              <h4
                style={{
                  marginBottom: 15,
                  marginRight: 5,
                  fontWeight: "normal",
                  color: "rgba(0,0,0,0.5)"
                }}
              >
                Terms that are{" "}
                <span style={{ fontWeight: "bold" }}>pretty much the same</span>{" "}
                compared to{" "}
                <span>
                  <strong>{this.displayTextForTab(neutralTab)}</strong>
                </span>
              </h4>
            </div>
            {renderNeutral()}
          </div>
        </div>
      );
    }
  }
}
