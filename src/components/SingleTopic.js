import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import FrequencyLineGraph from "./FrequencyLineGraph";
import WordCloud from "./WordCloud";
import TimeAgo from "react-timeago";
import entities from "html-entities";
import numeral from "numeral";
import CircularProgressbar from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default class SingleTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    const AllHtmlEntities = entities.AllHtmlEntities;
    this.entities = new AllHtmlEntities();
  }

  render() {
    const { topic } = this.props;
    console.log(topic);
    const mainPreview = topic.preview.politics[0];
    const morePreview = topic.preview.more[0];
    const opinionPreview = topic.preview.opinions[0];

    const singleArticle = (article, i, allowMain = true) => {
      const isMain = i === 0 && allowMain;
      return (
        <a
          href={
            article
              ? article.link
                ? article.link.replace(/^http:\/\//i, "https://")
                : null
              : null
          }
          key={i}
          style={{
            padding: isMain ? "10px 5px 5px 5px" : "5px 10px",
            fontWeight: isMain ? "bold" : "normal",
            color: isMain ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0.85)",
            lineHeight: 1.2,
            margin: 0,
            display: "block"
          }}
        >
          <div
            className={"linkWithHover"}
            style={{
              fontSize: isMain ? 15 : 12,
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              letterSpacing: "0.01em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              margin: 0
            }}
          >
            {this.entities.decode(article.title)}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "alignItems",
              textAlign: "right",
              padding: "0px 0px 0px 0px",
              fontSize: 10,
              color: "rgba(0, 0, 0, 0.5)",
              textDecoration: "none",
              margin: "2px 0px 0px 0px"
            }}
          >
            {article.site.title}{" "}
            <span style={{ margin: "0px 5px" }}>&middot;</span>
            <TimeAgo date={article.created_at} />
          </div>
          {isMain && false ? (
            <div
              style={{
                fontSize: 11,
                fontWeight: "normal",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                lineHeight: 1.3,
                letterSpacing: "0.01em",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                marginTop: 4,
                color: "rgba(0,0,0,0.7)"
              }}
            >
              {this.entities.decode(article.description)}
            </div>
          ) : null}
        </a>
      );
    };

    const renderPercentageFreq = () => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            // justifyContent: "center",
            width: "100%",
            margin: "10px 0px"
          }}
        >
          <div
            style={{
              margin: "0px 0px 0px 0px",
              padding: "5px 0px",
              width: 50
            }}
          >
            <CircularProgressbar
              percentage={topic.percentageFreq * 100}
              text={numeral(topic.percentageFreq).format("0%")}
              styles={{
                path: { stroke: "rgba(46, 228, 246,1)" },
                text: {
                  // Tweak text color:
                  fill: "rgba(0,0,0,0.9)",
                  // Tweak text size:
                  fontSize: "30px"
                }
              }}
            />
          </div>
          <div
            style={{
              marginLeft: 10,
              color: "rgba(0,0,0,0.4)",
              fontSize: 16,
              lineHeight: 1.5,
              width: 250
            }}
          >
            of recent articles mention{" "}
            <span style={{ color: "rgba(0,0,0,0.7)" }}>{topic.main.term}</span>
          </div>
        </div>
      );
    };

    const renderCovergae = () => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            // justifyContent: "center",
            width: "100%",
            margin: "10px 0px"
          }}
        >
          <div
            style={{
              width: 50,
              margin: "0px 0px 0px 0px",
              padding: "5px 0px"
            }}
          >
            <CircularProgressbar
              percentage={
                (topic.sourceCoverage.yes.length /
                  topic.sourceCoverage.sourceCount) *
                100
              }
              text={numeral(
                topic.sourceCoverage.yes.length /
                  topic.sourceCoverage.sourceCount
              ).format("0%")}
              styles={{
                path: { stroke: "rgba(46, 228, 246,1)" },
                text: {
                  // Tweak text color:
                  fill: "rgba(0,0,0,0.9)",
                  // Tweak text size:
                  fontSize: "30px"
                }
              }}
            />
          </div>
          <div
            style={{
              marginLeft: 10,
              color: "rgba(0,0,0,0.4)",
              fontSize: 16,
              lineHeight: 1.5,
              width: 250
            }}
          >
            of sources have recently written about
            <span style={{ color: "rgba(0,0,0,0.7)", marginLeft: 2 }}>
              {topic.main.term}
            </span>
          </div>
        </div>
      );
    };

    const renderLineGraph = () => {
      return (
        <FrequencyLineGraph
          tag={topic.main}
          data={this.props.allTagBatches}
          width={320}
        />
      );
    };

    const renderRelatedWords = () => {
      return (
        <WordCloud
          shuffle
          list={topic.related
            .sort((a, b) => {
              if (a.tf > b.tf) {
                return -1;
              } else if (b.tf > a.tf) {
                return 1;
              } else {
                return 0;
              }
            })
            .slice(0, 15)}
          calcValue={word => {
            return word.tf;
          }}
        />
      );
    };

    return (
      <Row
        style={{
          position: "relative",
          borderRadius: 3,
          backgroundColor: "#fff",
          padding: 20,
          marginBottom: 20
        }}
        className={"shadow"}
      >
        <Row style={{ alignItems: "center" }}>
          <Col xs={12} sm={5} style={{ display: "flex" }}>
            <div
              style={{
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
                width: 300,
                backgroundColor: "rgba(0,0,0,0.5)",
                position: "relative",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundImage: `url(${
                  mainPreview
                    ? mainPreview.image
                      ? mainPreview.image.url
                        ? mainPreview.image.url.replace(
                            /^http:\/\//i,
                            "https://"
                          )
                        : "https://res.cloudinary.com/ryanjyost/image/upload/v1530579641/newsbie-logo-large.png"
                      : "https://res.cloudinary.com/ryanjyost/image/upload/v1530579641/newsbie-logo-large.png"
                    : ""
                })`
              }}
            />
          </Col>
          <Col xs={12} sm={7}>
            {topic.preview.politics.map((article, i) => {
              return singleArticle(article, i, true);
            })}
          </Col>
        </Row>
        <Row>
          <Col sm={6} style={{ paddingTop: 20 }}>
            {renderPercentageFreq()}
            {renderCovergae()}
          </Col>
          {/*<Col>{renderCovergae()}</Col>*/}
          <Col sm={6}>
            <h6
              style={{
                margin: "20px 0px 0px 10px",
                color: "rgba(0,0,0,0.7)"
                // textAlign: "center"
              }}
            >
              how often<strong style={{ fontSize: 14 }}>{` ${
                topic.main.term
              } `}</strong>{" "}
              has been in the news
            </h6>
            {renderLineGraph()}
          </Col>
        </Row>
        <Row style={{ alignItems: "center", marginTop: 20 }}>
          <Col sm={5} style={{ display: "flex" }}>
            <div
              style={{
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
                width: 300,
                backgroundColor: "rgba(0,0,0,0.5)",
                position: "relative",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundImage: `url(${
                  morePreview
                    ? morePreview.image
                      ? morePreview.image.url
                        ? morePreview.image.url.replace(
                            /^http:\/\//i,
                            "https://"
                          )
                        : "https://res.cloudinary.com/ryanjyost/image/upload/v1530579641/newsbie-logo-large.png"
                      : "https://res.cloudinary.com/ryanjyost/image/upload/v1530579641/newsbie-logo-large.png"
                    : ""
                })`
              }}
            />
          </Col>
          <Col sm={7}>
            {/*<h5 style={{ margin: "20px 0px 3px 0px" }}>*/}
            {/*more stories{" "}*/}
            {/*<span style={{ color: "rgba(0,0,0,0.5)" }}>*/}
            {/*involving {topic.main.term}*/}
            {/*</span>*/}
            {/*</h5>*/}
            {topic.preview.more.map((article, i) => {
              return singleArticle(article, i, true);
            })}
          </Col>
        </Row>
        <Row>
          <Col style={{ lineHeight: 1.2, padding: "10px 20px" }}>
            <h5 style={{ margin: "20px 0px 3px 0px" }}>
              terms related{" "}
              <span style={{ color: "rgba(0,0,0,0.5)" }}>
                to {topic.main.term}
              </span>
            </h5>
            {renderRelatedWords()}
          </Col>
        </Row>
        <Row style={{ alignItems: "center", marginTop: 20 }}>
          <Col sm={5} style={{ display: "flex" }}>
            <div
              style={{
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
                width: 300,
                backgroundColor: "rgba(0,0,0,0.5)",
                position: "relative",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundImage: `url(${
                  opinionPreview
                    ? opinionPreview.image
                      ? opinionPreview.image.url
                        ? opinionPreview.image.url.replace(
                            /^http:\/\//i,
                            "https://"
                          )
                        : "https://res.cloudinary.com/ryanjyost/image/upload/v1530579641/newsbie-logo-large.png"
                      : "https://res.cloudinary.com/ryanjyost/image/upload/v1530579641/newsbie-logo-large.png"
                    : ""
                })`
              }}
            />
          </Col>
          <Col sm={7}>
            {/*<h5 style={{ margin: "10px 0px 3px 0px" }}>*/}
            {/*opinions{" "}*/}
            {/*<span style={{ color: "rgba(0,0,0,0.5)" }}>*/}
            {/*involving {topic.main.term}*/}
            {/*</span>*/}
            {/*</h5>*/}
            {topic.preview.opinions.map((article, i) => {
              return singleArticle(article, i, true);
            })}
          </Col>
        </Row>
      </Row>
    );
  }
}
