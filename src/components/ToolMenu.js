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
import { Icon } from "react-icons-kit";

export default class ToolMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { hideSourceMenu } = this.props;

    const SingleTool = ({ link, title, desc, icon }) => {
      return (
        <Link
          style={{
            padding: "10px 20px",
            textDecoration: "none",
            display: "inline-block",
            margin: 5,
            width: 300,
            height: 50,
            backgroundColor: "#fff",
            color: "rgba(0,0,0,0.9)"
            // flexDirection: "column",
            // alignItems: "center"
          }}
          className={"shadow shadowHover"}
          to={link}
        >
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
            link={"/articles"}
            title={"Article Explorer"}
            desc={
              "Easily navigate the latest news + opinions with this powerful, flexible tool."
            }
            icon={search}
          />
          <SingleTool
            link={"/front_pages"}
            title={"Front Page Browser"}
            desc={
              "Your bird's-eye view of the media landscape that helps you fly above the bullsh*t."
            }
            icon={newspaperO}
          />
          <SingleTool
            link={"/sources"}
            title={"Source Reports"}
            desc={
              "Dive deep into specific sources. Discover patterns + potential biases."
            }
            icon={ic_visibility}
          />
        </div>
        {!this.props.hideSourceMenu && (
          <div
            style={{
              borderTop: "1px solid rgba(0,0,0,0.2)",
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
