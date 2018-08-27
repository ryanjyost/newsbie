import React, { Component } from "react";
import TagCloud from "../TagCloud";
import axios from "axios/index";
import shuffle from "shuffle-array";
import ReactGA from "react-ga";
import Slider from "react-slick";
import { curveCatmullRom } from "d3-shape";
import "../../../node_modules/react-vis/dist/style.css";

import SingleFrontPage from "../SingleFrontPage";
import TimeAgo from "react-timeago";
import { androidTime } from "react-icons-kit/ionicons/androidTime";
import { Icon } from "react-icons-kit";
import SingleTopic from "../SingleTopic";
import SectionWithLoader from "../SectionWithLoader";
import detectIt from "detect-it";
import {
  AreaSeries,
  HorizontalBarSeries,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
  LineSeries
} from "react-vis";
import $ from "jquery";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTags: [null],
      topics: [],
      batchOfTags: null,
      allTagBatches: [],
      records: [],
      batch: [],
      screenWidth: 0,
      sites: [],
      politicsArticles: [],
      opinionArticles: [],
      currentNews: [],
      currentOpinions: [],
      touchOnly: detectIt.deviceType === "touchOnly"

      // word trends
    };
  }

  componentDidMount() {
    this.updateDimensions();

    /*
    * Recent Tags
    * */
    axios
      .get("https://birds-eye-news-api.herokuapp.com/recent_tags")
      .then(res => {
        // get top, different topics
        let topics = [res.data.topTags[0]];

        let tags = res.data.topTags;
        for (let i = 1; i < tags.length; i++) {
          let currentTag = tags[i];
          if (topics.length > 2) {
            break;
          } else {
            let duplicate = topics.find(topic => {
              let splitTag = currentTag.term.split(" ");
              // console.log(splitTag);
              return splitTag.find(word => {
                console.log(word, topic.term);
                return word.includes(topic.term) || topic.term.includes(word);
              });
            });
            if (duplicate) {
              // console.log(duplicate, currentTag);
              continue;
            } else {
              topics.push(currentTag);
            }
          }
        }

        // console.log(topics);
        for (let batch of res.data.batches) {
          // console.log(batch);
          let cohen = batch.tags.find(tag => {
            return tag.term === "cohen";
          });

          // if (cohen) {
          //   console.log(cohen);
          // } else {
          //   console.log("NOT FOUND", batch);
          // }
        }

        this.setState({
          batchOfTags: res.data.batches[0],
          allTagBatches: res.data.batches,
          topTags: res.data.topTags,
          topics
        });
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
          batch: response.data.batch
        });
      })
      .catch(error => {
        console.log("ERROR", error);
        this.setState({ showError: true });
      });

    /*
	 * Articles
	 * */
    axios
      .get("https://birds-eye-news-api.herokuapp.com/today")
      .then(res => {
        let currentNews = shuffle(res.data.politicsArticles);

        let filteredPolitics = currentNews.filter(article => {
          return article.site.name.toLowerCase() !== "politico";
        });

        let currentOpinions = shuffle(res.data.opinionArticles);

        let filteredOpinions = currentOpinions.filter(article => {
          return article.site.name.toLowerCase() !== "cbsnews";
        });

        this.setState({
          sites: res.data.sites,
          politicsArticles: filteredPolitics,
          opinionArticles: filteredOpinions
        });
      })
      .catch(err => console.log(err));

    window.addEventListener(
      "resize",
      this.throttle(this.updateDimensions.bind(this), 200)
    );

    // google analystics
    this.initReactGA();

    window.addEventListener("touchstart", this.touchStart);
    window.addEventListener("touchmove", this.preventTouch, { passive: false });
  }

  updateDimensions() {
    let screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    // let update_height = Math.round(update_width)

    this.setState({ screenWidth: screenWidth, screenHeight: screenHeight });
  }

  /**
   * throttle function that catches and triggers last invocation
   * use time to see if there is a last invocation
   */
  throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  touchStart(e) {
    this.firstClientX = e.touches[0].clientX;
    this.firstClientY = e.touches[0].clientY;
  }

  preventTouch(e) {
    const minValue = 5; // threshold

    this.clientX = e.touches[0].clientX - this.firstClientX;
    this.clientY = e.touches[0].clientY - this.firstClientY;

    // Vertical scrolling does not work when you start swiping horizontally.
    if (Math.abs(this.clientX) > minValue) {
      e.preventDefault();
      e.returnValue = false;
      return false;
    }
  }

  initReactGA() {
    ReactGA.initialize("UA-97014671-5");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    const {
      screenWidth,
      screenHeight,
      records,
      touchOnly,
      isLanding
    } = this.state;

    let imageWidth = Math.min(screenWidth - 50, 400);

    let articleWidth = Math.min(screenWidth - 100, 300);
    let articleHeight = articleWidth * 0.75;
    let articleMargin = 10;

    const sectionStyle = {
      // border: this.props.noStyle ? null : "1px solid #e5e5e5",
      padding: 25,
      backgroundColor: "#fff",
      margin: "10px 10px",
      borderRadius: 3,
      position: "relative",
      width: "100%"
    };

    const styles = {
      articleWidth,
      articleHeight,
      articleMargin,
      sectionStyle,
      screenWidth,
      maxWidth: 900
    };

    let topTags = this.state.topTags.slice();

    const renderTopWordsGraph = () => {
      let data = topTags.map(tag => {
        if (tag) {
          return {
            x: tag.sourceCount / this.state.batchOfTags.sourceCount,
            y: tag.term
          };
        } else {
          return {
            x: 0,
            y: ""
          };
        }
      });

      let sorted = data.sort((a, b) => {
        if (a.x > b.x) {
          return 1;
        } else if (b.x > a.x) {
          return -1;
        } else {
          return 0;
        }
      });

      return (
        <div
          style={{
            display: "flex",
            width: "auto",
            overflowX: "scroll",
            overflowY: "hidden",
            padding: "10px 0px 0px 0px",
            marginLeft: -20,
            strokeWidth: 0
          }}
        >
          {data && (
            <XYPlot
              yType="ordinal"
              xType="linear"
              height={300}
              width={Math.min(styles.screenWidth - 60, 350)}
            >
              <VerticalGridLines />
              <HorizontalGridLines />
              <HorizontalBarSeries
                color={"rgba(46, 228, 246, 0.6)"}
                opacity={0.5}
                data={sorted.slice(data.length - 10)}
              />
              <YAxis
                left={250}
                style={{
                  line: { stroke: "rgba(0,0,0,0)" },
                  ticks: { stroke: "rgba(0,0,0,0)" },
                  text: {
                    stroke: "none",
                    fill: "rgba(0,0,0,0.8)",
                    fontWeight: 400,
                    fontSize: 12
                  }
                }}
              />
              <XAxis
                tickFormat={v => `${(v * 100).toFixed()}%`}
                style={{
                  line: { stroke: "rgba(0,0,0,0)" },
                  ticks: { stroke: "rgba(0,0,0,0)" },
                  text: {
                    stroke: "none",
                    fill: "rgba(0,0,0,0.4)",
                    fontWeight: 300,
                    fontSize: 10
                  }
                }}
              />
            </XYPlot>
          )}
        </div>
      );
    };

    const renderTimeAgo = time => {
      if (true) {
        return null;
      } else {
        return (
          <h6
            style={{
              margin: 0,
              textAlign: "left",
              fontWeight: "light",
              color: "rgba(0,0,0,0.2)",
              width: "100%",
              marginTop: 10
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start"
              }}
            >
              <Icon
                style={{
                  marginRight: 3,
                  color: "rgba(0, 0, 0, 0.3)"
                }}
                icon={androidTime}
                size={12}
              />{" "}
              <TimeAgo date={time} />
            </div>
          </h6>
        );
      }
    };

    const renderFrontPages = () => {
      const settings = {
        // dots: true,
        infinite: true,
        speed: 100,
        slidesToShow: 1,
        slidesToScroll: 1,
        // dots: false,
        arrows: false,
        className: "frontPageSlider"
        // infinite: true,
        // speed: 500,
        // slidesToShow: 1,
        // slidesToScroll: 1,
        // className: "sliderContainer",
        // centerMode: true,
        // centerPadding: "0px",
        // swipeToSlide: true
      };
      if (touchOnly) {
        return (
          <Slider {...settings} style={{ padding: "20px 0px" }}>
            {this.state.records.map((record, i) => {
              return (
                <SingleFrontPage
                  key={i}
                  imageWidth={imageWidth}
                  record={record}
                />
              );
            })}
          </Slider>
        );
      } else {
        return (
          <div
            className={"horzRow"}
            style={{
              display: "flex",
              padding: "20px 20px",
              overflowX: "auto",
              position: "relative"
            }}
          >
            {this.state.records.map((record, i) => {
              return (
                <div key={i} style={{ margin: "0px 15px" }}>
                  <SingleFrontPage
                    key={i}
                    imageWidth={imageWidth}
                    record={record}
                  />
                </div>
              );
            })}
          </div>
        );
      }
    };

    return (
      <div
        style={{
          backgroundColor: "#f2f2f2",
          minHeight: "100vh",
          padding: "60px 0px 10px 0px",
          width: "100%",
          maxWidth: 900,
          margin: "auto",
          overflowX: "hidden",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "end",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            backgroundColor: "#f2f2f2",
            padding: "0px 0px 0px 0px",
            width: "100%",
            overflowX: "hidden",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-end",
            flexWrap: "wrap"
          }}
        >
          <div
            style={{ ...sectionStyle, ...{ marginBottom: 10, maxWidth: 300 } }}
          >
            <h5 style={{ margin: 0, color: "rgba(46, 228, 246,1)" }}>
              welcome to newsbie, where you can
            </h5>
            <h2 style={{ margin: 0 }}>
              monitor, analyze & understand the news media.
            </h2>
            <button
              style={{
                border: "2px solid rgb(46, 228, 246)",
                outline: "none",
                margin: "20px 0px 10px 0px",
                fontSize: 14,
                cursor: "pointer",
                padding: "5px 10px",
                borderRadius: 3,
                color: "rgba(0, 0, 0, 0.8)",
                backgroundColor: "#fff"
              }}
            >
              Take the guided tour
            </button>
            {/*<div*/}
            {/*style={{*/}
            {/*width: "100%",*/}
            {/*display: "flex",*/}
            {/*justifyContent: "center",*/}
            {/*alignItems: "center",*/}
            {/*flexDirection: "column",*/}
            {/*color: "rgba(0,0,0,0.2)"*/}
            {/*}}*/}
            {/*>*/}
            {/*<h5*/}
            {/*style={{*/}
            {/*color: "rgba(0,0,0,0.3)",*/}
            {/*margin: "5px 0px 5px 0px"*/}
            {/*}}*/}
            {/*>*/}
            {/*or just keep scrolling*/}
            {/*</h5>*/}
            {/*<h5 style={{ margin: "5px 0px 5px 0px", color: "rgba(0,0,0,0.3)" }}>*/}
            {/*&darr;*/}
            {/*</h5>*/}
            {/*</div>*/}
          </div>
          <SectionWithLoader
            title={null}
            isLoading={
              this.state.records.length < 1 || this.state.sites.length < 1
            }
            sectionStyle={{
              width: Math.min(screenWidth - 50, 300),
              lineHeight: 1.7,
              fontSize: 15
            }}
            loaderHeight={100}
          >
            <div>
              <div>
                <span
                  style={{
                    margin: "0px 5px 0px 0px",
                    fontSize: 20,
                    fontWeight: "bold"
                  }}
                >
                  newsbie
                </span>
                <span style={{ margin: 0, color: "rgba(0,0,0,0.7)" }}>
                  collects the <strong>latest political news</strong> headlines
                  and other data from a
                </span>
                <span
                  style={{
                    margin: "0px 5px",
                    fontSize: 20,
                    color: "rgba(46, 228, 246,1)",
                    fontWeight: "bold",
                    marginTop: 5
                  }}
                >
                  balanced, diverse
                </span>
                <span style={{ margin: 0, color: "rgba(0,0,0,0.7)" }}>
                  selection of
                </span>
                <span
                  style={{
                    margin: "0px 5px",
                    fontSize: 20,
                    color: "rgba(46, 228, 246,1)",
                    fontWeight: "bold"
                  }}
                >
                  {this.state.sites.length}
                </span>
                <span style={{ margin: 0, color: "rgba(0,0,0,0.7)" }}>
                  sources.
                </span>
              </div>
            </div>

            {/*<div*/}
            {/*style={{*/}
            {/*width: "100%",*/}
            {/*display: "flex",*/}
            {/*justifyContent: "center",*/}
            {/*alignItems: "center",*/}
            {/*flexDirection: "column",*/}
            {/*color: "rgba(0,0,0,0.2)"*/}
            {/*}}*/}
            {/*>*/}
            {/*<h5*/}
            {/*style={{*/}
            {/*color: "rgba(0,0,0,0.3)",*/}
            {/*margin: "5px 0px 5px 0px"*/}
            {/*}}*/}
            {/*>*/}
            {/*or just keep scrolling*/}
            {/*</h5>*/}
            {/*<h5 style={{ margin: "5px 0px 5px 0px", color: "rgba(0,0,0,0.3)" }}>*/}
            {/*&darr;*/}
            {/*</h5>*/}
            {/*</div>*/}
          </SectionWithLoader>
        </div>

        <div style={{ ...sectionStyle, ...{ marginBottom: 10 } }}>hey</div>

        {/*<h3*/}
        {/*style={{*/}
        {/*textAlign: "center",*/}
        {/*width: "100%",*/}
        {/*padding: "0px 20px",*/}
        {/*margin: "25px 0px 10px 0px",*/}
        {/*color: "rgba(0,0,0,0.8)"*/}
        {/*}}*/}
        {/*>*/}
        {/*bird's eye view*/}
        {/*</h3>*/}
        {/* ======================================== */}
        <SectionWithLoader
          title={`most common words from ${
            this.state.batchOfTags ? this.state.batchOfTags.sourceCount : ""
          } recent headlines`}
          isLoading={this.state.topTags.length < 2}
          sectionStyle={{
            width: Math.min(screenWidth - 50, 350)
          }}
          // divStyle={{ width: screenWidth > 768 ? "50%" : "100%" }}
        >
          <TagCloud tags={this.state.topTags} />
          {renderTimeAgo(
            this.state.batchOfTags ? this.state.batchOfTags.created_at : null
          )}
        </SectionWithLoader>

        {/* ======================================== */}
        <SectionWithLoader
          title={`% of recent headlines that include the word...`}
          isLoading={!this.state.topTags[0]}
          sectionStyle={{
            width: Math.min(screenWidth - 50, 350)
          }}
        >
          {renderTopWordsGraph()}
          {renderTimeAgo(
            this.state.batchOfTags ? this.state.batchOfTags.created_at : null
          )}
        </SectionWithLoader>

        {/* ======================================== */}
        <div
          style={{
            padding: "20px 0px",
            margin: 0,
            // backgroundColor: "#fff",
            width: Math.min(screenWidth)
            // border: "1px solid #e5e5e5",
            // borderRadius: 3
          }}
        >
          <h5
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 20,
              color: "rgba(0,0,0,0.4)"
            }}
          />
          <div style={{ padding: "20px 0px 0px 0px" }}>
            {renderFrontPages()}
          </div>
          <div style={{ padding: "0px 20px" }}>
            {renderTimeAgo(
              this.state.batch ? this.state.batch.created_at : null
            )}
          </div>
        </div>

        {/* ======================================== */}
        {/*<SingleTopic*/}
        {/*tag={this.state.topics[0] ? this.state.topics[0] : null}*/}
        {/*styles={styles}*/}
        {/*tagIndex={0}*/}
        {/*{...this.state}*/}
        {/*/>*/}
        {/*/!* ======================================== *!/*/}
        {/*<SingleTopic*/}
        {/*tag={this.state.topics[1] ? this.state.topics[1] : null}*/}
        {/*styles={styles}*/}
        {/*tagIndex={1}*/}
        {/*{...this.state}*/}
        {/*/>*/}
        {/*/!* ======================================== *!/*/}
        {/*<SingleTopic*/}
        {/*tag={this.state.topics[2] ? this.state.topics[2] : null}*/}
        {/*styles={styles}*/}
        {/*tagIndex={2}*/}
        {/*{...this.state}*/}
        {/*/>*/}
      </div>
    );
  }
}
