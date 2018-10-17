import React, { Component } from "react";
import axios from "axios/index";
import { Progress } from "antd";
import Loader from "../../components/Loader";
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
import { max, min } from "simple-statistics";
import { mappedSourceToImage } from "../../sources";
import moment from "moment/moment";
import TopWords from "../TopWords";
import Article from "../articles/Article";
import { Card, Radio, Button } from "antd";
import { wikipedia } from "react-icons-kit/icomoon/wikipedia";
import { Icon } from "react-icons-kit";
import { Icon as AntIcon } from "antd";
import { Link } from "react-router-dom";
import TermBarChart from "../data/TermBarChart";

export default class TermAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineGraphData: [],
      barGraphData: [],
      graphMax: 0,
      graphMin: 0,
      topTags: [],
      moreTags: [],
      mappedImages: [],
      politicsArticles: [],
      opinionArticles: [],
      currType: "politics",
      combinedArticleCount: 0
    };
  }

  componentDidMount() {
    axios({
      method: "POST",
      url: "https://birds-eye-news-api.herokuapp.com/term_analysis",
      data: { term: this.props.match.params.term.replace("-", " ") },
      config: { headers: { "Content-Type": "application/json" } }
    })
      .then(res => {
        this.prepLineGraphData(res.data.batches, res.data.topic);
        this.prepRelatedWords(
          res.data.related,
          res.data.articles.combined.length
        );
        this.prepBarGraphData(
          res.data.related,
          res.data.articles.combined.length
        );
        this.paginateArticles(res.data.articles.politics, "politicsArticles");
        this.paginateArticles(res.data.articles.opinion, "opinionArticles");
        this.setState({
          mappedImages: mappedSourceToImage(),
          topic: res.data.topic,
          combinedArticleCount: res.data.articles.combined.length
        });
        // this.setState({ topic: res.data.topic, batches: res.data.batches });
      })
      .catch(err => console.log(err));
  }

  prepRelatedWords(related, denom) {
    let splitTags = _.partition(related, tag => {
      return tag.tf / denom > 0.03;
    });

    this.setState({
      topTags: splitTags[0],
      moreTags: splitTags[1].slice(0, 20)
    });
  }

  prepLineGraphData(batches, topic) {
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
          let tags = batch.tags.filter(item => {
            return (
              item.term === topic.main.term ||
              item.term.includes(topic.main.term) ||
              topic.main.term.includes(item.term)
            );
          });

          let yValues = tags.map(tag => {
            return tag.sourceCount;
          });

          let yVal = 0;
          for (let val of yValues) {
            yVal = yVal + val;
          }

          return {
            x: -this.nearestHour(batch.created_at),
            y: yVal ? yVal / batch.sourceCount : 0
          };
        } else {
          return {
            x: 0,
            y: ""
          };
        }
      });

    //console.log(graphData);

    let values = graphData.map(val => {
      return val.y;
    });

    let graphMin = min(values);
    let graphMax = max(values);

    this.setState({ lineGraphData: graphData, graphMin, graphMax });
  }

  prepBarGraphData(tags, denominator) {
    const barGraphData = tags
      .sort((a, b) => {
        if (a.tf > b.tf) {
          return -1;
        } else if (b.tf > a.tf) {
          return 1;
        } else {
          return 0;
        }
      })
      .slice(0, 10)
      .map(tag => {
        return {
          term: tag.term,
          percentage: tag.tf / denominator
        };
      });

    this.setState({ barGraphData });
  }

  nearestHour(time) {
    return moment.duration(moment().diff(moment(time))).asHours();
  }

  paginateArticles(articles, stateField) {
    this.setState({ [stateField]: articles.slice(0, 50) });
    // let countperPage = 20,
    //   currPage = 1;
    // let pages = [],
    //   avoidInfinity = 50;
    // while (countperPage * currPage < articles.length + countperPage) {
    //   let baseIndex = (currPage - 1) * countperPage;
    //   pages.push(articles.slice(baseIndex, baseIndex + countperPage));
    //   avoidInfinity++;
    //   currPage++;
    // }
    //
    // console.log(pages);
  }

  render() {
    const { styles } = this.props;
    const { topic, mappedImages } = this.state;
    const renderLineGraph = () => {
      return (
        <AreaChart
          width={
            styles.hideSidebar
              ? styles.screenWidth - (25 * 2 + 50)
              : Math.min(
                  800 - (25 * 2 + 30),
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
            // ticks={[this.state.graphMin + 0.01, this.state.graphMax - 0.01]}
            tickFormatter={obj => {
              if (obj) {
                if (this.state.graphMax - this.state.graphMin < 4) {
                  return `${Number(obj * 100).toFixed(1)}%`;
                } else {
                  return `${Number(obj * 100).toFixed(0)}%`;
                }
              } else {
                return "";
              }
            }}
            width={50}
          />
          {/*<Tooltip />*/}>
          <Area
            type="monotone"
            dataKey={"y"}
            fill={"#1890ff"}
            stroke={"#1890ff"}
            dot={false}
          />
        </AreaChart>
      );
    };

    const groupOfArticles = articles => {
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

    const renderLinks = () => {
      const tag = topic ? topic.main : null;
      let wikiUrl = tag ? tag.term.replace(/ /g, "+") : "";
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "rgba(0, 0, 0, 0.25)",
            fontSize: 18,
            marginLeft: 10
          }}
        >
          <a
            style={{ marginRight: 5 }}
            target="_blank"
            href={`http://www.google.com/search?q=${wikiUrl}`}
          >
            <AntIcon type="google" size={20} />
          </a>
          <a
            style={{
              display: "flex",
              marginRight: 5
            }}
            target="_blank"
            href={`https://en.wikipedia.org/w/index.php?search=${wikiUrl}&title=Special:Search&fulltext=1`}
          >
            <Icon icon={wikipedia} size={24} />
          </a>
          <a target="_blank" href={`https://twitter.com/search?q=${wikiUrl}`}>
            <AntIcon type="twitter" size={20} />
          </a>
        </div>
      );
    };

    const renderRelatedWords = () => {
      if (this.state.topTags.length < 1 && this.state.moreTags.length < 1) {
        return (
          <h4 style={{ margin: 10, color: "rgba(0,0,0,0.8)", lineHeight: 1.4 }}>
            {`The term "${
              topic.main.term
            }" doesn't seem to have any commonly related terms.`}
            <br />{" "}
            <span
              style={{ color: "rgba(0,0,0,0.6)", fontSize: 16 }}
            >{`That means it's being used in a wide range of contexts and stories.`}</span>
          </h4>
        );
      } else {
        return (
          <TopWords
            isRelatedWords
            isTermAnalysis
            termRelatedTo={topic.main.term}
            screenWidth={styles.screenWidth}
            list={this.state.topTags}
            suppList={this.state.moreTags}
            calcValue={word => {
              return word.tf / this.state.combinedArticleCount;
            }}
          />
        );
      }
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

    const renderAllArticles = () => {
      const renderFilterTypeButtons = () => {
        return (
          <Radio.Group
            style={{ margin: "10px 10px 10px 0px" }}
            value={this.state.currType}
            onChange={e => this.setState({ currType: e.target.value })}
          >
            <Radio.Button style={{ fontWeight: "400" }} value="politics">
              news
            </Radio.Button>
            <Radio.Button style={{ fontWeight: "400" }} value="opinion">
              opinions
            </Radio.Button>
          </Radio.Group>
        );
      };

      return (
        <div>
          {renderFilterTypeButtons()}
          {groupOfArticles(
            this.state.currType === "politics"
              ? this.state.politicsArticles
              : this.state.opinionArticles
          )}
        </div>
      );
    };

    if (!this.state.topic) {
      return (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Loader loaderHeight={"100vh"} />
        </div>
      );
    } else {
      return (
        <div
          style={{
            position: "relative",
            padding:
              styles.screenWidth > 500
                ? "100px 20px 50px 20px"
                : "100px 10px 50px 10px",
            marginBottom: 20,
            display: "flex",
            flexDirection: "column",
            width: "100%"
            // maxWidth: 800
          }}
        >
          <h2 style={{ display: "flex", alignItems: "baseline" }}>
            {topic.main.term} {renderLinks()}
          </h2>

          <h4
            style={{
              marginBottom: 15,
              marginTop: 20,
              fontWeight: "normal",
              color: "rgba(0,0,0,0.5)"
            }}
          >
            What are the related terms?
          </h4>
          <Card
            style={{
              maxWidth: 800,
              margin: "0px 0px 20px 0px"
            }}
          >
            {renderRelatedWords()}
          </Card>

          {this.state.topTags.length < 1 &&
          this.state.moreTags.length < 1 ? null : (
            <Card style={{ width: "100%", maxWidth: 500, margin: "10px 0px" }}>
              <TermBarChart
                barGraphData={this.state.barGraphData}
                styles={styles}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%"
                }}
              >
                <span
                  style={{
                    fontStyle: "italic",
                    color: "rgba(0,0,0,0.2)",
                    fontSize: 12,
                    padding: 5
                  }}
                >
                  {`percentage frequency in recent articles that contain "${
                    topic.main.term
                  }"`}
                </span>
              </div>
            </Card>
          )}

          {groupOfArticles(topic.preview.politics)}

          <Card
            style={{
              maxWidth: styles.hideSidebar
                ? styles.screenWidth - 10 * 2
                : Math.min(
                    820 - 25 * 2,
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
          {groupOfArticles(topic.preview.more)}

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
              {/*<div style={{ marginBottom: 20 }}>{renderPercentageFreq()}</div>*/}
              <div>{renderCoverage()}</div>
            </Card>
          </div>

          <h4
            style={{
              marginBottom: 0,
              fontWeight: "normal",
              color: "rgba(0,0,0,0.5)",
              marginTop: 20,
              width: "100%"
            }}
          >
            Commentary / Opinions
          </h4>
          {groupOfArticles(topic.preview.opinions)}

          <h4
            style={{
              marginBottom: 0,
              fontWeight: "normal",
              color: "rgba(0,0,0,0.5)",
              marginTop: 20,
              width: "100%"
            }}
          >
            More Articles
          </h4>
          {renderAllArticles()}
        </div>
      );
    }
  }
}
