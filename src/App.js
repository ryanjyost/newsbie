import React, { Component } from "react";
import shuffle from "shuffle-array";
import "./App.css";
import axios from "axios";
import TwitterLogin from "react-twitter-auth";
import $ from "jquery";
import { Icon } from "react-icons-kit";
import Site from "./components/Site";
import Article from "./components/Article";
import Landing from "./components/Landing";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";
import Tag from "./components/Tag";
import Slider from "react-slick";
import MobileDetect from "mobile-detect";
import detectIt from "detect-it";
import HorizontalScroll from "react-scroll-horizontal";

class App extends Component {
  constructor(props) {
    super(props);

    this.list = [
      "FDRLST",
      "DailyCaller",
      "cnnbrk",
      "bpolitics",
      "HuffPost",
      "WSJ",
      "WashTimes",
      "USATODAY",
      "NewYorker",
      "thehill",
      "abcnews",
      "guardian",
      "TIME",
      "BBCBreaking",
      "politico",
      "thedailybeast",
      "voxdotcom",
      "newrepublic",
      "Reuters",
      "CBSNews",
      "FoxNews",
      "NRO",
      "Slate",
      "nypost",
      "latimes",
      "MSNBC",
      "nytimes",
      "TheAtlantic"
    ];

    this.state = {
      isLanding: true,
      list: shuffle(this.list),
      sites: [],
      articles: [],
      politicsArticles: [],
      opinionArticles: [],
      currentNews: [],
      currentOpinions: [],
      topTags: [],
      records: [],
      batch: null,

      // UI
      screenWidth: 0,
      screenHeight: 0,
      touchOnly: true
    };
  }

  updateDimensions() {
    let screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    // let update_height = Math.round(update_width)

    this.setState({ screenWidth: screenWidth, screenHeight: screenHeight });
  }

