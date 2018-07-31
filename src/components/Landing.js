import React, { Component } from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { Icon } from "react-icons-kit";
import { scissors } from "react-icons-kit/ionicons/scissors";
import { balanceScale } from "react-icons-kit/fa/balanceScale";
import { androidTime } from "react-icons-kit/ionicons/androidTime";
import { androidHappy } from "react-icons-kit/ionicons/androidHappy";
import { iosEye } from "react-icons-kit/ionicons/iosEye";

export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  render() {
    const Feature = () => {
      return (
        <div
          style={{
            width: 300,
            height: 200,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            margin: 20,
            borderRadius: 5,
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 3px 6px rgba(0,0,0,0.05), 0 2px 2px rgba(0,0,0,0.10)"
          }}
        >
          <Icon
            style={{ margin: "auto", color: "rgba(33, 58, 73, 0.7)" }}
            icon={scissors}
            size={50}
          />
          <h3 style={{ textAlign: "center", color: "rgba(33, 58, 73, 0.7)" }}>
            News Aggregator
          </h3>
        </div>
      );
    };

    const renderSignUp = () => {
      const url =
        "https://newsbie.us18.list-manage.com/subscribe/post?u=bbab41b4faa898c5bb1f4c2e1&amp;id=75f26540d8";

      return (
        <MailchimpSubscribe
          url={url}
          render={({ subscribe, status, message, onValidated }) => {
            console.log(status, message);
            return (
              <div
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                className="validate"
                style={{
                  // display: "flex",
                  // flexDirection: "column",
                  // justifyContent: "center",
                  // alignItems: "center",
                  position: "absolute",
                  bottom: "0px",
                  width: "100%",
                  padding: "10px 20px 0px 20px",
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(245, 245, 245, 0), rgba(245, 245, 245, 0.25), rgba(245, 245," +
                    " 245, 0.5), rgba(245, 245, 245, 0.5), rgba(245, 245, 245, 0.75), rgba(245, 245, 245, 1))"
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <h4
                      style={{
                        textAlign: "center",
                        lineHeight: 1.3,
                        color: "rgba(33, 58, 73, 1)"
                      }}
                    >
                      <span style={{ color: "rgba(33, 58, 73, 0.9)" }}>
                        Join our mailing list for updates on the
                      </span>{" "}
                      <br />{" "}
                      <span style={{ fontWeight: "bold" }}>
                        upcoming app + early access
                      </span>
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 10
                      }}
                    >
                      <input
                        type="email"
                        value={this.state.email}
                        name="EMAIL"
                        className="email emailSignUpInput"
                        id="mce-EMAIL"
                        placeholder="jsnow44@winterfell.gov"
                        required
                        style={{
                          padding: "5px 15px",
                          height: 45,
                          borderRadius: 3,
                          width: 245,
                          fontSize: 16,
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0
                          // marginRight: 5
                        }}
                        onChange={e => this.setState({ email: e.target.value })}
                      />
                      <div
                        style={{ position: "absolute", left: -5000 }}
                        aria-hidden="true"
                      >
                        <input
                          type="text"
                          name="b_bbab41b4faa898c5bb1f4c2e1_75f26540d8"
                          tabIndex="-1"
                          value=""
                        />
                      </div>
                      <div className="clear">
                        <button
                          type="submit"
                          // name="subscribe"
                          // id="mc-embedded-subscribe"
                          className="button emailSignUpButton cta"
                          style={{
                            height: 45,
                            fontSize: 16,
                            padding: "0px 20px",
                            width: 100,
                            backgroundColor: "rgba(33, 58, 73, 0.9)",
                            color: "rgba(255, 255, 255, 1)",
                            borderTopRightRadius: 5,
                            borderBottomRightRadius: 5,
                            border: "1px solid rgba(33, 58, 73, 0.9)"
                          }}
                          onClick={() => {
                            if (this.validateEmail(this.state.email)) {
                              console.log("SUBSCRIBE");
                              subscribe({ EMAIL: this.state.email });
                            } else {
                              alert("error");
                            }
                          }}
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {status === "sending" && (
                  <div style={{ color: "blue" }}>sending...</div>
                )}
                {status === "error" && (
                  <div style={{ color: "red" }}>ERROR</div>
                )}
                {status === "success" && (
                  <div style={{ color: "green" }}>Subscribed !</div>
                )}
              </div>
            );
          }}
        />
      );
    };

    if (false) {
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: 300 * 6,
            height: 300 * 5,
            marginTop: 80
          }}
        >
          {this.props.records.map(record => {
            if (record.site.name !== "usatoday") {
              return (
                <img
                  height={300}
                  width={300}
                  src={`https://d1dzf0mjm4jp11.cloudfront.net/${record.image}`}
                  // onLoad={() => this.setState({ loaded: true })}
                  style={{
                    // display: loaded ? "" : "none",
                    opacity: 1,
                    margin: "auto"
                  }}
                />
              );
            }
          })}
        </div>
      );
    } else {
      return (
        <div
          className="main"
          style={{
            maxWidth: "100%",
            overflowX: "hidden",
            backgroundColor: "rgba(245, 245, 245, 1)"
          }}
        >
          {/* MAIN LANDING  */}
          <div style={{ height: 400, position: "relative" }}>
            <div
              style={{
                backgroundImage: "url(/images/sitesBackground.png)",
                marginTop: 60,
                height: "100%",
                width: "100%",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                filter: "opacity(0.1)",
                position: "relative"
              }}
            />
            <div
              style={{
                zIndex: 5,
                position: "absolute",
                height: "100%",
                width: "100%",
                paddingTop: 120,
                top: 0
              }}
            >
              <h1
                style={{
                  color: "#12232D",
                  textAlign: "center",
                  fontWeight: "normal",
                  padding: "0px 20px",
                  letterSpacing: "0.03em",
                  lineHeight: 1.3,
                  fontWeight: "bold"
                }}
              >
                Fix the broken way <br />you get your news
              </h1>

              {renderSignUp()}
            </div>
          </div>

          {/* Quick pitch + benefits */}
          <div
            style={{
              margin: "auto",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              // borderTop: "2px solid rgba(255, 255, 255, 0.1)",
              marginTop: "40px",
              fontSize: 24,
              padding: "30px 20px 0px 20px",
              width: "100%",
              letterSpacing: "0.03em",
              textAlign: "center",
              color: "rgba(33, 58, 73, 0.7)",
              backgroundImage:
                "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.25), rgba(255, 255," +
                " 255, 0.5), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 1))"
            }}
          >
            <div
              style={{
                fontSize: 16,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 50,
                color: "rgba(33, 58, 73, 0.5)"
              }}
            >
              scroll for the whole spiel<br />
              <br /> &darr;
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  color: "rgba(255, 255, 255, 1)",
                  transform: "skew(-20deg)" /* SKEW */,
                  backgroundColor: "rgba(33, 58, 73, 1)",
                  display: "inline-block",
                  padding: "5px 20px",
                  borderRadius: 3
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    transition: "background 0.2s",
                    transform: "skew(20deg)" /* SKEW */
                  }}
                >
                  newsbie
                </div>
              </div>

              <div
                style={{
                  color: "rgba(33, 58, 73, 1)",
                  marginTop: 20,
                  display: "inline-block"
                }}
              >
                is a command center for news junkies
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div
            style={{
              padding: "100px 20px 70px 20px",
              fontSize: 20,
              width: "100%",
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#fff"
              // backgroundImage:
              //   "linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1), rgba(255, 255," +
              //   " 255, 1), rgba(255, 255, 255, 1), rgba(255, 255, 255, 1), rgba(255, 255, 255, 1))"
            }}
          >
            <div
              style={{
                color: "rgba(33, 58, 73, 0.9)",
                fontSize: 24,
                textAlign: "center",
                borderBottom: "2px solid rgba(46, 228, 246, 0.6)",
                paddingBottom: 10
              }}
            >
              It's a web app that enables you to...
            </div>
            <div style={{ marginTop: 10, color: "rgba(33, 58, 73, 0.7)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 5px"
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
                      marginRight: 5
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
                  padding: "10px 5px"
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
                      marginRight: 5
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
                  padding: "10px 5px"
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
                      marginRight: 5
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
                  padding: "10px 5px"
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
                      marginRight: 5
                    }}
                    icon={iosEye}
                    size={32}
                  />
                </div>
                gather valuable insights from unique tools and data
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 5px"
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
                      marginRight: 5
                    }}
                    icon={androidHappy}
                    size={28}
                  />
                </div>
                do a bunch of other stuff I can't think of (yet)
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              fontSize: 26,
              // marginTop: 40,
              color: "rgba(33, 58, 73, 0.7)",
              padding: "80px 0px",
              backgroundImage:
                "linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(46, 228, 246, 0.1), " +
                "rgba(46, 228, 246, 0.1), rgba(46, 228, 246, 0.2), rgba(46, 228, 246, 0.2), rgba(46, 228, 246, 0.2))"
            }}
          >
            <div
              style={{
                fontSize: 32,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                transform: "skew(-20deg)" /* SKEW */,
                color: "rgba(33, 58, 73, 1)",
                display: "inline-block",
                padding: "5px 20px",
                borderRadius: 3,
                marginBottom: 30
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  color: "rgba(33, 58, 73, 0.7)",
                  transition: "background 0.2s",
                  transform: "skew(20deg)" /* SKEW */
                }}
              >
                See any features you like?
              </div>
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
          </div>

          <h1>Become a Newsbie</h1>
        </div>
      );
    }
  }
}
