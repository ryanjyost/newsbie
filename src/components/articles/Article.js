import React, { Component } from "react";
import TimeAgo from "react-timeago";
import { XmlEntities } from "html-entities";

export default class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };

    this.entities = new XmlEntities();
  }

  render() {
    const { article, i, isSmall, image, styles } = this.props;
    const smallImage = article.siteName === "wsj";
    const includeSourceTitle =
      ["foxnews", "bbcnews", "washingtontimes"].indexOf(article.siteName) > -1;
    return (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "center",
          height: 125,
          width: "100%",
          margin: "0px 0px 0px 0px",
          borderRadius: 5,
          textDecoration: "none"
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            position: "relative",
            color: "rgba(255, 255, 255, 0.95)",
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            padding: "10px 10px 10px 0px"
          }}
        >
          <a
            className={"hoverUnderline"}
            target={isSmall ? "" : "_blank"}
            rel="noreferrer"
            style={{
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              color: "rgba(0, 0, 0, 1)",
              lineHeight: 1.3,
              letterSpacing: "0.01em",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              fontWeight: "bold",
              margin: 0,
              fontSize: styles.screenWidth < 500 ? 15 : 18,
              marginBottom: 5
            }}
            href={
              article
                ? article.link || article.guid
                  ? article.link.includes("rss") ||
                    article.link.includes("feeds")
                    ? article.guid.replace(/^http:\/\//i, "https://")
                    : article.link.replace(/^http:\/\//i, "https://")
                  : null
                : null
            }
          >
            {this.entities.decode(article.title)}
          </a>
          <h6
            className={"noTextDecoration"}
            style={{
              padding: "0px 10px 0px 0px",
              margin: 0,
              marginTop: 5,
              fontWeight: 400,
              color: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              fontSize: isSmall ? 10 : ""
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`https://d1dzf0mjm4jp11.cloudfront.net/logos/${image}`}
                height={isSmall ? (smallImage ? 12 : 16) : 16}
                style={{ marginRight: 5 }}
              />
              <span style={{ fontSize: 10 }}>
                {includeSourceTitle && article.site.title}
              </span>
            </div>
            <TimeAgo date={article.date ? article.date : article.created_at} />
          </h6>
        </div>
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 90,
            width: 120,
            borderRadius: 3,
            position: "relative",
            backgroundImage: `url(${
              article
                ? article.image
                  ? article.image.url
                    ? article.image.url.replace(/^http:\/\//i, "https://")
                    : "https://d1dzf0mjm4jp11.cloudfront.net/newsbie-logo.png"
                  : "https://d1dzf0mjm4jp11.cloudfront.net/newsbie-logo.png"
                : ""
            })`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
          }}
        />
      </div>
    );
  }
}
