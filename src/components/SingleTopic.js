import React, { Component } from "react";
import { Progress } from "antd";
import TimeAgo from "react-timeago";
import entities from "html-entities";
import moment from "moment";
import { max, min } from "simple-statistics";
import { Card } from "antd";
import TopWords from "./TopWords";
import _ from "lodash";
import {
  LineChart,
  Area,
  AreaChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  BarChart,
  Bar
} from "recharts";
import Article from "./articles/Article";
import { sortedSources as sources, mappedSourceToImage } from "../sources";

export default class SingleTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineGraphData: [],
      graphMax: 0,
      graphMin: 0,
      topTags: [],
      moreTags: [],
      mappedImages: []
    };

    const AllHtmlEntities = entities.AllHtmlEntities;
    this.entities = new AllHtmlEntities();
  }

  componentDidMount() {
    this.prepLineGraphData(this.props.allTagBatches);
    this.prepRelatedWords(this.props.topic);
    this.setState({ mappedImages: mappedSourceToImage() });
  }

  nearestHour(time) {
    return moment.duration(moment().diff(moment(time))).asHours();
    // return Math.floor(
    //   moment.duration(moment().diff(moment(time))).asHours()
    // ).toFixed(2);
  }

  prepLineGraphData(batches) {
    let graphData = batches
      .sort((a, b) => {
        if (moment(a.created_at).isAfter(moment(b.created_at))) {
          return 1;
        } else if (moment(b.created_at).isAfter(moment(a.created_at))) {
          return -1;
        } else {
          return 0;
        }
      })
      .map((batch, i) => {
        // console.log(i, batch.created_at);
        if (batch) {
          let yVal = batch.tags.find(item => {
            return item.term === this.props.topic.main.term;
          });

          let dur = moment.duration(moment().diff(moment(batch.created_at)));
          let xVal = dur.asHours();

          return {
            x: -this.nearestHour(batch.created_at),
            y: yVal ? yVal.sourceCount / batch.sourceCount : 0
          };
        } else {
          return {
            x: 0,
            y: ""
          };
        }
      });

    let values = graphData.map(val => {
      return val.y;
    });

    let graphMin = min(values);
    let graphMax = max(values);

    this.setState({ lineGraphData: graphData, graphMin, graphMax });
  }

  prepRelatedWords(topic) {
    let splitTags = _.partition(topic.related, tag => {
      return tag.tf / topic.main.tf > 0.1;
    });

    this.setState({
      topTags: splitTags[0],
      moreTags: splitTags[1]
    });
  }

  render() {
    const { topic, styles, batches } = this.props;
    const { mappedImages } = this.state;
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
              color: isMain ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.7)",
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

    const groupOfArticlesOld = (articles, image) => {
      return (
        <Card
          style={{ maxWidth: "100%" }}
          // style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <div style={{ display: "flex", maxWidth: "100%" }}>
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
                  image
                    ? image.image
                      ? image.image.url
                        ? image.image.url.replace(/^http:\/\//i, "https://")
                        : "https://d1dzf0mjm4jp11.cloudfront.net/newsbie-logo.png"
                      : "https://d1dzf0mjm4jp11.cloudfront.net/newsbie-logo.png"
                    : ""
                })`
              }}
            />
          </div>
          <div
            style={{
              maxWidth: 350
              // paddingLeft: styles.screenWidth > 829 ? 30 : 0
            }}
          >
            {articles.map((article, i) => {
              return singleArticle(article, i, true);
            })}
          </div>
        </Card>
      );
    };

    const groupOfArticles = (articles, image) => {
      return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {articles.map((article, i) => {
            return (
              <div
                style={{
                  width: "100%",
                  maxWidth: 500,
                  margin: styles.screenWidth > 500 ? "5px 15px" : "5px"
                }}
                key={i}
              >
                <Article
                  article={article}
                  i={i}
                  styles={styles}
                  image={mappedImages[article.siteName]}
                />
              </div>
            );
          })}
        </div>
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
              padding: "5px 0px"
            }}
          >
            <Progress
              style={{ color: "#1890ff" }}
              strokeColor={"#1890ff"}
              type="circle"
              width={80}
              percent={Number(
                Math.floor(topic.percentageFreq * 100).toFixed(2)
              )}
              format={num => {
                return `${num}%`;
              }}
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
              fontSize: 15,
              lineHeight: 1.5,
              width: 250
            }}
          >
            of recent articles mention{" "}
            <span style={{ color: "rgba(0,0,0,0.7)", fontSize: 18 }}>
              {topic.main.term}
            </span>{" "}
            or related terms
          </div>
        </div>
      );
    };

    const renderCoverage = () => {
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
              padding: "5px 0px"
            }}
          >
            <Progress
              style={{ color: "#1890ff" }}
              strokeColor={"#1890ff"}
              type="circle"
              width={80}
              format={num => {
                return `${num}%`;
              }}
              percent={Number(
                (
                  (topic.sourceCoverage.yes.length /
                    topic.sourceCoverage.sourceCount) *
                  100
                ).toFixed(0)
              )}
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
              fontSize: 15,
              lineHeight: 1.5,
              width: 250
            }}
          >
            of sources have recently written about
            <span
              style={{ color: "rgba(0,0,0,0.7)", marginLeft: 2, fontSize: 18 }}
            >
              {topic.main.term}
            </span>
          </div>
        </div>
      );
    };

    const renderLineGraph = () => {
      return (
        <AreaChart
          width={
            styles.hideSidebar
              ? styles.screenWidth - (25 * 2 + 50)
              : Math.min(
                  500 - (25 * 2 + 30),
                  styles.screenWidth - styles.sidebarWidth - (25 * 2 + 30)
                )
          }
          height={200}
          data={this.state.lineGraphData}
          margin={{ left: -2 }}
        >
          <XAxis
            dataKey="x"
            stroke={"rgba(0,0,0,0.4)"}
            ticks={[-24, -20, -16, -12, -8, -4, 0].reverse()}
            domain={[-24, 0]}
            type="number"
            tickFormatter={tick => `${-tick} hrs`}
            axisLine={{ stroke: "#e5e5e5" }}
            tickLine={{ stroke: "#e5e5e5" }}
          />
          <YAxis
            // interval={"preserveStartEnd"}
            axisLine={{ stroke: "#e5e5e5" }}
            tickLine={{ stroke: "#e5e5e5" }}
            domain={[this.state.graphMin, this.state.graphMax]}
            stroke={"rgba(0,0,0,0.4)"}
            ticks={[this.state.graphMin + 0.01, this.state.graphMax - 0.01]}
            tickFormatter={obj => {
              if (obj) {
                return `${Number(obj * 100).toFixed(0)}%`;
              } else {
                return "";
              }
            }}
            width={40}
          />
          {/*<Tooltip />*/}>
          <Area type="monotone" dataKey={"y"} stroke={"#B8E8FF"} dot={false} />
        </AreaChart>
      );
    };

    const renderRelatedWords = () => {
      if (!this.state.topTags.length) {
        return null;
      } else {
        return (
          <TopWords
            screenWidth={styles.screenWidth}
            list={this.state.topTags}
            suppList={this.state.moreTags}
            calcValue={word => {
              return word.tf / this.props.topic.main.tf;
            }}
          />
        );
      }
    };

    return (
      <div
        style={{
          position: "relative",
          padding: 5,
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          width: "100%"
          // maxWidth: 800
        }}
      >
        <h3>{topic.main.term}</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginBottom: styles.screenWidth > 500 ? 20 : 0
          }}
        >
          <Card
            style={{
              maxWidth: 400,
              width: "100%",
              margin: styles.screenWidth > 500 ? 10 : "10px 0px"
              // marginBottom: styles.screenWidth > 500 ? 10 : 0
            }}
          >
            <div style={{ marginBottom: 20 }}>{renderPercentageFreq()}</div>
            <div>{renderCoverage()}</div>
          </Card>
          <Card
            style={{
              maxWidth: styles.hideSidebar
                ? styles.screenWidth - 10 * 2
                : Math.min(
                    520 - 25 * 2,
                    styles.screenWidth + styles.sidebarWidth - 25 * 2
                  ),
              width: "100%",
              margin: styles.screenWidth > 500 ? 10 : "10px 0px"
            }}
          >
            <h6
              style={{
                margin: "0px 0px 20px 10px",
                color: "rgba(0,0,0,0.5)"
                // textAlign: "center"
              }}
            >
              how often<strong style={{ fontSize: 14 }}>{` ${
                topic.main.term
              } `}</strong>{" "}
              has been in the news
            </h6>
            {renderLineGraph()}
          </Card>
        </div>

        {groupOfArticles(topic.preview.politics, mainPreview)}

        <Card
          style={{
            maxWidth: 800,
            margin:
              styles.screenWidth > 500 ? "20px 10px 20px 10px" : "10px 0px"
          }}
        >
          <h5 style={{ margin: "0px 0px 3px 0px" }}>
            terms related{" "}
            <span style={{ color: "rgba(0,0,0,0.5)" }}>
              to {topic.main.term}
            </span>
          </h5>
          {renderRelatedWords()}
        </Card>

        {groupOfArticles(topic.preview.more, morePreview)}

        <h4
          style={{
            marginBottom: 0,
            fontWeight: "normal",
            color: "rgba(0,0,0,0.5)",
            marginTop: 20,
            width: "100%"
          }}
        >
          Opinions
        </h4>
        {groupOfArticles(topic.preview.opinions, opinionPreview)}
      </div>
    );
  }
}
