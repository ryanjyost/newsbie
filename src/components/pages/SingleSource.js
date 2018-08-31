import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import Loader from "../Loader";
import { Icon } from "react-icons-kit";
import { wordpress } from "react-icons-kit/fa/wordpress";
import { externalLink } from "react-icons-kit/fa/externalLink";
import { infoCircle } from "react-icons-kit/fa/infoCircle";
import { group } from "react-icons-kit/fa/group";
import { newspaperO } from "react-icons-kit/fa/newspaperO";
import { pencil } from "react-icons-kit/fa/pencil";
import { twitter } from "react-icons-kit/fa/twitter";
import { dollar } from "react-icons-kit/fa/dollar";
import { clockO } from "react-icons-kit/fa/clockO";

export default class SingleSource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: null,
      tags: [],
      politicsTags: [],
      opinionTags: [],
      sourceCount: null,
      opinionArticles: [],
      politicsArticles: [],
      combinedArticles: []
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:8000/sources/${this.props.match.params.source}`, {
        Accept: "application/json"
      })
      .then(res => {
        console.log(res.data);
        this.setState({ ...this.state, ...res.data });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { source } = this.state;

    const renderLinks = () => {
      const itemStyle = {
        display: "flex",
        padding: "6px 10px",
        borderRadius: 3,
        fontSize: 12,
        textDecoration: "none",
        margin: 5,
        backgroundColor: "rgba(33, 58, 73, 0.6)",
        color: "#fff"
      };

      const SingleLink = ({ label, link, icon, style }) => {
        return (
          <a
            href={link}
            className="shadowHover"
            style={{
              ...itemStyle,
              ...style
            }}
          >
            {icon && (
              <Icon
                style={{
                  marginRight: 5
                }}
                icon={icon}
                size={12}
              />
            )}
            {label}
          </a>
        );
      };

      const SingleItem = ({ label, style, icon }) => {
        return (
          <div
            style={{
              ...itemStyle,
              ...style
            }}
          >
            {icon && (
              <Icon
                style={{
                  marginRight: 5
                }}
                icon={icon}
                size={12}
              />
            )}{" "}
            {label}
          </div>
        );
      };

      return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {/* Website*/}
          {source.url.length > 0 && (
            <SingleLink
              link={source.url}
              label={"Visit Website"}
              // style={{ backgroundColor: "rgba(0,0,0,0.8)", color: "#fff" }}
              icon={externalLink}
            />
          )}

          {/* Twitter */}
          {source.twitter.length > 0 && (
            <SingleLink
              link={`https://twitter.com/${source.twitter.replace("@", "")}`}
              label={source.twitter}
              // style={{ backgroundColor: "#1da1f2", color: "#fff" }}
              icon={twitter}
            />
          )}

          {/* About */}
          {source.links.about.length > 0 && (
            <SingleLink
              link={source.links.about}
              label={"About Page"}
              // style={{ backgroundColor: "rgba(0,0,0,0.8)", color: "#fff" }}
              icon={infoCircle}
            />
          )}

          {/* People */}
          {source.links.people.length > 0 && (
            <SingleLink
              link={source.links.people}
              label={"Contributors"}
              // style={{ backgroundColor: "rgba(0,0,0,0.8)", color: "#fff" }}
              icon={group}
            />
          )}

          {/* Press */}
          {source.press.length > 0 && (
            <SingleLink
              link={source.press}
              label={"Press / Media"}
              // style={{ backgroundColor: "rgba(0,0,0,0.8)", color: "#fff" }}
              icon={newspaperO}
            />
          )}

          {/* Wikipedia*/}
          {source.wikipedia.link.length > 0 && (
            <SingleLink
              link={source.wikipedia.link}
              label={"Wikipedia"}
              // style={{ color: "#fff", backgroundColor: "#36b" }}
              icon={wordpress}
            />
          )}

          {/* Submit Story */}
          {source.storySubmit.length > 0 && (
            <SingleLink
              link={source.storySubmit}
              label={"Submit a story"}
              // style={{ color: "#fff", backgroundColor: "rgba(46, 228, 246,1)" }}
              icon={pencil}
            />
          )}

          {/* Parent Company */}
          {source.parent.link.length > 0 && (
            <SingleItem
              link={source.parent.link}
              label={`Owned by ${source.parent.name}`}
              style={{
                backgroundColor: "rgba(255, 255, 255, .93)",
                color: "rgba(0,0,0,0.6)"
              }}
              icon={dollar}
            />
          )}

          {/* Founded */}
          {source.parent.link.length > 0 && (
            <SingleItem
              link={source.parent.link}
              label={`Founded ${moment(source.inception).format(
                "MMM DD, YYYY"
              )}`}
              style={{
                backgroundColor: "rgba(255, 255, 255, .93)",
                color: "rgba(0,0,0,0.6)"
              }}
              icon={clockO}
            />
          )}
        </div>
      );
    };

    if (!source) {
      return (
        <div
          style={{
            display: "flex",
            height: "100vh",
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {" "}
          <Loader loaderHeight={500} loadingMessage={"loading source report"} />
        </div>
      );
    } else {
      return (
        <div
          style={{
            padding: "70px 20px 20px 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            maxWidth: 900,
            margin: "auto"
          }}
        >
          <div
            style={{
              // padding: "0px 20px 20px 20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexDirection: "column",
              maxWidth: 500,
              margin: "auto"
            }}
          >
            <h2 style={{ margin: 10, color: "rgba(0,0,0,0.8)" }}>
              {source.title}
            </h2>
            {renderLinks()}
          </div>
        </div>
      );
    }
  }
}
