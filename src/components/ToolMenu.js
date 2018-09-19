import React, { Component } from "react";
import SourceCloud from "./SourceCloud";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";
import { search } from "react-icons-kit/fa/search";
import { newspaperO } from "react-icons-kit/fa/newspaperO";
import { ic_visibility } from "react-icons-kit/md/ic_visibility";
import { tv } from "react-icons-kit/fa/tv";
import { lock } from "react-icons-kit/fa/lock";
import { globe } from "react-icons-kit/fa/globe";
import { slack } from "react-icons-kit/fa/slack";
import { Icon } from "react-icons-kit";

export default class ToolMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { hideSourceMenu, user } = this.props;

    const SingleTool = ({ link, title, desc, icon, noLock, externalLink }) => {
      if (externalLink) {
        return (
          <a
            style={{
              padding: "10px 20px",
              textDecoration: "none",
              display: "inline-block",
              margin: 5,
              width: 350,
              // height: 50,
              backgroundColor: "#fff",
              color: "rgba(0,0,0,0.9)",
              position: "relative",
              opacity: user ? 1 : 0.9
              // flexDirection: "column",
              // alignItems: "center"
            }}
            className={"shadow shadowHover"}
            href={link}
            target={"_blank"}
          >
            {!this.props.user &&
              !noLock && (
                <Icon
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    color: "rgba(0, 0, 0, 0.3)"
                  }}
                  icon={lock}
                  size={16}
                />
              )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                // flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Icon
                style={{
                  marginRight: 10,
                  color: "rgba(46, 228, 246,1)"
                }}
                icon={icon}
                size={34}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  justifyContent: "center",
                  marginLeft: 10
                }}
              >
                <span style={{ fontSize: 14 }}>
                  <strong>{title}</strong>
                </span>
                <span style={{ fontSize: 12, color: "rgba(0,0,0,0.7)" }}>
                  {desc}
                </span>
              </div>
            </div>
          </a>
        );
      } else {
        return (
          <Link
            style={{
              padding: "10px 20px",
              textDecoration: "none",
              display: "inline-block",
              margin: 5,
              width: 350,
              // height: 50,
              backgroundColor: "#fff",
              color: "rgba(0,0,0,0.9)",
              position: "relative",
              opacity: user ? 1 : 0.9
              // flexDirection: "column",
              // alignItems: "center"
            }}
            className={"shadow shadowHover"}
            to={link}
          >
            {!this.props.user &&
              !noLock && (
                <Icon
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    color: "rgba(0, 0, 0, 0.3)"
                  }}
                  icon={lock}
                  size={16}
                />
              )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                // flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Icon
                style={{
                  marginRight: 10,
                  color: "rgba(46, 228, 246,1)"
                }}
                icon={icon}
                size={34}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  justifyContent: "center",
                  marginLeft: 10
                }}
              >
                <span style={{ fontSize: 14 }}>
                  <strong>{title}</strong>
                </span>
                <span style={{ fontSize: 12, color: "rgba(0,0,0,0.7)" }}>
                  {desc}
                </span>
              </div>
            </div>
          </Link>
        );
      }
    };

    return (
      <div
        className={hideSourceMenu ? "" : "overlay-content"}
        style={{
          width: "100%",
          padding: hideSourceMenu ? "0px" : "20px 0px 50px 0px",
          maxWidth: hideSourceMenu ? "" : 800,
          margin: "auto"
          // display: "flex",
          // flexWrap: "wrap",
          // alignItems: "flex-start",
          // justifyContent: "center"
          // height: "100vh",
          // backgroundColor: "rgba(0,0,0,0.02)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
          <SingleTool
            link={
              "https://join.slack.com/t/newsbie/shared_invite/enQtNDM4MzY3NTY4MzA2LWI2YzQzMTZjMmU4ZDdlZjk4NTJiYjc4OTBlZjY0N2UxMjIwMjk1YWM3YzI0OWM0MmYxNTE5MjkwYTc2YjFmZDY"
            }
            title={"Join the Slack Community!"}
            desc={
              "Chat about the news, media, and anything else with your fellow newsbies."
            }
            icon={slack}
            noLock
            externalLink
          />
          <SingleTool
            link={"/top_news"}
            title={"Top News Breakdown"}
            desc={
              "Stay on top of the latest news stories. Gain insights you can't get anywhere else."
            }
            icon={globe}
          />
          <SingleTool
            link={"/articles"}
            title={"Navigate Articles"}
            desc={
              "Easily navigate the latest news + opinions with this powerful, flexible tool."
            }
            icon={search}
          />
          <SingleTool
            link={"/front_pages"}
            title={"Browse Front Pages"}
            desc={
              "Your bird's-eye view of the media landscape that helps you fly above the bullsh*t."
            }
            icon={newspaperO}
          />
          <SingleTool
            link={"/sources"}
            title={"Explore News Sources"}
            desc={
              "Dive deep into specific sources. Discover patterns + potential biases."
            }
            icon={ic_visibility}
          />
          <SingleTool
            link={"/chyrons"}
            title={"Compare News Channels"}
            desc={"Dissect chyron data from FOX, CNN and MSNBC."}
            icon={tv}
          />
        </div>
        {!this.props.hideSourceMenu && (
          <div
            style={{
              // borderTop: "1px solid rgba(0,0,0,0.2)",
              padding: "5px 0px",
              margin: "10px 0px"
            }}
          >
            <h5
              style={{
                width: "100%",
                textAlign: "center",
                margin: "20px 0px 0px 0px"
              }}
            >
              click a source to dive deeper
            </h5>
            <div
              style={{
                maxWidth: 600,
                margin: "auto",
                padding: "10px 20px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center"
              }}
            >
              <SourceCloud />
            </div>
          </div>
        )}
      </div>
    );
  }
}
