import React, { Component } from "react";
import { Icon } from "react-icons-kit";
import { scissors } from "react-icons-kit/ionicons/scissors";
import { balanceScale } from "react-icons-kit/fa/balanceScale";
import { androidTime } from "react-icons-kit/ionicons/androidTime";
import { androidHappy } from "react-icons-kit/ionicons/androidHappy";

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
          backgroundColor: "#fcfcfc"
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
            fontWeight: "bold",
            padding: "0px 20px"
          }}
        >
          You need an app that fixes it.
        </h2>
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            marginBottom: 50
          }}
        >
          <div
            style={{
              margin: "auto",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              // borderTop: "2px solid rgba(255, 255, 255, 0.1)",
              marginTop: "30px",
              fontSize: 24,
              padding: "30px 20px 0px 20px",
              maxWidth: 600,
              letterSpacing: "0.03em",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.8)"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 1)", fontSize: 32 }}>
                newsbie
              </span>
              <span
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  marginRight: 5,
                  fontSize: 32
                }}
              >
                .io
              </span>{" "}
            </div>
            is a command center for news junkies. <br />
            <br />It enables you to...
          </div>
          <div
            style={{
              padding: "10px 20px",
              fontSize: 20,
              color: "rgba(255,255,255,0.8)",
              maxWidth: 600,
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <div style={{ marginTop: 10 }}>
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
                    icon={balanceScale}
                    size={28}
                  />
                </div>
                gain a clear + balanced view of what's going on
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
                    icon={androidTime}
                    size={28}
                  />
                </div>
                quickly + efficiently get caught up on news you missed
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
                    icon={androidHappy}
                    size={28}
                  />
                </div>
                do a bunch of other stuff I can't think of (yet)
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: 26
          }}
        >
          {/*<div style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.4)" }}>*/}
          {/*The*/}
          {/*</div>*/}
          See any features you like?
        </div>
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
