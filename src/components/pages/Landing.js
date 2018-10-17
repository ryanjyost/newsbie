import React, { Component } from "react";
import { Card, Button, Icon } from "antd";
import { Link } from "react-router-dom";

export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { styles } = this.props;
    const isSmall = styles.screenWidth < 500;

    const cdn = "https://d1dzf0mjm4jp11.cloudfront.net/";

    let sectionStyle = { width: "100%", padding: "40px 20px" };
    let headerStyle = {
      textAlign: "center",
      fontWeight: 700,
      color: "rgba(0,0,0,0.8)",
      lineHeight: 1.3,
      fontSize: 20
    };
    let subHeaderStyle = {
      textAlign: "center",
      fontWeight: 500,
      color: "#9B9B9B",
      padding: "0px 10px",
      fontSize: 15,
      letterSpacing: "0.02em",
      lineHeight: 1.5,
      maxWidth: 500,
      margin: "auto",
      marginBottom: 18
    };
    let cardStyle = {
      backgroundColor: styles.colors.white,
      marginTop: 10,
      marginBottom: 10,
      margin: "auto",
      maxWidth: Math.min(1000, styles.screenWidth - 20),
      paddingTop: 30,
      border: "none",
      borderRadius: 5
    };

    let featureCardStyle = {
      backgroundColor: styles.colors.white,
      margin: 10,
      maxWidth: Math.min(350, styles.screenWidth - 20),
      // padding: "20px 10px",
      border: "none",
      borderRadius: 5
    };
    let featureHeaderStyle = {
      textAlign: "center",
      fontWeight: 700,
      color: "rgba(0,0,0,0.8)",
      lineHeight: 1.3,
      fontSize: 16
    };

    let featureTextStyle = {
      textAlign: "center",
      fontWeight: 500,
      color: "#9B9B9B",
      padding: "0px 10px",
      fontSize: 12,
      letterSpacing: "0.02em",
      lineHeight: 1.5
    };

    let btnStyle = {
      display: "block",
      margin: "auto",
      boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
    };

    const renderImage = image => {
      const Dot = ({ isLeft }) => {
        return (
          <div
            style={{
              height: 8,
              width: 8,
              backgroundColor: "rgba(0,0,0,0.07)",
              borderRadius: 10,
              margin: isLeft ? "0px 3px 0px 6px" : "0px 3px"
            }}
          />
        );
      };
      return (
        <div
          style={{
            borderRadius: 3,
            margin: "auto",
            marginBottom: 30,
            display: "block",
            boxShadow: "0 20px 40px 0 rgba(0,0,0,.15)",
            border: "1px solid rgba(0,0,0,0.1)",
            width: 300
          }}
        >
          <div
            style={{
              width: "100%",
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
              backgroundColor: "#f0f2f5",
              height: 20,
              display: "flex",
              alignItems: "center"
            }}
          >
            <Dot isLeft /> <Dot /> <Dot />
          </div>
          <img
            style={{
              // boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
              borderBottomRightRadius: 3,
              borderBottomLeftRadius: 3
            }}
            src={`${cdn}${image}`}
            width={"100%"}
          />
        </div>
      );
    };

    const renderHero = () => {
      return (
        <div
          style={{
            ...sectionStyle,
            ...{
              backgroundColor: styles.colors.white,
              paddingTop: 50,
              paddingBottom: 80
            }
          }}
        >
          {renderImage("landing-main.png")}
          <h3 style={{ ...headerStyle, ...{ fontSize: isSmall ? 22 : 28 } }}>
            Stay informed {isSmall ? <br /> : null}without going insane
          </h3>
          <h5
            style={{
              ...subHeaderStyle,
              ...{
                fontSize: isSmall ? 15 : 18,
                maxWidth: 600,
                marginBottom: 30
              }
            }}
          >
            {/*Newsbie makes it easy to monitor, analyze and understand the news*/}
            {/*media. Life-long news junkies, beginners, and everyone in*/}
            Newsbie makes it easy for frustrated news consumers to navigate,
            analyze and understand the entire news media landscape.
          </h5>

          <Button
            style={btnStyle}
            type={"primary"}
            size={"large"}
            onClick={() => this.props.updateIsApp()}
          >
            <Link to="/app">
              <span style={{ paddingRight: 8 }}>Use the app</span> &rarr;
            </Link>
          </Button>
        </div>
      );
    };

    const renderGif = () => {
      return (
        <div
          style={{
            padding: "60px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <h3 style={headerStyle}>
            Take your current news habits to the next level with just a few
            clicks
          </h3>

          <video width={Math.min(600, styles.screenWidth - 40)} autoplay>
            <source
              src="https://d1dzf0mjm4jp11.cloudfront.net/newsbie-demo.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      );
    };

    const renderBenefits = () => {
      return (
        <Card style={cardStyle}>
          <div>
            <h3 style={headerStyle}>
              Become a better, {isSmall && <br />}more critical news consumer
            </h3>
            <h5 style={subHeaderStyle}>
              Discover biases, tactics, patterns, trends and other insights that
              bring clarity and context to your normal news reading{" "}
            </h5>
            {renderImage("landing-main.png")}
          </div>

          <div style={{ marginTop: 100 }}>
            <h3 style={headerStyle}>Absorb more info in less time</h3>
            <h5 style={subHeaderStyle}>
              Leverage unique tools and metrics that enable you to efficiently
              find signals in all the noise.
            </h5>
            {renderImage("landing-main.png")}
          </div>

          <div style={{ marginTop: 100 }}>
            <h3 style={headerStyle}>
              Stay grounded with {isSmall && <br />} cold, hard data
            </h3>
            <h5 style={subHeaderStyle}>
              Counterbalance subjectivity and emotion with Newsbie's objective,
              unbiased analysis of news media data.
            </h5>
            {renderImage("landing-main.png")}
          </div>

          <div style={{ marginTop: 100 }}>
            <h3 style={headerStyle}>
              Break free from echo chambers and filter bubbles
            </h3>
            <h5 style={subHeaderStyle}>
              Newsbie's balanced, bird's eye view of the entire news media
              landscape let's you see every story and theme from multiple
              angles.
            </h5>
            {renderImage("landing-main.png")}
          </div>
        </Card>
      );
    };

    const renderSlack = () => {
      return (
        <div
          style={{
            padding: "60px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <h3 style={headerStyle}>
            Want to share and discuss ideas about the news media?
          </h3>
          <a
            style={{
              display: "inline-block",
              margin: "auto",
              marginTop: 20
            }}
            target={"_blank"}
            href={
              "https://join.slack.com/t/newsbie/shared_invite/enQtNDU0OTgwOTc5ODU4LTg4M2U4OGJhYTEwNmEyM2I0ZDNkOWE5OGVjZmMxOGQ1M2I3ZDFkODE5ODBmZTFiNWI2MzIyNjY0MjRiYjI4Njg"
            }
          >
            <Button
              style={{
                backgroundColor: "#443642",
                color: "#fff",
                display: "flex",
                alignItems: "center"
              }}
              size="large"
            >
              <Icon type={"slack"} />Join the Slack Group
            </Button>
          </a>
        </div>
      );
    };

    const renderFeatures = () => {
      return (
        <Card style={featureCardStyle}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <h3 style={featureHeaderStyle}>
              Become a better, {isSmall && <br />}more critical news consumer
            </h3>
            <h6 style={featureTextStyle}>
              Discover biases, tactics, patterns, trends and other insights that
              bring clarity and context to your normal news reading{" "}
            </h6>
          </div>
        </Card>
      );
    };

    return (
      <div style={{ minHeight: "100vh", padding: "60px 0px 50px 0px" }}>
        {renderHero()}

        <div style={{ margin: "60px 0px 0px 0px" }}>{renderBenefits()}</div>
        {renderSlack()}

        {renderFeatures()}
      </div>
    );
  }
}
