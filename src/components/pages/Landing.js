import React, { Component } from "react";
import { Card, Button } from "antd";
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

    const renderImage = image => {
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
              backgroundColor: "#f0f2f5"
            }}
          >
            hey
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

    let btnStyle = {
      display: "block",
      margin: "auto",
      boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
    };

    const renderHero = () => {
      return (
        <div
          style={{
            ...sectionStyle,
            ...{ backgroundColor: styles.colors.white, paddingTop: 50 }
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
            Newsbie makes it easy to navigate the media landscape, discover
            valuable insights, and take your normal news consumption to the next
            level
          </h5>

          <Button
            style={btnStyle}
            type={"primary"}
            size={"large"}
            onClick={() => this.props.updateIsApp()}
          >
            <Link to="/app">Use the app &rarr;</Link>
          </Button>
        </div>
      );
    };

    return (
      <div style={{ minHeight: "100vh", padding: "60px 0px 50px 0px" }}>
        {renderHero()}

        <h4
          style={{
            textAlign: "center",
            color: "rgba(0,0,0,0.4)",
            margin: "40px 0px 15px 0px"
          }}
        >
          Why would I want to use Newsbie?
        </h4>

        <Card style={cardStyle}>
          <div>
            <h3 style={headerStyle}>Absorb more info in less time</h3>
            <h5 style={subHeaderStyle}>
              Leverage unique tools and metrics that enable you to efficiently
              filter out signals from all the noise.
            </h5>
            {renderImage("landing-main.png")}
          </div>
          improve term area chart!!!!!!! fix content bullshit!!!!!!!
        </Card>
      </div>
    );
  }
}
