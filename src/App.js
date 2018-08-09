import React, { Component } from "react";
import { Link } from "react-router-dom";
import shuffle from "shuffle-array";
import "./App.css";
import axios from "axios";
import $ from "jquery";
import Site from "./components/Site";
import Article from "./components/Article";
import Landing from "./components/Landing";
import FrontPages from "./components/FrontPages";
import Tag from "./components/Tag";
import Slider from "react-slick";
import detectIt from "detect-it";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import TimeAgo from "react-timeago";
import { androidTime } from "react-icons-kit/ionicons/androidTime";
import { Icon } from "react-icons-kit";
import ReactGA from "react-ga";

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
      isLanding: false,
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
      currentTag: null,

      email: "",

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

    // google analystics
    this.initReactGA();

    window.addEventListener("touchstart", this.touchStart);
    window.addEventListener("touchmove", this.preventTouch, { passive: false });
  }

  componentWillUnmount() {
    window.removeEventListener("touchstart", this.touchStart);
    window.removeEventListener("touchmove", this.preventTouch, {
      passive: false
    });
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

  scrollTop(isSmooth = false, top = 0) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: isSmooth ? "smooth" : "auto"
    });
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
      : Math.min(screenWidth, 340);
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
              return (
                <Tag
                  key={i}
                  tag={tag}
                  currentTag={this.state.currentTag}
                  updateCurrentTag={tag => this.setState({ currentTag: tag })}
                />
              );
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
              height: articleWidth,
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
              fontSize: 15,
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
          <h3
            style={{
              margin: "0px",
              // marginBottom: 7,
              color: "rgba(46, 228, 246, 1)",
              fontWeight: "400",
              letterSpacing: "0.05em",
              // borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "10px 0px"
            }}
          >
            {title}
          </h3>
          {children && (
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
          )}
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

    const renderSignUp = (isBottom = true) => {
      const url =
        "https://newsbie.us18.list-manage.com/subscribe/post?u=bbab41b4faa898c5bb1f4c2e1&amp;id=75f26540d8";

      return (
        <MailchimpSubscribe
          url={url}
          render={({ subscribe, status, message, onValidated }) => {
            return (
              <div
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                className="validate"
                style={{
                  padding: "50px 0px 50px 0px",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  borderRadius: 5,
                  maxWidth: 400,
                  margin: "auto"
                }}
              >
                <div style={{ padding: "0px 20px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <div
                        style={{
                          fontSize: 32,
                          color: "rgba(255, 255, 255, 1)",
                          transform: "skew(-20deg)" /* SKEW */,
                          backgroundColor: "rgba(33, 58, 73, 1)",
                          display: "inline-block",
                          padding: "5px 20px",
                          borderRadius: 3,
                          marginBottom: 20
                        }}
                      >
                        <div
                          style={{
                            display: "inline-block",
                            transition: "background 0.2s",
                            transform: "skew(20deg)" /* SKEW */
                          }}
                        >
                          newsbie
                        </div>
                      </div>

                      <div
                        style={{
                          color: "rgba(33, 58, 73, 1)",
                          marginTop: 10,
                          display: "inline-block",
                          fontSize: 20,
                          textAlign: "center"
                        }}
                      >
                        the balanced, efficient way <br />to follow the news
                      </div>
                    </div>
                    <h3
                      style={{
                        textAlign: "center",
                        lineHeight: 1.3,
                        color: "rgba(33, 58, 73, 1)"
                      }}
                    >
                      <span style={{ color: "rgba(33, 58, 73, 0.9)" }}>
                        Join our mailing list for updates on the
                      </span>{" "}
                      <span style={{ fontWeight: "bold" }}>
                        upcoming app + free early access
                      </span>
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        marginTop: 10
                      }}
                    >
                      <input
                        type="email"
                        value={this.state.email}
                        name="EMAIL"
                        className="email emailSignUpInput"
                        id="mce-EMAIL"
                        placeholder="jsnow44@winterfell.gov"
                        required
                        style={{
                          padding: "5px 15px",
                          height: 30,
                          borderRadius: 3,
                          fontSize: 16,
                          width: 250
                          // marginRight: 5
                        }}
                        onChange={e => this.setState({ email: e.target.value })}
                      />
                      <div
                        style={{ position: "absolute", left: -5000 }}
                        aria-hidden="true"
                      >
                        <input
                          type="text"
                          name="b_bbab41b4faa898c5bb1f4c2e1_75f26540d8"
                          tabIndex="-1"
                          value=""
                        />
                      </div>

                      <button
                        type="submit"
                        // name="subscribe"
                        // id="mc-embedded-subscribe"
                        className="button emailSignUpButton cta"
                        style={{
                          height: 40,
                          fontSize: 14,
                          padding: "5px 15px",
                          marginTop: 10,
                          backgroundColor: "rgba(33, 58, 73, 0.9)",
                          color: "rgba(255, 255, 255, 1)",
                          border: "1px solid rgba(33, 58, 73, 0.9)",
                          borderRadius: 3,
                          width: 250,
                          cursor: "pointer",
                          fontWeight: "bold"
                        }}
                        onClick={() => {
                          subscribe({ EMAIL: this.state.email });
                        }}
                      >
                        {!status && "Sign Up"}
                        {status === "sending" && "Sending..."}
                        {status === "success" && "You're signed up!"}
                        {status === "error" && "Error :("}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        />
      );
    };

    return (
      <div style={{ backgroundColor: "rgba(33, 58, 73, 1)" }}>
        <div
          className="main"
          style={{
            maxWidth: "100%",
            overflowX: "hidden",
            paddingTop: 50,
            margin: "0px 10px 0px 10px"
          }}
        >
          <div
            style={{
              maxWidth: 600,
              margin: "auto",
              marginTop: 100,
              padding: "0px 20px"
            }}
          >
            <h2
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                textAlign: "center",
                fontWeight: 400,
                lineHeight: 1.4,
                letterSpacing: "0.03em"
              }}
            >
              Want a <strong>balanced, efficient</strong> way to read the news?
            </h2>
            {this.state.batch ? (
              <h5
                style={{
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.4)",
                  letterSpacing: "0.03em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Icon
                  style={{
                    marginRight: 5,
                    color: "rgba(255, 255, 255, 0.3)"
                  }}
                  icon={androidTime}
                  size={20}
                />{" "}
                updated{" "}
                <span style={{ fontWeight: "bold", marginLeft: 3 }}>
                  <TimeAgo date={this.state.batch.created_at} />
                </span>
              </h5>
            ) : (
              ""
            )}
            <h1
              style={{
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.3)"
              }}
            >
              &darr;
            </h1>
          </div>
          <SectionTitle num={1} title={"Browse front pages of news sites"} />

          <SwipeHelp />
          <FrontPages
            touchOnly={touchOnly}
            imageWidth={imageWidth}
            showSlider={showSlider}
            records={this.state.records}
            sites={this.state.sites}
            screenWidth={screenWidth}
          />

          <SectionTitle num={2} title={"Catch up on buzzwords"}>
            {/*{this.state.opinionArticles.length*/}
            {/*? `Explore the most common words and phrases found in ${*/}
            {/*this.state.opinionArticles.length &&*/}
            {/*this.state.politicsArticles.length*/}
            {/*? this.state.opinionArticles.length +*/}
            {/*this.state.politicsArticles.length*/}
            {/*: ""*/}
            {/*} recent article titles ${*/}
            {/*this.state.sites.length ? "from" : ""*/}
            {/*} ${*/}
            {/*this.state.sites.length ? this.state.sites.length : ""*/}
            {/*}${this.state.sites.length ? " sources" : ""}. `*/}
            {/*: ""}*/}
            Click a buzzword to dive deeper on Wikipedia
          </SectionTitle>

          <Tags />

          <SectionTitle num={3} title={"Skim news articles"} />
          {/*Now start skimming articles.*/}
          {/*<div style={{ marginTop: 10 }}>*/}
          {/*Click and read some from a variety of news sites.*/}
          {/*</div>*/}
          {/*<div style={{ marginTop: 10 }}>*/}
          {/*By consulting multiple sources, you're able to filter out the*/}
          {/*noise - and{" "}*/}
          {/*<strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>*/}
          {/*get a clearer picture of what's really going on.*/}
          {/*</strong>*/}
          {/*</div>*/}
          {/*</SectionTitle>*/}
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

          <SectionTitle num={4} title={"Explore opinion pieces"} />
          {/*Once you've built up a base of facts and observations, you're*/}
          {/*ready to explore more subjective takes on the stories of the day.*/}
          {/*<div style={{ marginTop: 10 }}>*/}
          {/*You'll want to consider a wide range of perspectives - and avoid*/}
          {/*getting stuck in an{" "}*/}
          {/*<a*/}
          {/*target="_blank"*/}
          {/*style={{ color: "rgba(255, 255, 255, 0.7)" }}*/}
          {/*href="https://en.wikipedia.org/wiki/Echo_chamber_(media)"*/}
          {/*>*/}
          {/*echo chamber.*/}
          {/*</a>*/}
          {/*</div>*/}
          {/*</SectionTitle>*/}
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

          <SectionTitle num={5} title={"Graduate to News Junkie"} />
          {/*You have a good feel for the news and how to navigate it, but now*/}
          {/*you may want to supercharge the way you stay informed.*/}
          {/*</SectionTitle>*/}

          {renderSignUp()}

          <div
            style={{
              padding: "50px 0px 0px 0px",
              letterSpacing: "0.03em",
              lineHeight: 1.3,
              fontWeight: "bold",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: 300
            }}
          >
            <h3
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textAlign: "center",
                padding: "0px 20px",
                letterSpacing: "0.03em",
                lineHeight: 1.3,
                fontWeight: "bold",
                width: "100%",
                marginBottom: 30
              }}
            >
              Want to learn more about <br />the Newsbie app-in-progress?
            </h3>
            <Link
              to={"/"}
              style={{
                height: 45,
                fontSize: 16,
                padding: "0px 20px",
                width: 200,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 5,
                color: "rgba(33, 58, 73, 0.9)",
                textDecoration: "none",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
