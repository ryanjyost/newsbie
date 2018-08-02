import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import detectIt from "detect-it";
import ReactImageMagnify from "react-image-magnify";
import TimeAgo from "react-timeago";
import { XmlEntities } from "html-entities";

export default class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      hoverLink: false,
      loaded: false
    };

    this.entities = new XmlEntities();
  }

  render() {
    const {
      article,
      articleMargin,
      index,
      articleWidth,
      isSlider
    } = this.props;
    // console.log(article);
    const { hover, hoverLink, loaded, tou } = this.state;

    return (
      <div
        style={{
          // display: "flex",
          // flexDirection: "column",
          // alignItems: "center",
          // justifyContent: "center",
          width: articleWidth,
          margin: isSlider ? "auto" : `${articleMargin - 1}px`
        }}
      >
        <a
          href={
            article
              ? article.link
                ? article.link.replace(/^http:\/\//i, "https://")
                : "/"
              : "/"
          }
          rel="noreferrer"
          key={index}
          style={{
            margin: !isSlider ? articleMargin - 1 : "",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: articleWidth - 40,
            width: articleWidth - 20,
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "relative",
            backgroundImage: `url(${
              article ? ("image" in article ? article.image.url : "") : ""
            })`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)"
          }}
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
        >
          <div
            className={"article"}
            style={{
              height: "100%",
              width: "100%",
              position: "relative",
              color: "rgba(255, 255, 255, 0.95)"
            }}
          >
            <h3
              className={"noTextDecoration"}
              style={{
                display: "block",
                textAlign: "right",
                padding: "20px 20px",
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "none",
                position: "absolute",
                top: 0,
                right: 0,
                margin: 0
              }}
            >
              {article.site.title}
            </h3>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                padding: "15px"
              }}
            >
              <h3
                style={{
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  color: "rgba(255, 255, 255, .95)",
                  lineHeight: 1.3,
                  letterSpacing: "0.01em",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  fontWeight: 600,
                  fontSize: 22,
                  margin: 0
                }}
              >
                {this.entities.decode(article.title)}
              </h3>
              <h5
                style={{
                  padding: "5px 0px 0px 0px",
                  margin: 0,
                  fontWeight: 400,
                  color: "rgba(255, 255, 255, 0.5)"
                }}
              >
                <TimeAgo
                  date={article.date ? article.date : article.created_at}
                />
              </h5>
            </div>
          </div>
        </a>
      </div>
    );
  }
}
