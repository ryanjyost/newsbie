import React, { Component } from "react";
import axios from "axios/index";
import { Card, Icon, Input, Button, Radio } from "antd";
import { Link } from "react-router-dom";
import { features } from "../../upcoming";
import shuffle from "shuffle-array";
import store from "store";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class Upcoming extends Component {
  constructor(props) {
    super(props);
    this.state = {
      features: shuffle(features),
      votesByFeature: null,
      openEndedFeedback: "",
      openEndedFeedbackSubmitted: false,
      // 0-4
      options: [
        { value: 4, text: "Hell yes!" },
        { value: 3, text: "I dig it" },
        { value: 2, text: "Sure, can't hurt" },
        { value: 1, text: "Need more info" },
        { value: 0, text: "Don't care" }
      ]
    };
  }

  getFeedbackForUser(user) {
    console.log(user);
    if (user) {
      axios({
        method: "GET",
        url: `https://birds-eye-news-api.herokuapp.com/feedback/${user.uid}`
      })
        .then(res => {
          let userVotes = {};
          for (let vote of res.data) {
            userVotes[vote.type] = Number(vote.value);
          }

          let blankMap = this.buildFeedbackMap();

          this.setState({ votesByFeature: { ...blankMap, ...userVotes } });
        })
        .catch(err => console.log(err));
    }
  }

  componentDidMount() {
    this.buildFeedbackMap();

    let user = store.get("user");
    if (user) {
      this.getFeedbackForUser(user.user);
    } else {
      this.getFeedbackForUser(this.props.user);
    }
  }

  buildFeedbackMap() {
    const obj = {};

    for (let feature of features) {
      obj[feature.type] = null;
    }

    this.setState({ votesByFeature: obj, voteMessages: obj });
    return obj;
  }

  handleVote(vote, feature) {
    const votesByFeature = { ...this.state.votesByFeature };
    votesByFeature[feature.type] = vote;
    this.setState({ votesByFeature });

    axios({
      method: "POST",
      url: "https://birds-eye-news-api.herokuapp.com/feedback",
      data: {
        uid: this.props.user ? this.props.user.uid : null,
        type: feature.type,
        value: vote
      },
      config: { headers: { "Content-Type": "application/json" } }
    })
      .then(res => {
        this.setState({
          openEndedFeedback: "",
          openEndedFeedbackSubmitted: true
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const renderSignInButton = () => {
      if (!this.props.user) {
        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              margin: "0px 0px 20px 0px"
            }}
          >
            <Button type={"primary"}>
              <Link
                to={{
                  pathname: "/login",
                  state: { prevPath: this.props.location.pathname }
                }}
              >
                Sign up or sign in to vote
              </Link>
            </Button>
          </div>
        );
      } else {
        return null;
      }
    };

    const renderFeatures = () => {
      const renderButtons = feature => {
        return (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline"
            }}
          >
            <div
              style={{
                fontSize: 14,
                margin: "0px 5px 5px 0px",
                fontWeight: "bold"
              }}
            >
              Want this?
            </div>
            <RadioGroup
              buttonStyle={"solid"}
              onChange={e => this.handleVote(e.target.value, feature)}
              value={
                this.state.votesByFeature
                  ? this.state.votesByFeature[feature.type]
                  : null
              }
              size={"small"}
              disabled={!this.props.user}
            >
              {this.state.options.map((option, i) => {
                return (
                  <RadioButton
                    key={i}
                    style={{ fontWeight: "400" }}
                    value={option.value}
                  >
                    {option.text}
                  </RadioButton>
                );
              })}
            </RadioGroup>
          </div>
        );
      };

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "50px 0px 0px 0px"
          }}
        >
          {this.state.features.map((feature, i) => {
            return (
              <Card
                key={i}
                style={{
                  maxWidth: 600,
                  width: "100%",
                  position: "relative",
                  margin: 10
                }}
              >
                <Icon
                  type={feature.icon}
                  style={{
                    color: "#1890ff",
                    fontSize: 20,
                    position: "absolute",
                    top: 10,
                    right: 10
                  }}
                />

                <h4 style={{ paddingRight: 20, lineHeight: 1.3 }}>
                  {feature.title}
                </h4>
                <ul style={{ paddingLeft: 30 }}>
                  {feature.points.map((point, i) => {
                    return (
                      <li key={i} style={{ margin: "5px 0px" }}>
                        {point}
                      </li>
                    );
                  })}
                </ul>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start"
                  }}
                >
                  {renderButtons(feature)}
                </div>
              </Card>
            );
          })}
        </div>
      );
    };

    return (
      <div
        style={{
          padding: "150px 10px 50px 10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <h3
          style={{
            width: "100%",
            textAlign: "center",
            fontWeight: 700,
            margin: 0
          }}
        >
          Upcoming Features
        </h3>
        <p
          style={{
            color: "rgba(0,0,0,0.5)",
            lineHeight: 1.4,
            letterSpacing: "0.02em",
            padding: 10,
            textAlign: "center",
            maxWidth: 500
          }}
        >
          Newsbie is in its early days, with just a small sample of features and
          capabilities. That means you can have a direct impact on how this app
          evolves - right here, right now.
        </p>
        {renderSignInButton()}
        <div style={{ fontSize: 30 }}>👇</div>

        {renderFeatures()}
        <Card
          style={{
            maxWidth: 600,
            width: "100%",
            position: "relative",
            margin: 10,
            backgroundColor: "#1890ff"
          }}
        >
          <h4 style={{ paddingRight: 20, lineHeight: 1.3, color: "#fff" }}>
            Have an idea? Let me know!
          </h4>
          <textarea
            placeholder={
              "I've got this really cool idea for Newsbie! What if..."
            }
            onChange={e => this.setState({ openEndedFeedback: e.target.value })}
            value={this.state.openEndedFeedback}
            style={{
              border: "none",
              width: "100%",
              padding: 20,
              borderRadius: 3
            }}
          />
          {this.state.openEndedFeedbackSubmitted ? (
            <div style={{ color: "#fff" }}>Roger that!</div>
          ) : (
            <Button
              style={{ marginTop: 10 }}
              onClick={() =>
                this.handleVote(this.state.openEndedFeedback, {
                  type: "openEndedFeedback"
                })
              }
            >
              Send Feedback
            </Button>
          )}
        </Card>

        <a
          href={"https://twitter.com/ryanjyost"}
          target={"_blank"}
          style={{
            textDecoration: "underline",
            marginTop: 40,
            textAlign: "center"
          }}
        >
          Being made by Ryan 👋
        </a>
      </div>
    );
  }
}
