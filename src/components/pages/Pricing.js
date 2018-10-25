import React, { Component } from "react";
import axios from "axios/index";
import { Card, Icon, Input, Button } from "antd";
import { Link } from "react-router-dom";
import store from "store";

export default class Pricing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: null,
      feedbackSubmitted: false
    };
  }

  componentDidMount() {
    let feedbackSubmitted = store.get("feedbackSubmitted");
    if (feedbackSubmitted) {
      this.setState({ feedbackSubmitted: true });
    }
  }

  submitFeedback() {
    axios({
      method: "POST",
      url: "https://birds-eye-news-api.herokuapp.com/feedback",
      data: {
        uid: this.props.user ? this.props.user.uid : null,
        type: "price",
        value: this.state.price
      },
      config: { headers: { "Content-Type": "application/json" } }
    })
      .then(res => {
        this.setState({ feedbackSubmitted: true });
        store.set("feedbackSubmitted", true);
      })
      .catch(err => console.log(err));
  }

  updatePrice(plus) {
    if (plus) {
      this.setState({ price: this.state.price ? this.state.price + 1 : 1 });
    } else {
      if (this.state.price !== null) {
        if (this.state.price !== 0) {
          this.setState({ price: this.state.price - 1 });
        }
      } else {
        this.setState({ price: 0 });
      }
    }
  }

  render() {
    const { feedbackSubmitted } = this.state;
    const renderPrice = () => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            padding: "30px 0px"
          }}
        >
          <div
            style={{
              fontSize: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative"
            }}
          >
            <div
              style={{
                color: "rgba(0,0,0,0.4)",
                position: "absolute",
                top: 0,
                left: 0
              }}
            >
              $
            </div>
            <h1
              style={{
                fontSize: 80,
                margin: "0px 5px",
                color:
                  this.state.price !== null
                    ? "rgba(0,0,0,0.8)"
                    : "rgba(0,0,0,0.2)"
              }}
            >
              {this.state.price !== null ? this.state.price : "?"}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                color: "rgba(0,0,0,0.4)"
              }}
            >
              per month
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 20,
              fontSize: 30
            }}
          >
            <Button
              style={{ margin: "5px 0px" }}
              onClick={() => this.updatePrice(true)}
            >
              <Icon type={"caret-up"} />
            </Button>
            <Button
              style={{ margin: "5px 0px" }}
              disabled={this.state.price === 0}
              onClick={() => this.updatePrice(false)}
            >
              <Icon type={"caret-down"} />
            </Button>
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          padding: "150px 20px 50px 20px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {!feedbackSubmitted && (
          <h3
            style={{
              width: "100%",
              textAlign: "center",
              fontWeight: 700,
              margin: 0
            }}
          >
            How much might you pay for a fully-featured Newsbie?
          </h3>
        )}

        {!feedbackSubmitted && (
          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              lineHeight: 1.5,
              letterSpacing: "0.02em",
              maxWidth: 500,
              color: "rgba(0,0,0,0.6)",
              padding: "10px 20px 0px 20px",
              marginBottom: 0
            }}
          >
            Newsbie's currently in beta and free if you join. Once the beta
            period is over - and I've collected feedback and built awesome new
            features that the beta users want - I'll need to charge a
            subscription to keep going.
          </p>
        )}

        {!feedbackSubmitted && renderPrice()}
        {feedbackSubmitted ? (
          <h4
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              // boxShadow:
              //   "0 3px 6px rgba(0,0,0,0.16), 0 3px" + " 6px rgba(0,0,0,0.23)",
              padding: "20px 30px",
              borderRadius: 3
            }}
          >
            Roger that 👍. Thanks for your help!
          </h4>
        ) : (
          <Button
            type={"primary"}
            disabled={this.state.price === null}
            onClick={() => this.submitFeedback()}
          >
            I'd pay this much for the first legit version
          </Button>
        )}

        <div
          style={{
            margin: "50px 0px 10px 0px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <h5>Not sure?</h5>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
              padding: 10
            }}
          >
            <Button style={{ margin: "5px 5px" }}>
              <Link to={"/"}>Learn more</Link>
            </Button>
            <Button style={{ margin: "5px 5px" }}>
              <Link to={"/upcoming"}>View upcoming features</Link>
            </Button>
            <Button style={{ margin: "5px 5px" }}>
              <Link to={"/app"}>Demo the app</Link>
            </Button>
          </div>
        </div>

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
