import React, { Component } from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { Icon } from "react-icons-kit";
import { scissors } from "react-icons-kit/ionicons/scissors";
import { balanceScale } from "react-icons-kit/fa/balanceScale";
import { androidTime } from "react-icons-kit/ionicons/androidTime";
import { androidHappy } from "react-icons-kit/ionicons/androidHappy";
import { iosEye } from "react-icons-kit/ionicons/iosEye";

// benefits
import { androidPhonePortrait } from "react-icons-kit/ionicons/androidPhonePortrait";
import { androidList } from "react-icons-kit/ionicons/androidList";
import { iosSearchStrong } from "react-icons-kit/ionicons/iosSearchStrong";
import { lightbulb } from "react-icons-kit/ionicons/lightbulb";
import { code } from "react-icons-kit/fa/code";
import { newspaperO } from "react-icons-kit/fa/newspaperO";
import { cloud } from "react-icons-kit/ionicons/cloud";
import { androidNotifications } from "react-icons-kit/ionicons/androidNotifications";
import { socialTwitter } from "react-icons-kit/ionicons/socialTwitter";
import { statsBars } from "react-icons-kit/ionicons/statsBars";
import { socialTwitterOutline } from "react-icons-kit/ionicons/socialTwitterOutline";
import { help } from "react-icons-kit/ionicons/help";

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
    const Feature = ({ icon, title, content }) => {
      return (
        <div
          style={{
            width: 280,
            height: 250,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            margin: 20,
            borderRadius: 5,
            padding: "30px 30px",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 3px 6px rgba(0,0,0,0.05), 0 2px 2px rgba(0,0,0,0.10)"
          }}
        >
          <Icon
            style={{ color: "rgba(33, 58, 73, 0.7)" }}
            icon={icon}
            size={50}
          />
          <h4
            style={{
              textAlign: "center",
              color: "rgba(33, 58, 73, 0.9)",
              lineHeight: 1.3,
              margin: "10px 0px"
            }}
          >
            {title}
          </h4>
          <div style={{ textAlign: "center", fontSize: 18 }}>{content}</div>
        </div>
      );
    };

    const renderSignUp = isBottom => {
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
                  // position: isBottom ? "" : "",
                  // bottom: isBottom ? "" : "0px",
                  // top: isBottom ? "0px" : "",
                  padding: "10px 20px 0px 20px",
                  backgroundImage: isBottom
                    ? "linear-gradient(to bottom, rgba(245, 245, 245, 1),rgba(245, 245, 245, 1), rgba(245, 245," +
                      " 245, 0.8), rgba(245, 245, 245, 0.5), rgba(245, 245, 245, 0.2), rgba(245, 245, 245, 0))"
                    : "linear-gradient(to bottom, rgba(245, 245, 245, 0), rgba(245, 245, 245, 0.25), rgba(245, 245," +
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
                        upcoming app + free early access
                      </span>
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
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
                          height: 30,
                          borderRadius: 3,
                          fontSize: 16,
                          width: 250
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

                      <button
                        type="submit"
                        // name="subscribe"
                        // id="mc-embedded-subscribe"
                        className="button emailSignUpButton cta"
                        style={{
                          height: 40,
                          fontSize: 14,
                          padding: "5px 15px",
                          marginTop: 10,
                          backgroundColor: "rgba(33, 58, 73, 0.9)",
                          color: "rgba(255, 255, 255, 1)",
                          border: "1px solid rgba(33, 58, 73, 0.9)",
                          borderRadius: 3,
                          width: 250
                        }}
                        onClick={() => {
                          if (this.validateEmail(this.state.email)) {
                            subscribe({ EMAIL: this.state.email });
                          } else {
                            alert("error");
                          }
                        }}
                      >
                        {!status && "Sign Up"}
                        {status === "sending" && "Sending..."}
                        {status === "success" && "Success!"}
                        {status === "error" && "Error :("}
                      </button>
                    </div>
                  </div>
                </div>
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
                paddingTop: 120,
                top: 0,
                width: "100%"
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
                "rgba(46, 228, 246, 0.1), rgba(46, 228, 246, 0.2), rgba(46, 228, 246, 0.1), rgba(46, 228, 246, 0))"
            }}
          >
            <div
              style={{
                fontSize: 32,
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
                  color: "rgba(33, 58, 73, 0.9)",
                  transition: "background 0.2s",
                  textAlign: "center"
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
                justifyContent: "center",
                maxWidth: 1100
              }}
            >
              <Feature
                icon={androidPhonePortrait}
                title={"Works on all devices"}
                content={
                  "Access the newsbie app on your computer, tablet and mobile devices from a single url"
                }
              />

              <Feature
                icon={androidList}
                title={<span>Everything you love about news aggregators</span>}
                content={
                  <span>
                    Tons of content from <br />dozens of news sources
                  </span>
                }
              />
              <Feature
                icon={androidNotifications}
                title={"Never miss breaking news"}
                content={
                  <span>
                    Newsbie's always watching the news + tells you when you
                    should, too
                  </span>
                }
              />

              <Feature
                icon={iosSearchStrong}
                title={"Filter + search"}
                content={
                  <span>
                    See things the way you want + quickly find what you're
                    looking for
                  </span>
                }
              />
              <Feature
                icon={newspaperO}
                title={"Browse front pages"}
                content={
                  <span>
                    Overlook the media landscape with up-to-date screenshots of
                    news sites.{" "}
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => this.props.switchToDemo()}
                    >
                      Check out the demo
                    </a>
                  </span>
                }
              />
              <Feature
                icon={socialTwitterOutline}
                title={
                  <span>
                    Integrate with your <br />Twitter account
                  </span>
                }
                content={
                  <span>
                    View and manage the <br />Twitter feeds that keep you
                    informed
                  </span>
                }
              />
              <Feature
                icon={lightbulb}
                title={
                  <span>
                    Newsbie tells you <br />what's important
                  </span>
                }
                content={
                  <span>
                    Analyze common words + phrases in the news, with Wikipedia
                    integration so you know what's what
                  </span>
                }
              />
              <Feature
                icon={statsBars}
                title={"Trends + Diagrams"}
                content={<span>We have the data - why not use it?</span>}
              />
              <Feature
                icon={socialTwitter}
                title={"News from Twitter"}
                content={
                  <span>
                    Newsbie analyzes Twitter feeds of news orgs and gives you
                    the best insights
                  </span>
                }
              />
              <Feature
                icon={cloud}
                title={"Modern design + tech"}
                content={
                  <span>
                    Newsbie is fast, powerful + looks pretty damn good, if I do
                    say so myself...
                  </span>
                }
              />
              <Feature
                icon={code}
                title={"Machine learning insights"}
                content={
                  <span>
                    It won't be easy, but the robots may have some interesting
                    things to say
                  </span>
                }
              />
              <div
                style={{
                  width: 300,
                  height: 250,
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  margin: 20,
                  borderRadius: 5,
                  padding: "30px 20px",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow:
                    "0 3px 6px rgba(0,0,0,0.05), 0 2px 2px rgba(0,0,0,0.10)"
                }}
              >
                <Icon
                  style={{ color: "rgba(33, 58, 73, 0.7)" }}
                  icon={help}
                  size={50}
                />
                <h4
                  style={{
                    textAlign: "center",
                    color: "rgba(33, 58, 73, 0.9)",
                    lineHeight: 1.3
                  }}
                >
                  Have an idea?
                </h4>
                <div style={{ textAlign: "center", fontSize: 20 }}>
                  <a href="mailto:ryanjyost@gmail.com?subject=Hey, I've got an idea for Newsbie">
                    Tell Me About It!
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom LANDING  */}
          <div style={{ height: 600, position: "relative" }}>
            <div
              style={{
                backgroundImage: "url(/images/sitesBackground.png)",
                // marginTop: 60,
                height: "100%",
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
                // paddingTop: 120,
                top: 0,
                width: "100%"
              }}
            >
              {renderSignUp(true)}
              <div
                style={{
                  padding: "0px 20px",
                  letterSpacing: "0.03em",
                  lineHeight: 1.3,
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 100
                }}
              >
                <h2
                  style={{
                    color: "#12232D",
                    textAlign: "center",
                    padding: "0px 20px",
                    letterSpacing: "0.03em",
                    lineHeight: 1.3,
                    fontWeight: "bold",
                    marginBottom: 30
                  }}
                >
                  Get a feel for Newsbie's <br />vibe with the demo
                  <span
                    style={{
                      fontSize: 24,
                      color: "rgba(33, 58, 73, 0.9)",
                      fontWeight: "normal"
                    }}
                  />
                </h2>
                <button
                  style={{
                    height: 45,
                    fontSize: 16,
                    padding: "0px 20px",
                    width: 200,
                    backgroundColor: "rgba(33, 58, 73, 0.9)",
                    color: "rgba(255, 255, 255, 1)",
                    borderRadius: 5,
                    border: "1px solid rgba(33, 58, 73, 0.9)",
                    cursor: "pointer"
                  }}
                  onClick={() => this.props.switchToDemo()}
                >
                  Try the demo
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
