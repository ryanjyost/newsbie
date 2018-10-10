import React, { Component } from "react";
import TimeAgo from "react-timeago";
import { XmlEntities } from "html-entities";
import { Button } from "antd";

export default class NewsImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      error: false,
      showInfo: false
    };

    this.entities = new XmlEntities();
  }

  render() {
    const { article, i, isSmall, image, styles, maxWidth } = this.props;

    const { showInfo } = this.state;
    const smallImage = article.siteName === "wsj";
    const includeSourceTitle =
      ["foxnews", "bbcnews", "washingtontimes"].indexOf(article.siteName) > -1;

    const renderInfo = () => (
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.85)",
          padding: "20px 20px 20px 20px",
          display: "flex",
          flexDirection: "column",
          // alignItems: "center",
          justifyContent: "center",
          borderRadius: 3
        }}
      >
        <div>
          <h5 style={{ color: "rgba(0, 0, 0, 0.9)", lineHeight: 1.3 }}>
            {this.entities.decode(article.title)}
          </h5>
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
            <TimeAgo date={article.date ? article.date : article.created_at} />
          </h6>
        </div>
        <a
          href={
            article
              ? article.link || article.guid
                ? article.link.includes("rss") || article.link.includes("feeds")
                  ? article.guid.replace(/^http:\/\//i, "https://")
                  : article.link.replace(/^http:\/\//i, "https://")
                : null
              : null
          }
          target={"_blank"}
        >
          <Button
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              zIndex: 10,
              opacity: 0.9
            }}
            size="large"
            type="default"
            shape="circle"
            icon={"link"}
          />
        </a>
      </div>
    );

    if (this.state.error) {
      return null;
    } else {
      return (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 300,
            margin: 5,
            width: isSmall ? styles.screenWidth - 20 : maxWidth,
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
          onMouseEnter={() => {
            if (!isSmall) {
              this.setState({ showInfo: true });
            }
          }}
          onMouseLeave={() => {
            if (!isSmall) {
              this.setState({ showInfo: false });
            }
          }}
        >
          {showInfo && renderInfo()}
          {isSmall && (
            <Button
              onClick={() => this.setState({ showInfo: !this.state.showInfo })}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 10,
                opacity: 0.9
              }}
              size="large"
              type="default"
              shape="circle"
              icon={showInfo ? "close" : "info"}
            />
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              bottom: 10,
              right: 10,
              zIndex: 5,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "5px 10px",
              borderRadius: 2
            }}
          >
            <img
              src={`https://d1dzf0mjm4jp11.cloudfront.net/logos/${image}`}
              height={isSmall ? (smallImage ? 12 : 16) : 16}
              style={{ marginRight: 5 }}
            />
            <span style={{ fontSize: 10 }}>
              {includeSourceTitle && article.site.title}
            </span>
          </div>
          <img
            style={{ display: "none" }}
            height={0}
            width={0}
            src={
              article
                ? article.image
                  ? article.image.url
                    ? article.image.url.replace(/^http:\/\//i, "https://")
                    : "https://d1dzf0mjm4jp11.cloudfront.net/newsbie-logo.png"
                  : "https://d1dzf0mjm4jp11.cloudfront.net/newsbie-logo.png"
                : ""
            }
            onError={() => this.setState({ error: true })}
          />
        </div>
      );
    }
  }
}