  componentDidMount() {
    let tagPlaceholders = [];

    for (let i = 1; i <= 30; i++) {
      tagPlaceholders.push(null);
    }

    this.setState({ topTags: tagPlaceholders });

    this.updateDimensions();

    axios
      .get(`https://birds-eye-news-api.herokuapp.com/get_front_pages`, {
        Accept: "application/json"
      })
      .then(response => {
        //let results = response.body.results;
        // console.log("hey", response.data.records);
        const records = response.data.records;
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
        let currentNews = shuffle(res.data.politicsArticles).slice(0, 50);

        let filteredOpinions = res.data.opinionArticles.filter(article => {
          return article.site.name.toLowerCase() !== "cbsnews";
        });

        let currentOpinions = shuffle(filteredOpinions).slice(0, 50);

        this.setState({
          sites: res.data.sites,
          politicsArticles: res.data.politicsArticles,
          opinionArticles: res.data.opinionArticles,
          topTags: res.data.topTags,
          currentNews,
          currentOpinions
        });
      })
      .catch(err => console.log(err));

    window.addEventListener(
      "resize",
      this.throttle(this.updateDimensions.bind(this), 1000)
    );

    let touchOnly = detectIt.deviceType === "touchOnly";
    this.setState({ touchOnly });
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

  handleHorzScroll(direction, selector) {
    $(`#${selector}`).animate(
      {
        scrollLeft: `${direction === "left" ? "-" : "+"}=${this.state
          .screenWidth - 20}px`
      },
      "fast"
    );
  }

  render() {
    const {
      screenWidth,
      screenHeight,
      records,
      touchOnly,
      isLanding
    } = this.state;
    let imageWidth = touchOnly
      ? Math.min(screenWidth, 700)
      : Math.min(screenWidth, 400);

    let articleWidth = touchOnly
      ? Math.min(screenWidth, 400)
      : Math.min(screenWidth, 300);
    let articleMargin = 10;

    let isWide = screenWidth > 768;
    let showSlider = screenWidth < 500;

    const Arrow = ({ direction, selector }) => {
      let isLeft = direction === "left";
      return (
        <div
          id={`${selector}-${direction}`}
          style={{
            height: 40,
            width: 40,
            // backgroundColor: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            // alignItems: "center",
            justifyContent: "center",
            top: "50%",
            // bottom: "-8px",
            left: isLeft ? "2px" : "",
            right: isLeft ? "" : "2px",
            transform: "translateY(-50%)",
            position: "absolute",
            zIndex: 1,
            borderRadius: 9999,
            boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            fontSize: 24,
            // color: "rgba(255, 255, 255, 0.4)",
            lineHeight: "37px",
            cursor: "pointer"
          }}
          className={"navArrow"}
          onClick={() => this.handleHorzScroll(direction, selector)}
          // onClick={() => handleClick()}
        >
          {isLeft ? <span>&lsaquo;</span> : <span>&rsaquo;</span>}
        </div>
      );
    };

    const FrontPages = () => {
      if (touchOnly && this.state.records.length) {
        const settings = {
          dots: false,
          arrows: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          className: "sliderContainer",
          centerMode: true,
          centerPadding: "0px",
          swipeToSlide: true
        };
        return (
          <Slider {...settings}>
            {this.state.records.length
              ? this.state.records.map((record, i) => {
                  return (
                    <Site
                      key={i}
                      index={i}
                      record={record}
                      siteMargin={30}
                      imageWidth={touchOnly ? imageWidth : imageWidth - 50}
                      showSlider={showSlider}
                      touchOnly={touchOnly}
                    />
                  );
                })
              : this.state.sites.map((site, i) => {
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        height: imageWidth,
                        width: imageWidth,
                        backgroundColor: "red"
                      }}
                    />
                  );
                })}
          </Slider>
        );
      } else {
        return (
          <div style={{ position: "relative" }}>
            <Arrow direction={"left"} selector={"frontPages"} />
            <div
              id={"frontPages"}
              className={"horzRow"}
              style={{
                borderRadius: 5,
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                height: imageWidth + 80,
                overflowX: "auto",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                // borderTop: "5px solid rgba(255, 255, 255, 0.01)",
                padding: "50px 20px 35px 20px",
                position: "relative"
              }}
            >
              {this.state.records.length
                ? this.state.records.map((record, i) => {
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column"
                        }}
                      >
                        <Site
                          key={i}
                          index={i}
                          record={record}
                          siteMargin={30}
                          imageWidth={imageWidth - 50}
                          showSlider={showSlider}
                          touchOnly={touchOnly}
                        />
                      </div>
                    );
                  })
                : this.state.sites.map((site, i) => {
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column"
                        }}
                      >
                        <Site
                          key={i}
                          index={i}
                          record={null}
                          siteMargin={30}
                          imageWidth={imageWidth - 50}
                          showSlider={showSlider}
                          touchOnly={touchOnly}
                        />

