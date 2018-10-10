import React, { Component } from "react";
import axios from "axios/index";
import shuffle from "shuffle-array";
import ReactGA from "react-ga";
import _ from "lodash";
import moment from "moment";
import {
  LineChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  BarChart,
  Bar
} from "recharts";
import { Card } from "antd";

// Components
import TopWords from "../TopWords";
import Loader from "../Loader";
import FrontPagesRow from "../FrontPagesRow";
import TopNews from "../pages/TopNews";
import UserAuth from "../UserAuth";
import UserAuthPage from "./UserAuthPage";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTags: [null],
      allTagBatches: [],
      batchOfTags: null,
      moreTags: [{ term: "", tf: 0, sourceCount: 0 }],
      lineGraphData: [],
      barGraphData: [],
      dataKeys: [],
      records: []
    };
  }

  componentDidMount() {
    /*
		* Recent Tags
		* */
    axios
      .get("https://birds-eye-news-api.herokuapp.com/recent_tags", {
        Accept: "application/json"
      })
      .then(res => {
        // get top, different topics

        let splitTags = _.partition(res.data.topTags, tag => {
          return tag.sourceCount / res.data.batches[0].sourceCount > 0.05;
        });
        const tags = res.data.batches[0].tags.slice();

        const barGraphData = tags
          .sort((a, b) => {
            if (moment(a.sourceCount).isAfter(moment(b.sourceCount))) {
              return -1;
            } else if (moment(b.sourceCount).isAfter(moment(a.sourceCount))) {
              return 1;
            } else {
              return 0;
            }
          })
          .slice(0, 10)
          .map(tag => {
            return {
              term: tag.term,
              percentage: tag.sourceCount / res.data.batches[0].sourceCount
            };
          });

        this.setState({
          batchOfTags: res.data.batches[0],
          barGraphData,
          allTagBatches: res.data.batches,
          topTags: splitTags[0].sort((a, b) => {
            if (a.sourceCount > b.sourceCount) {
              return -1;
            } else if (b.sourceCount > a.sourceCount) {
              return 1;
            } else {
              return 0;
            }
          }),
          moreTags: splitTags[1]
            .sort((a, b) => {
              if (a.sourceCount > b.sourceCount) {
                return -1;
              } else if (b.sourceCount > a.sourceCount) {
                return 1;
              } else {
                return 0;
              }
            })
            .slice(0, 20)
        });

        this.prepTopWordTrendData(res.data.batches);
      })
      .catch(err => console.log(err));

    /*
	 * Front Pages
	 * */
    axios
      .get(`https://birds-eye-news-api.herokuapp.com/get_front_pages`, {
        Accept: "application/json"
      })
      .then(response => {
        //let results = response.body.results;
        // console.log("hey", response.data.records);
        const records = response.data.records.filter(record => {
          return record.site.name !== "thewashingtonpost";
        });
        const randomOrder = shuffle(records, { copy: true });

        this.setState({
          records: randomOrder,
          batch: response.data.batch,
          sites: response.data.sites
        });
      })
      .catch(error => {
        console.log("ERROR", error);
        this.setState({ showError: true });
      });
  }

  nearestHour(time) {
    return moment.duration(moment().diff(moment(time))).asHours();
    // return Math.floor(
    //   moment.duration(moment().diff(moment(time))).asHours()
    // ).toFixed(2);
  }

  prepTopWordTrendData(batches) {
    let factor = batches.length / 24;
    let filtered = batches.filter((batch, i) => {
      return (i + 7) % factor === 0 || i === 0;
    });

    // for(let i=0; )

    let dataKeys = batches[0].tags
      .sort((a, b) => {
        if (moment(a.sourceCount).isAfter(moment(b.sourceCount))) {
          return -1;
        } else if (moment(b.sourceCount).isAfter(moment(a.sourceCount))) {
          return 1;
        } else {
          return 0;
        }
      })
      .slice(0, 4)
      .map(tag => {
        return tag.term;
      });

    let data = filtered.map(batch => {
      let obj = {
        time_stamp: -this.nearestHour(batch.created_at)
      };

      for (let i = 0; i < batch.tags.length; i++) {
        if (dataKeys.indexOf(batch.tags[i].term) > -1) {
          obj[batch.tags[i].term] =
            (batch.tags[i].sourceCount / batch.sourceCount) * 100;
        }
      }

      for (let item of dataKeys) {
        if (!(item in obj)) {
          obj[item] = 0;
        }
      }

      return obj;
    });

    this.setState({ lineGraphData: data, dataKeys });
  }

  render() {
    const { styles } = this.props;

    let topTags = this.state.topTags.slice();

    const renderSimpleAreaChart = () => {
      const colors = [
        "#FF4848",
        "#9669FE",
        "#23819C",
        "#FF800D",
        "#800080",
        "#3923D6"
      ];

      return (
        <LineChart
          width={
            styles.hideSidebar
              ? styles.screenWidth - (25 * 2 + 30)
              : Math.min(
                  700 - (25 * 2 + 30),
                  styles.screenWidth - styles.sidebarWidth - (25 * 2 + 30)
                )
          }
          height={300}
          data={this.state.lineGraphData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time_stamp"
            stroke={"rgba(0,0,0,0.4)"}
            ticks={[-24, -20, -16, -12, -8, -4, 0].reverse()}
            domain={[-24, 0]}
            tickFormatter={tick => `${-tick} hrs`}
            axisLine={{ stroke: "#e5e5e5" }}
            tickLine={{ stroke: "#e5e5e5" }}
            type="number"
          />
          <YAxis
            padding={{ bottom: 10 }}
            axisLine={{ stroke: "#e5e5e5" }}
            tickLine={{ stroke: "#e5e5e5" }}
            stroke={"rgba(0,0,0,0.4)"}
            interval={"preserveEnd"}
            tickFormatter={obj => {
              if (obj) {
                return `${Number(obj).toFixed(0)}%`;
              } else {
                return "";
              }
            }}
            width={40}
            domain={["dataMin", "dataMax"]}
            type="number"
          />
          {/*<Tooltip />*/}
          <Legend align={"center"} />
          {this.state.dataKeys.map((item, i) => {
            return (
              <Line
                key={i}
                type="monotone"
                dataKey={item}
                stroke={colors[i]}
                dot={false}
              />
            );
          })}
        </LineChart>
      );
    };

    const renderBarChart = () => {
      let ticks = this.state.barGraphData.map(item => {
        return item.term;
      });

      class Tick extends Component {
        render() {
          const { x, y, stroke, payload, value } = this.props;
          return (
            <text
              x={x}
              y={y + 5}
              // height={30}
              // width={120}
              className="recharts-text recharts-cartesian-axis-tick-value"
              fill="rgba(0,0,0,0.5)"
              textAnchor={"end"}
            >
              <tspan>{payload.value}</tspan>
            </text>
          );
        }
      }

      return (
        <BarChart
          width={Math.min(
            500 - (25 * 2 + 30),
            styles.screenWidth - (25 * 2 + 30)
          )}
          height={300}
          data={this.state.barGraphData}
          ticks={ticks}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barCategoryGap={"20%"}
          layout={"vertical"}
          stroke={"rgba(0,0,0,0.4)"}
          barSize={20}
        >
          {/*<CartesianGrid strokeDasharray="3 3" />*/}
          <XAxis
            type={"number"}
            stroke={"rgba(0,0,0,0.3)"}
            axisLine={{ stroke: "#f2f2f2" }}
            tickLine={{ stroke: "#f2f2f2" }}
            tickFormatter={tick => {
              return `${(Number(tick) * 100).toFixed(0)}%`;
            }}
          />
          <Bar dataKey="percentage" fill="#B8E8FF" stroke={"transparent"} />
          <YAxis
            width={120}
            tickSize={10}
            tickLine={{ stroke: "transparent" }}
            stroke={"rgba(0,0,0,0.4)"}
            type="category"
            dataKey="term"
            axisLine={{ stroke: "transparent" }}
            mirror
            orientation={"right"}
            tick={<Tick />}
          />
        </BarChart>
      );
    };

    if (!topTags[0] || !this.state.batchOfTags || !this.state.records) {
      return <Loader loaderHeight={"100vh"} />;
    }

    return (
      <div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding:
              styles.screenWidth > 500
                ? "100px 20px 50px 20px"
                : "100px 10px 50px 10px"
          }}
        >
          <div
            style={{
              maxWidth: 1400,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              alignItems: "stretch"
            }}
          >
            <div>
              <h4
                style={{
                  marginBottom: 15,
                  fontWeight: "normal",
                  color: "rgba(0,0,0,0.5)"
                }}
              >
                What's being covered in the news?
              </h4>
              <Card style={{ width: "100%", maxWidth: 900 }}>
                <TopWords
                  {...this.props}
                  list={this.state.topTags.slice(0, 30)}
                  suppList={this.state.moreTags}
                  calcValue={word => {
                    return (
                      word.sourceCount / this.state.batchOfTags.sourceCount
                    );
                  }}
                />
              </Card>
            </div>

            <Card style={{ width: "100%", maxWidth: 500, marginTop: 30 }}>
              {renderBarChart()}
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
                  ...as percentage of recent articles
                </span>
              </div>
            </Card>
          </div>

          <div style={{ width: "100%" }}>
            <div
              style={{
                margin: "30px 0px 20px 0px"
              }}
            >
              <FrontPagesRow records={this.state.records} styles={styles} />
            </div>
          </div>

          <h4
            style={{
              marginBottom: 15,
              fontWeight: "normal",
              color: "rgba(0,0,0,0.5)",
              marginTop: 20,
              width: "100%"
            }}
          >
            What are the major topic trends?
          </h4>
          <Card style={{ width: "100%", maxWidth: 700 }}>
            {renderSimpleAreaChart()}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                marginTop: 10
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
                ...as percentage of recent articles
              </span>
            </div>
          </Card>

          <h4
            style={{
              marginBottom: 10,
              fontWeight: "normal",
              color: "rgba(0,0,0,0.5)",
              marginTop: 30,
              width: "100%"
            }}
          >
            Dive deeper into trending topics
          </h4>
          <TopNews styles={styles} />
        </div>
      </div>
    );
  }
}
