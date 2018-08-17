import React, { Component } from "react";
import TagCloud from "./TagCloud";
import axios from "axios/index";
import shuffle from "shuffle-array";
import ReactGA from "react-ga";
import Slider from "react-slick";

import SingleFrontPage from "./SingleFrontPage";
import TimeAgo from "react-timeago";
import { androidTime } from "react-icons-kit/ionicons/androidTime";
import { Icon } from "react-icons-kit";
import SingleTopic from "./SingleTopic";
import detectIt from "detect-it";
import {
  AreaSeries,
  HorizontalBarSeries,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis
} from "react-vis";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTags: [null],
      batchOfTags: null,
      records: [],
      batch: [],
      screenWidth: 0,
      sites: [],
      politicsArticles: [],
      opinionArticles: [],
      currentNews: [],
      currentOpinions: [],
      touchOnly: detectIt.deviceType === "touchOnly"
    };
  }

  componentDidMount() {
    this.updateDimensions();

    let tagPlaceholders = [];

    for (let i = 1; i <= 20; i++) {
      tagPlaceholders.push(null);
    }

    this.setState({ topTags: tagPlaceholders });

    axios
      .get("https://birds-eye-news-api.herokuapp.com/recent_tags")
      .then(res => {
        const tags = res.data.batch.tags.sort((a, b) => {
          let aCount = a ? ("tf" in a ? a.tf : 0) : 0;
          let bCount = b ? ("tf" in b ? b.tf : 0) : 0;
          if (aCount < bCount) {
            return 1;
          } else if (bCount < aCount) {
            return -1;
          } else {
            return 0;
          }
        });

        this.setState({
          batchOfTags: res.data.batch,
          topTags: tags
        });
      })
      .catch(err => console.log(err));

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

    axios
      .get("https://birds-eye-news-api.herokuapp.com/today")
      .then(res => {
        let currentNews = shuffle(res.data.politicsArticles);
        currentNews = currentNews.slice(0, 50);

        let filteredPolitics = res.data.politicsArticles.filter(article => {
          return article.site.name.toLowerCase() !== "politico";
        });

        let filteredOpinions = res.data.opinionArticles.filter(article => {
          return article.site.name.toLowerCase() !== "cbsnews";
        });

        let currentOpinions = shuffle(filteredOpinions);
        currentOpinions = currentOpinions.slice(0, 50);

        this.setState({
          sites: res.data.sites,
          politicsArticles: filteredPolitics,
          opinionArticles: filteredOpinions,
          currentNews,
          currentOpinions
        });
      })
      .catch(err => console.log(err));

    window.addEventListener(
      "resize",
      this.throttle(this.updateDimensions.bind(this), 1000)
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

    let imageWidth = Math.min(screenWidth - 60, 500);

    let articleWidth = Math.min(screenWidth - 100, 300);
    let articleHeight = articleWidth * 0.75;
    let articleMargin = 10;

    const sectionStyle = {
      borderTop: "1px solid #f2f2f2",
      borderBottom: "1px solid #f2f2f2",
      padding: 20,
      backgroundColor: "#fff",
      marginBottom: 5
    };

    const styles = {
      articleWidth,
      articleHeight,
      articleMargin,
      sectionStyle
    };

    let topTags = this.state.topTags.slice();
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

    const renderTopWordsGraph = () => {
      let sortedData = data.sort((a, b) => {
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
            marginLeft: -20
          }}
        >
          {data && (
            <XYPlot yType="ordinal" xType="linear" height={300} width={300}>
              <VerticalGridLines />
              <HorizontalGridLines />
              <HorizontalBarSeries
                color={"rgba(46, 228, 246, 0.6)"}
                opacity={0.5}
                data={data.slice(data.length - 10)}
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
      if (!time) {
        return null;
      } else {
        return (
          <h6
            style={{
              margin: 0,
              textAlign: "right",
              fontWeight: "light",
              color: "rgba(0,0,0,0.2)"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end"
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
    };

    return (
      <div
        style={{
          backgroundColor: "#f2f2f2",
          minHeight: "100vh",
          padding: "20px 0px",
          maxWidth: "100%",
          overflowX: "hidden"
        }}
      >
        {/* ======================================== */}
        <div style={sectionStyle}>
          <h5 style={{ margin: "0px 0px 10px 0px" }}>
            {`Most common words ${this.state.batchOfTags ? "from" : ""} ${
              this.state.batchOfTags ? this.state.batchOfTags.sourceCount : ""
            } ${this.state.batchOfTags ? "recent headlines" : ""}`}
          </h5>
          <TagCloud tags={this.state.topTags} />
          {renderTimeAgo(
            this.state.batchOfTags ? this.state.batchOfTags.created_at : null
          )}
        </div>

        {/* ======================================== */}
        <div style={sectionStyle}>
          <h5 style={{ margin: 0 }}>
            % of recent headlines that include the word...
          </h5>
          {renderTopWordsGraph()}
          {renderTimeAgo(
            this.state.batchOfTags ? this.state.batchOfTags.created_at : null
          )}
        </div>

        {/* ======================================== */}
        <div style={{ ...sectionStyle, ...{ padding: "20px 10px" } }}>
          <h5
            style={{
              margin: 0,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <span style={{ margin: "0px 5px", color: "rgba(0,0,0,0.2)" }}>
              &larr;
            </span>
            {`Current front pages ${this.state.records ? "of" : ""} ${
              this.state.records ? this.state.records.length : ""
            } ${this.state.records ? "news sites" : ""}`}{" "}
            <span style={{ margin: "0px 5px", color: "rgba(0,0,0,0.2)" }}>
              &rarr;
            </span>
          </h5>
          <div style={{ padding: "20px 0px" }}>{renderFrontPages()}</div>
          {renderTimeAgo(this.state.batch ? this.state.batch.created_at : null)}
        </div>

        {/* ======================================== */}
        <SingleTopic
          tag={this.state.topTags[0]}
          sectionStyle={sectionStyle}
          styles={styles}
          {...this.state}
        />
      </div>
    );
  }
}