                        <a
                          href={""}
                          className={"hoverBtn"}
                          style={{
                            textAlign: "left",
                            marginTop: 15,
                            fontWeight: "300",
                            display: "inline-block",
                            textDecoration: "none",
                            marginLeft: 5,
                            padding: "5px 12px",
                            borderRadius: "50px",
                            fontSize: 12,
                            letterSpacing: "0.03em",
                            width: 50
                          }}
                        />
                      </div>
                    );
                  })}
            </div>
            <Arrow direction={"right"} selector={"frontPages"} />
          </div>
        );
      }
    };

    const Tags = () => {
      return (
        <div
          style={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap"
          }}
        >
          <div
            style={{
              padding: "10px 20px",
              display: "flex",
              width: "auto",
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: 600,
              margin: "auto"
            }}
          >
            {this.state.topTags.map((tag, i) => {
              return <Tag key={i} tag={tag} />;
            })}
          </div>
        </div>
      );
    };

    const ArticleList = ({ list, container }) => {
      if (touchOnly) {
        const settings = {
          dots: false,
          arrows: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          className: "sliderContainer",
          // centerMode: true,
          swipeToSlide: true
          // responsive: [
          //   {
          //     breakpoint: 700,
          //     settings: {
          //       slidesToShow: 2,
          //       slidesToScroll: 2,
          //       infinite: true,
          //       dots: true
          //     }
          //   }
          // ]
        };
        return (
          <Slider {...settings}>
            {list.length
              ? list.map((article, i) => {
                  return (
                    <Article
                      key={i}
                      index={i}
                      article={article}
                      articleWidth={articleWidth}
                      articleMargin={articleMargin}
                      isSlider
                    />
                  );
                })
              : [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ].map((article, i) => {
                  return (
                    <div
                      key={i}
                      style={{
                        height: articleWidth,
                        width: articleWidth,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        margin: articleMargin
                      }}
                    />
                  );
                })}
          </Slider>
        );
      } else {
        return (
          <div
            id={container}
            style={{
              borderRadius: 5,
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              height: articleWidth + 50,
              overflowX: "auto",
              overflowY: "hidden",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              // borderTop: "5px solid rgba(255, 255, 255, 0.01)",
              padding: "30px 20px 20px 20px",
              position: "relative"
            }}
          >
            {list.length
              ? list.map((article, i) => {
                  return (
                    <Article
                      key={i}
                      index={i}
                      article={article}
                      articleWidth={articleWidth}
                      articleMargin={articleMargin}
                    />
                  );
                })
              : [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ].map((article, i) => {
                  return (
                    <div
                      key={i}
                      style={{
                        height: articleWidth,
                        width: articleWidth,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        margin: articleMargin
                      }}
                    />
                  );
                })}
          </div>
        );
      }
    };

    const SectionTitle = ({ title, description, num, children }) => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: 500,
            margin: "auto",
            flexDirection: "column",
            padding: "0px 10px",
            marginBottom: 20,
            marginTop: 50,
            textAlign: "center"
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              marginRight: 10,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.5)",
              marginBottom: 10,
              marginTop: 2,
              padding: "5px 12px",
              letterSpacing: "0.03em",
              transform: "skew(-20deg)" /* SKEW */
            }}
          >
            <div
              style={{
                display: "inline-block",
                transition: "background 0.2s",
                transform: "skew(20deg)" /* SKEW */
              }}
            >
              Step {num}
            </div>
          </div>
          <h4
            style={{
              margin: "0px",
              // marginBottom: 7,
              color: "rgba(46, 228, 246, 1)",
              fontWeight: "400",
              letterSpacing: "0.05em",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "10px 0px"
            }}
          >
            {title}
          </h4>
          <div
            style={{
              textAlign: "center",
              margin: "10px 0px 0px 0px",
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: "400",
              letterSpacing: "0.05em",
              fontSize: 15,
              padding: "0px 0px 0px 0px",
              lineHeight: 1.2
            }}
          >
            {children}
          </div>
        </div>
      );
    };

    const SwipeHelp = () => {
      if (touchOnly) {
        return (
          <div
            style={{
              margin: "auto",
              color: "rgba(255, 255, 255, 0.4)",
              textAlign: "center",
              marginBottom: 5,
              fontWeight: "light",
              fontSize: 12
            }}
          >
            &larr; <span style={{ margin: "0px 10px" }}>Swipe</span> &rarr;
          </div>
        );
      } else {
        return null;
      }
    };

    const TopBar = () => {
      return (
        <div
          style={{
            height: 60,
            backgroundColor: isLanding
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(33, 58, 73, 0.9)",
            borderBottom: isLanding
              ? "1px solid #e5e5e5"
              : "1px solid rgba(255, 255," + " 255, 0.1)",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            letterSpacing: "0.03em",
            position: "fixed",
            top: 0,
            zIndex: 10
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginLeft: "5%"
            }}
          >
            <h4
              style={{
                color: isLanding
                  ? "rgba(33, 58, 73, 0.9)"
                  : "rgba(255, 255, 255, 0.8)",

                fontWeight: "bold"
              }}
            >
              newsbie
            </h4>
          </div>
          <div
            style={{
              backgroundColor: isLanding
                ? "rgba(33, 58, 73, 0.4)"
                : "rgba(46, 228, 246, 0.6)",
              marginRight: "5%",
              padding: "5px 15px",
              fontSize: 14,
              fontWeight: "600",
              color: "#fff",
              borderRadius: 9999
            }}
            className={"cta"}
            onClick={() => this.setState({ isLanding: !this.state.isLanding })}
          >
            {this.state.isLanding ? "Try Demo" : "Get the App"}
          </div>
        </div>
      );
    };

    return (
      <div style={{ paddingBottom: "100px" }}>
        <TopBar />
        {this.state.isLanding ? (
          <Landing records={this.state.records} />
        ) : (
          <div
            className="main"
            style={{
              maxWidth: "100%",
              overflowX: "hidden",
              margin: "50px 10px 0px 10px"
            }}
          >
            <div style={{ maxWidth: 600, margin: "auto", marginTop: 100 }}>
              <h2
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  textAlign: "center",
                  fontWeight: 400,
                  lineHeight: 1.4,
                  letterSpacing: "0.03em"
                }}
              >
                Want a <strong>balanced, efficient</strong> way <br />to stay
                informed?
              </h2>
              <h1
                style={{
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.3)"
                }}
              >
                &darr;
              </h1>
            </div>
            <SectionTitle num={1} title={"Browse front pages of news sites"}>
              <div>
                Start out with a bird's eye view of a diverse range of news
                sources.{" "}
                <div style={{ marginTop: 15 }}>
                  Get a feel for{" "}
                  <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    what
                  </strong>{" "}
                  is being covered and{" "}
                  <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {" "}
                    how{" "}
                  </strong>it's being covered.
                </div>
              </div>
            </SectionTitle>
            <SwipeHelp />
            <FrontPages />

            <SectionTitle num={2} title={"Catch up on buzzwords"}>
              <div>
                {this.state.opinionArticles.length
                  ? `Explore the most common words and phrases found in ${
                      this.state.opinionArticles.length &&
                      this.state.politicsArticles.length
                        ? this.state.opinionArticles.length +
                          this.state.politicsArticles.length
                        : ""
                    } recent article titles ${
                      this.state.sites.length ? "from" : ""
                    } ${
                      this.state.sites.length ? this.state.sites.length : ""
                    }${this.state.sites.length ? " sources" : ""}. `
                  : ""}
                <div style={{ marginTop: 10 }}>
                  <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    Click a buzzword
                  </strong>{" "}
                  to dive deeper on Wikipedia.{" "}
                </div>
              </div>
            </SectionTitle>

            <Tags />

            <SectionTitle num={3} title={"Read some news articles"}>
              Now start skimming articles. Click and read some from a variety of
              news sites.
              <div style={{ marginTop: 10 }}>
                By consulting multiple sources, you're able to filter out the
                noise - and{" "}
                <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  get a clearer picture of what's really going on.
                </strong>
              </div>
            </SectionTitle>
            <SwipeHelp />
            <div style={{ position: "relative" }}>
              {touchOnly ? null : (
                <Arrow direction={"left"} selector={"newsArticles"} />
              )}
              <ArticleList
                list={this.state.currentNews}
                container={"newsArticles"}
              />
              {touchOnly ? null : (
                <Arrow direction={"right"} selector={"newsArticles"} />
              )}
            </div>

            <SectionTitle num={4} title={"Explore opinion pieces"}>
              Once you've built up a base of facts and observations, you're
              ready to explore more subjective takes on the stories of the day.
              <div style={{ marginTop: 10 }}>
                You'll want to consider a wide range of perspectives - and avoid
                getting stuck in an{" "}
                <a
                  target="_blank"
                  style={{ color: "rgba(255, 255, 255, 0.7)" }}
                  href="https://en.wikipedia.org/wiki/Echo_chamber_(media)"
                >
                  echo chamber.
                </a>
              </div>
            </SectionTitle>
            <SwipeHelp />
            <div style={{ position: "relative" }}>
              {touchOnly ? null : (
                <Arrow direction={"left"} selector={"opinionArticles"} />
              )}
              <ArticleList
                list={this.state.currentOpinions}
                container={"opinionArticles"}
              />
              {touchOnly ? null : (
                <Arrow direction={"right"} selector={"opinionArticles"} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
