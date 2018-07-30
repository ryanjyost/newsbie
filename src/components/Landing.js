import React, { Component } from "react";
import { Icon } from "react-icons-kit";
import { scissors } from "react-icons-kit/ionicons/scissors";

export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const Feature = () => {
      return (
        <div
          style={{
            width: 300,
            height: 200,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            margin: 20,
            borderRadius: 5,
            padding: 20,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Icon
            style={{ margin: "auto", color: "rgba(255, 255, 255, 0.5)" }}
            icon={scissors}
            size={50}
          />
          <h3
            style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.8)" }}
          >
            News Aggregator
          </h3>
        </div>
      );
    };

    return (
      <div
        className="main"
        style={{
          maxWidth: "100%",
          overflowX: "hidden",
          margin: "50px 10px 0px 10px"
        }}
      >
        <h3
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            textAlign: "center",
            marginTop: 100
          }}
        >
          The news is broken...
        </h3>
        <h2
          style={{
            color: "rgba(46, 228, 246, 0.8)",
            textAlign: "center",
            marginTop: 20,
            fontWeight: "bold"
          }}
        >
          You need an app that fixes it.
        </h2>
        <div
          style={{
            margin: "auto",
            // display: "flex",
            // justifyContent: "center",
            borderTop: "2px solid rgba(255, 255, 255, 0.02)",
            borderBottom: "2px solid rgba(255, 255, 255, 0.02)",
            marginTop: "30px",
            marginBottom: "30px",
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: 24,
            padding: 20,
            maxWidth: 600
          }}
        >
          <span style={{ color: "rgba(255, 255, 255, 1)" }}>newsbie</span>
          <span style={{ color: "rgba(255, 255, 255, 0.5)", marginRight: 5 }}>
            .io
          </span>{" "}
          is a command center for news junkies.<br />
          <br />
          <div
            style={{
              padding: "10px 0px",
              fontSize: 20,
              color: "rgba(255,255,255,0.6)"
            }}
          >
            It enables you to...
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 5px",
                  color: "rgba(255, 255, 255, 0.7)"
                }}
              >
                <div
                  style={{
                    height: 50,
                    width: 60,
                    display: "flex",
                    justifyContent: "flex-end",
                    marginRight: 5
                  }}
                >
                  <Icon
                    style={{
                      marginRight: 5,
                      color: "rgba(255, 255, 255, 0.8)"
                    }}
                    icon={scissors}
                    size={28}
                  />
                </div>
                cut through the bullsh*t of your modern media diet
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 5px",
                  color: "rgba(255, 255, 255, 0.7)"
                }}
              >
                <div
                  style={{
                    height: 50,
                    width: 60,
                    display: "flex",
                    justifyContent: "flex-end",
                    marginRight: 5
                  }}
                >
                  <Icon
                    style={{
                      marginRight: 5,
                      color: "rgba(255, 255, 255, 0.8)"
                    }}
                    icon={scissors}
                    size={28}
                  />
                </div>
                cut through the bullsh*t of your modern media diet
              </div>
            </div>
          </div>
        </div>
        <div>Check out the features we have planned </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Feature />
          <Feature />
          <Feature />
          <Feature />
          <Feature />
        </div>
        <h1>Become a Newsbie</h1>
      </div>
    );
  }
}
