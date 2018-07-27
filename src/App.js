import React, { Component } from "react";
import shuffle from "shuffle-array";
import "./App.css";
import axios from "axios";
import TwitterLogin from "react-twitter-auth";
import $ from "jquery";
import { Icon } from "react-icons-kit";
import Site from "./components/Site";
import Article from "./components/Article";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";
import Tag from "./components/Tag";

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
      screenHeight: 0
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

  render() {
    const { screenWidth, screenHeight, records } = this.state;
    let imageWidth = Math.min(screenWidth, 400);

    let articleWidth = 300;
    let articleMargin = 10;

    let isWide = screenWidth > 768;

    const Arrow = ({ direction, handleClick }) => {
      let isLeft = direction === "left";
      return (
        <div
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
          // onClick={() => handleClick()}
        >
          {isLeft ? <span>&lsaquo;</span> : <span>&rsaquo;</span>}
        </div>
      );
    };

    const FrontPages = () => {
      return (
        <div
          className={"horzRow"}
          style={{
            borderRadius: 5,
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            height: imageWidth,
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
                    />

                    <a
                      href={record.site.url}
                      className={"hoverBtn"}
                      style={{
                        textAlign: "left",
                        marginTop: 25,
                        fontWeight: "300",
                        display: "inline-block",
                        textDecoration: "none",
                        marginLeft: 5,
                        padding: "5px 12px",
                        borderRadius: "50px",
                        fontSize: 12,
                        letterSpacing: "0.03em"
                      }}
                    >
                      {record.site.title}
                    </a>
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
              flexWrap: "wrap"
            }}
          >
            {this.state.topTags.map((tag, i) => {
              return <Tag key={i} tag={tag} />;
            })}
          </div>
        </div>
      );
    };

    const ArticleList = ({ list }) => {
      return (
        <div
          style={{
            borderRadius: 5,
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            height: articleWidth,
            overflowX: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
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
            : [null, null, null, null, null, null, null, null, null, null].map(
                (article, i) => {
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
                }
              )}
        </div>
      );
    };

    const SectionTitle = ({ title, description, num }) => {
      return (
        <div
          style={{
            margin: "20px",
            marginTop: 50
            // display: "inline-block",
            // backgroundColor: "rgba(255, 255, 255, 0.3)",
            // boxShadow:
            //   "0 1px 3px rgba(255,255,255,0.08), 0 1px 2px rgba(255,255,255,0.12)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                marginRight: 10,
                height: 40,
                width: 40,
                borderRadius: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: "rgba(255, 255, 255, 0.8)"
              }}
            >
              {num}
            </div>
            <h2
              style={{
                textAlign: "left",
                margin: "0px",
                marginBottom: 4,
                color: "rgba(46, 228, 246, 1)",
                fontWeight: "400",
                letterSpacing: "0.05em"
              }}
            >
              {title}
            </h2>
          </div>
          <div
            style={{
              textAlign: "left",
              margin: "0px",
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: "400",
              letterSpacing: "0.05em",
              fontSize: 14,
              padding: "0px 10px 0px 50px",
              lineHeight: 1.3
            }}
          >
            {description}
          </div>
        </div>
      );
    };

    // TODO WANT MORE? LOOK AT PENNYBOX

    return (
      <div style={{ paddingBottom: "100px" }}>
        <div
          style={{
            height: 50,
            backgroundColor: "rgba(33, 58, 73, 1)",
            borderBottom: "2px solid rgba(255, 255," + " 255, 0.2)",
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
              justifyContent: "space-between"
            }}
          >
            <h3 style={{ color: "rgba(255, 255, 255, 0.8)", marginLeft: 30 }}>
              newsbie<span style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                .io
              </span>
            </h3>
          </div>
          <div
            style={{
              backgroundColor: "rgba(46, 228, 246, 0.6)",
              marginRight: 30,
              padding: "5px 15px",
              fontSize: 14,
              fontWeight: "600",
              color: "#fff",
              borderRadius: 9999
            }}
            className={"cta"}
          >
            {screenWidth > 500 ? "Graduate to News Junkie" : "Sign Up"}
          </div>
        </div>
        <div
          className="main"
          style={{
            maxWidth: "100%",
            overflowX: "hidden",
            margin: "50px 10px 0px 10px"
          }}
        >
          <SectionTitle
            num={1}
            title={"Front Pages"}
            description={
              "Start out with a bird's eye view of a diverse range of news sources. Get a feel for what's being" +
              " covered. "
            }
          />
          <div style={{ position: "relative" }}>
            <Arrow direction={"left"} />
            <FrontPages />
            <Arrow direction={"right"} />
          </div>

          <SectionTitle
            num={2}
            title={"Buzzwords"}
            description={
              this.state.opinionArticles.length
                ? `Explore the most common words and phrases found in ${
                    this.state.opinionArticles.length &&
                    this.state.politicsArticles.length
                      ? this.state.opinionArticles.length +
                        this.state.politicsArticles.length
                      : ""
                  } recent article titles ${
                    this.state.sites.length ? "from" : ""
                  } ${this.state.sites.length ? this.state.sites.length : ""}${
                    this.state.sites.length ? " sources" : ""
                  }. ${isWide ? "Hover" : "Click"} to learn more.`
                : ""
            }
          />
          <Tags />

          <SectionTitle num={3} title={"News Articles"} description={""} />
          <div style={{ position: "relative" }}>
            <Arrow direction={"left"} />
            <ArticleList list={this.state.currentNews} />
            <Arrow direction={"right"} />
          </div>

          <SectionTitle num={4} title={"Opinion Pieces"} description={""} />
          <div style={{ position: "relative" }}>
            <Arrow direction={"left"} />
            <ArticleList list={this.state.currentOpinions} />
            <Arrow direction={"right"} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
