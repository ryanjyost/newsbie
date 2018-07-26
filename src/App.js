import React, { Component } from "react";
import shuffle from "shuffle-array";
import "./App.css";
import axios from "axios";
import TwitterLogin from "react-twitter-auth";
import $ from "jquery";
import { Icon } from "react-icons-kit";
import Site from "./components/Site";
import Article from "./components/Article";

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
      .get("http://localhost:8000/today")
      .then(res => {
        let currentNews = shuffle(res.data.politicsArticles).slice(0, 10);
        let currentOpinions = shuffle(res.data.opinionArticles).slice(0, 10);

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

    $.ajax({
      type: "POST",
      url:
        "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=trump&prop=info&inprop=url&utf8=&format=json",
      dataType: "jsonp",
      contentType: "application/x-www-form-urlencoded",
      crossDomain: true,
      success: function(data) {
        console.log("Data", data);
      },
      error: function(jqXhr, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });

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
    let imageWidth = Math.min(screenWidth, 500);

    let articleWidth = 300;
    let articleMargin = 10;

    const FrontPages = () => {
      return (
        <div
          className={"horzRow"}
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            height: imageWidth,
            overflowX: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderTop: "2px solid rgba(255, 255, 255, 0.05)",
            padding: "20px 0px"
          }}
        >
          {this.state.records.length
            ? this.state.records.map((record, i) => {
                return (
                  <Site
                    key={i}
                    index={i}
                    record={record}
                    siteMargin={30}
                    imageWidth={imageWidth - 50}
                  />
                );
              })
            : this.state.sites.map((site, i) => {
                return (
                  <Site
                    key={i}
                    index={i}
                    record={null}
                    siteMargin={30}
                    imageWidth={imageWidth - 50}
                  />
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
              return (
                <div
                  key={i}
                  style={{
                    border: "1px solid #d8d8d8",
                    fontSize: "18px",
                    margin: "5px 5px",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "3px 5px",
                    backgroundColor: "rgba(255,255,255,0.9)"
                    // flex: "1 1 80px"
                  }}
                >
                  {tag.term}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const News = () => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            height: articleWidth,
            overflowX: "auto",
            backgroundColor: "#fafafa"
          }}
        >
          {this.state.currentNews.length
            ? this.state.currentNews.map((article, i) => {
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
            : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((article, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      height: articleWidth,
                      width: articleWidth,
                      backgroundColor: "red",
                      margin: articleMargin
                    }}
                  />
                );
              })}
        </div>
      );
    };

    return (
      <div className="main" style={{ maxWidth: "100%", overflowX: "hidden" }}>
        <h4 style={{ textAlign: "center" }}>Front Pages</h4>
        <FrontPages />

        <h4 style={{ textAlign: "center" }}>
          Here are the most common words and phrases
        </h4>
        <Tags />

        <h4 style={{ textAlign: "center" }}>
          Here are recent news articles, shuffled and ready to peruse.
        </h4>
        <News />

        <h4 style={{ textAlign: "center" }}>
          Here are recent opinion pieces, shuffled and ready to peruse.
        </h4>
        <div
          style={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {this.state.currentOpinions.map((article, i) => {
            return <div key={i}>{article.title}</div>;
          })}
        </div>
      </div>
    );
  }
}

export default App;
