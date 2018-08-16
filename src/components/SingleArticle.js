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
      articleHeight,
      isSlider
    } = this.props;
    // console.log(article);
    const { hover, hoverLink, loaded } = this.state;

    return (
      <div
        style={{
          boxShadow: "0 3px 8px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.4)",
          borderRadius: 5,
          width: articleWidth,
          margin: 10,
          flex: "0 0 auto"
        }}
      >
        <a
          href={
            article
              ? article.link
                ? article.link.replace(/^http:\/\//i, "https://")
                : "https://res.cloudinary.com/ryanjyost/image/upload/v1530579641/newsbie-logo-large.png"
              : "https://res.cloudinary.com/ryanjyost/image/upload/v1530579641/newsbie-logo-large.png"
          }
          rel="noreferrer"
          key={index}
          style={{
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: articleHeight,
            width: articleWidth,
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "relative",
            backgroundImage: `url(${
              article
                ? article.image
                  ? article.image.url
                    ? article.image.url.replace(/^http:\/\//i, "https://")
                    : "https://res.cloudinary.com/ryanjyost/image/upload/v1530579641/newsbie-logo-large.png"
                  : "https://res.cloudinary.com/ryanjyost/image/upload/v1530579641/newsbie-logo-large.png"
                : ""
            })`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
          }}
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
        >
          <div
            className={"article"}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 5,
              position: "relative",
              color: "rgba(255, 255, 255, 0.95)"
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                padding: "15px",
                backgroundImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.25), rgba(0,0,0,0.5)," +
                  " rgba(0,0,0,0.75)," +
                  " rgba(0,0,0,0.75))",
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5
              }}
            >
              <h3
                style={{
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  color: "rgba(255, 255, 255, 1)",
                  lineHeight: 1.3,
                  letterSpacing: "0.01em",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  fontWeight: 600,
                  fontSize: 14,
                  margin: 0
                }}
              >
                {this.entities.decode(article.title)}
              </h3>
              <h6
                className={"noTextDecoration"}
                style={{
                  display: "flex",
                  alignItems: "alignItems",
                  textAlign: "right",
                  padding: "5px 0px 0px 0px",
                  fontSize: 10,
                  color: "rgba(255, 255, 255, 0.5)",
                  textDecoration: "none",

                  margin: 0
                }}
              >
                {article.site.title}{" "}
                <span style={{ margin: "0px 5px" }}>&middot;</span>
                <TimeAgo
                  date={article.date ? article.date : article.created_at}
                />
              </h6>
            </div>
          </div>
        </a>
      </div>
    );
  }
}
