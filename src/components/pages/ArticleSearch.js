import React, { Component } from "react";
import axios from "axios/index";
import shuffle from "shuffle-array";
import TagCloud from "../TagCloud";
import ReactGA from "react-ga";
import detectIt from "detect-it";
import Article from "../Article";
import { Icon } from "react-icons-kit";
import { ic_search } from "react-icons-kit/md/ic_search";
import { iosCalendarOutline } from "react-icons-kit/ionicons/iosCalendarOutline";
import DatePicker from "react-datetime";
import "../../../node_modules/react-datetime/css/react-datetime.css";
import moment from "moment";
import TimeAgo from "react-timeago";
import { XmlEntities } from "html-entities";
import Loader from "../../components/Loader";

export default class ArticleSearch extends Component {
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
      touchOnly: detectIt.deviceType === "touchOnly",

      allArticles: [],
      articles: [],
      currentTagFilter: null,
      searchInput: "",
      startDate: null,
      endDate: moment(),
      typeFilter: null
    };

    this.entities = new XmlEntities();
  }

  componentDidMount() {
    this.updateDimensions();

    if (!this.props.isSingleSource) {
      /*
	 * Recent Tags
	 * */
      axios
        .get("https://birds-eye-news-api.herokuapp.com/recent_tags")
        .then(res => {
          this.setState({
            batchOfTags: res.data.batches[0],
            allTagBatches: res.data.batches,
            topTags: res.data.topTags
          });
        })
        .catch(err => console.log(err));

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

          let shuffledCombined = shuffle([
            ...filteredPolitics,
            ...filteredOpinions
          ]);

          this.setState({
            sites: res.data.sites,
            allArticles: shuffledCombined,
            articles: shuffledCombined.slice(0, 100)
          });
        })
        .catch(err => console.log(err));
    } else {
      this.setState({
        articles: this.props.articles,
        allArticles: this.props.articles,
        topTags: this.props.tags
      });
    }

    // window.addEventListener(
    //   "resize",
    //   this.throttle(this.updateDimensions.bind(this), 200)
    // );

    // google analystics
    this.initReactGA();

    window.addEventListener("touchstart", this.touchStart);
    window.addEventListener("touchmove", this.preventTouch, { passive: false });
  }

  initReactGA() {
    ReactGA.initialize("UA-97014671-5");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  updateDimensions() {
    let screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    // let update_height = Math.round(update_width)

    this.setState({ screenWidth: screenWidth, screenHeight: screenHeight });
  }

  handleUpdateStartDate(startDate) {
    let formattedStart = startDate.format("MM/DD/YYYY");
    let formattedEnd = this.state.endDate.format("MM/DD/YYYY");

    axios
      .get(
        `https://birds-eye-news-api.herokuapp.com/articles?start=${formattedStart}&end=${formattedEnd}`,
        {
          Accept: "application/json"
        }
      )
      .then(res => {
        this.setState({ articles: shuffle(res.data.articles) });
      })
      .catch(err => console.log(err));

    this.setState({
      startDate: startDate,
      currentTagFilter: null,
      searchInput: "",
      typeFilter: null
    });
  }

  handleUpdateEndDate(endDate) {
    let formattedStart = !this.state.startDate
      ? "01/01/1970"
      : this.state.startDate.format("MM/DD/YYYY");
    let formattedEnd = endDate.format("MM/DD/YYYY");

    axios
      .get(
        `https://birds-eye-news-api.herokuapp.com/articles?start=${formattedStart}&end=${formattedEnd}`,
        {
          Accept: "application/json"
        }
      )
      .then(res => {
        this.setState({ articles: shuffle(res.data.articles) });
      })
      .catch(err => console.log(err));

    this.setState({
      endDate: endDate,
      currentTagFilter: null,
      searchInput: "",
      typeFilter: null
    });
  }

  filterArticles(params) {
    this.setState({
      currentTagFilter: params.currentTagFilter,
      searchInput: params.searchInput,
      typeFilter: params.typeFilter
    });

    let articles = this.state.allArticles.filter(article => {
      let matchesTagFilter = params.currentTagFilter
        ? article.title
            .toLowerCase()
            .includes(params.currentTagFilter.term.toLowerCase()) ||
          article.summary
            .toLowerCase()
            .includes(params.currentTagFilter.term.toLowerCase())
        : true;

      let matchesSearchFilter = params.searchInput
        ? article.title
            .toLowerCase()
            .includes(params.searchInput.toLowerCase()) ||
          article.summary
            .toLowerCase()
            .includes(params.searchInput.toLowerCase())
        : true;

      let matchesTypeFilter = params.typeFilter
        ? article.category === params.typeFilter
        : true;
      return matchesTagFilter && matchesSearchFilter && matchesTypeFilter;
    });
    this.setState({ articles: articles.slice(0, 100) });
  }

  render() {
    const {
      currentTagFilter,
      searchInput,
      screenWidth,
      touchOnly,
      typeFilter
    } = this.state;

    const { isSingleSource } = this.props;

    const params = {
      currentTagFilter,
      searchInput,
      typeFilter
    };

    const renderDatePickerInput = (props, openCalendar, closeCalendar) => {
      let displayDate = props.value;
      if (props.value.length < 1) {
        displayDate = "Earlier";
      } else if (moment(props.value).isSame(moment(), "day")) {
        displayDate = "Today";
      } else {
        displayDate = moment(props.value).format("MM/DD/YYYY");
      }
      return (
        <div
          style={{
            borderBottom: "2px solid rgba(0,0,0,1)",
            cursor: "pointer",
            fontSize: 12,
            padding: "0px 10px 2px 10px",
            width: 80,
            textAlign: "center"
          }}
          onClick={() => openCalendar()}
        >
          {displayDate}
        </div>
      );
    };

    if (
      // !this.state.topTags[0] ||
      this.state.sites.length < 1 &&
      !isSingleSource
    ) {
      return (
        <div>
          <Loader
            loaderHeight={"100vh"}
            loadingMessage={"Loading recent articles..."}
          />
        </div>
      );
    }
    return (
      <div
        style={{
          padding: isSingleSource ? "0px" : "50px 0px 0px 0px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: isSingleSource ? "flex-start" : "center",
            width: "100%"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              maxWidth: 600,
              padding: isSingleSource
                ? "10px 0px 0px 0px"
                : "20px 0px 0px 20px",
              flexDirection: "column"
            }}
          >
            <div style={{ margin: "5px 10px 10px 10px" }}>
              <div
                style={{
                  display: "flex",
                  width: 300,
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  color: "rgba(0,0,0,0.4)",
                  padding: "5px 10px"
                }}
              >
                <Icon
                  style={{ margin: "0px 5px" }}
                  icon={ic_search}
                  size={20}
                />
                <input
                  type={"text"}
                  placeholder={"search articles"}
                  onChange={e =>
                    this.filterArticles({
                      ...params,
                      ...{ searchInput: e.target.value }
                    })
                  }
                  style={{
                    outline: "none",
                    width: 160,
                    fontSize: 14,
                    padding: "5px 10px",
                    border: "none"
                  }}
                />
              </div>
            </div>
            <div
              style={{
                margin: "5px 10px 10px 10px",
                display: "flex",
                width: 300,
                backgroundColor: "#fff",
                color: "rgba(0,0,0,0.8)",
                // padding: "5px 10px",
                justifyContent: "space-between",
                borderRadius: 5,
                fontSize: 14,
                // border: "1px solid rgba(0,0,0,0.2)",
                cursor: "pointer"
              }}
            >
              <div
                onClick={() =>
                  this.filterArticles({
                    ...params,
                    ...{ typeFilter: null }
                  })
                }
                style={{
                  textAlign: "center",
                  padding: 5,
                  flex: 0.33,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  backgroundColor: !typeFilter ? "rgba(0,0,0,0.8)" : "",
                  color: !typeFilter ? "rgba(255,255,255,1)" : "",
                  border: "1px solid rgba(0,0,0,0.2)"
                }}
              >
                All
              </div>
              <div
                onClick={() =>
                  this.filterArticles({
                    ...params,
                    ...{ typeFilter: "politics" }
                  })
                }
                style={{
                  textAlign: "center",
                  padding: 5,
                  flex: 0.34,
                  backgroundColor:
                    typeFilter === "politics" ? "rgba(0,0,0,0.8)" : "",
                  color: typeFilter === "politics" ? "rgba(255,255,255,1)" : "",
                  border: "1px solid rgba(0,0,0,0.2)"
                }}
              >
                News
              </div>
              <div
                onClick={() =>
                  this.filterArticles({
                    ...params,
                    ...{ typeFilter: "opinion" }
                  })
                }
                style={{
                  textAlign: "center",
                  padding: 5,
                  flex: 0.33,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  backgroundColor:
                    typeFilter === "opinion" ? "rgba(0,0,0,0.8)" : "",
                  color: typeFilter === "opinion" ? "rgba(255,255,255,1)" : "",
                  border: "1px solid rgba(0,0,0,0.2)"
                }}
              >
                Opinions
              </div>
            </div>
            <div style={{ padding: "0px 20px 20px 0px" }}>
              <TagCloud
                tags={this.state.topTags}
                isFilter
                onClickTag={tag =>
                  this.filterArticles({
                    ...params,
                    ...{ currentTagFilter: tag }
                  })
                }
                currentTag={currentTagFilter}
              />
            </div>
          </div>
        </div>

        {/* ARTICLES */}
        <div
          style={{
            display: "flex",
            // flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            // width: "100%",
            maxWidth: 600,
            padding: "0px 10px"
            // // justifyContent: "center",
            // // flexDirection: "column",
            // // flexWrap: "wrap",
            // // maxWidth: styles.screenWidth,
            // position: "relative"
          }}
        >
          {this.state.articles.map((article, i) => {
            if (touchOnly) {
              return (
                <Article
                  key={i}
                  index={i}
                  article={article}
                  articleWidth={Math.min(screenWidth - 40, 300)}
                  articleHeight={200}
                  articleMargin={5}
                />
              );
            } else {
              return (
                <a
                  key={i}
                  className={"articleSearchItem"}
                  style={{
                    display: "flex",
                    cursor: "pointer",
                    // flexDirection: "column",
                    alignItems: "stretch",
                    // justifyContent: "center",
                    // height: 100,
                    // width: 150,
                    height: 100,
                    width: "100%",
                    margin: "0px 0px 10px 0px",
                    borderRadius: 5,
                    textDecoration: "none"
                  }}
                  href={
                    article
                      ? article.link || article.guid
                        ? article.link.includes("rss")
                          ? article.guid.replace(/^http:\/\//i, "https://")
                          : article.link.replace(/^http:\/\//i, "https://")
                        : null
                      : null
                  }
                  rel="noreferrer"
                >
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 100,
                      width: 150,
                      backgroundColor: "#fff",
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      position: "relative",
                      backgroundImage: `url(${
                        article
                          ? article.image
                            ? article.image.url
                              ? article.image.url.replace(
                                  /^http:\/\//i,
                                  "https://"
                                )
                              : "https://res.cloudinary.com/ryanjyost/image/upload/v1530579641/newsbie-logo-large.png"
                            : "https://res.cloudinary.com/ryanjyost/image/upload/v1530579641/newsbie-logo-large.png"
                          : ""
                      })`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center"
                    }}
                  />
                  <div
                    className={"article"}
                    style={{
                      height: "100%",
                      width: "100%",
                      position: "relative",
                      color: "rgba(255, 255, 255, 0.95)",
                      backgroundColor: "#fff",
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5
                    }}
                  >
                    <div
                      style={{
                        padding: "15px"
                      }}
                    >
                      <h3
                        style={{
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          color: "rgba(0, 0, 0, 0.8)",
                          lineHeight: 1.3,
                          letterSpacing: "0.01em",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          fontWeight: 600,
                          fontSize: 18,
                          margin: 0
                        }}
                      >
                        {this.entities.decode(article.title)}
                      </h3>
                      <h5
                        className={"noTextDecoration"}
                        style={{
                          padding: "5px 0px 0px 0px",
                          margin: 0,
                          fontWeight: 400,
                          color: "rgba(0, 0, 0, 0.5)",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        {/*<h3*/}
                        {/*className={"noTextDecoration"}*/}
                        {/*style={{*/}
                        {/*display: "block",*/}
                        {/*textAlign: "right",*/}
                        {/*padding: "20px 20px",*/}
                        {/*fontSize: 12,*/}
                        {/*color: "rgba(255, 255, 255, 0.8)",*/}
                        {/*textDecoration: "none",*/}
                        {/*// position: "absolute",*/}
                        {/*// top: 0,*/}
                        {/*// right: 0,*/}
                        {/*margin: 0*/}
                        {/*}}*/}
                        {/*>*/}
                        {article.site.title}
                        <div style={{ margin: "0px 5px" }}>&#183;</div>
                        {/*</h3>*/}
                        <TimeAgo
                          date={
                            article.date ? article.date : article.created_at
                          }
                        />
                      </h5>
                    </div>
                  </div>
                </a>
              );
            }
          })}
        </div>
      </div>
    );
  }
}

{
  /*<div*/
}
{
  /*style={{*/
}
{
  /*margin: "5px 10px",*/
}
{
  /*display: "flex",*/
}
{
  /*alignItems: "center"*/
}
{
  /*}}*/
}
{
  /*>*/
}
{
  /*<Icon*/
}
{
  /*style={{ margin: "0px 10px 0px 0px", color: "rgba(0,0,0,0.5)" }}*/
}
{
  /*icon={iosCalendarOutline}*/
}
{
  /*size={24}*/
}
{
  /*/>*/
}
{
  /*<DatePicker*/
}
{
  /*value={this.state.startDate}*/
}
{
  /*closeOnSelect*/
}
{
  /*onChange={e => {*/
}
{
  /*this.handleUpdateStartDate(e);*/
}
{
  /*}}*/
}
{
  /*renderInput={(props, openCalendar, closeCalendar) =>*/
}
{
  /*renderDatePickerInput(*/
}
{
  /*props,*/
}
{
  /*openCalendar,*/
}
{
  /*closeCalendar,*/
}
{
  /*"startDate"*/
}
{
  /*)*/
}
{
  /*}*/
}
{
  /*/>*/
}
{
  /*<div style={{ margin: "0px 10px", color: "rgba(0,0,0,0.3)" }}>*/
}
{
  /*to*/
}
{
  /*</div>*/
}
{
  /*<DatePicker*/
}
{
  /*value={this.state.endDate}*/
}
{
  /*closeOnSelect*/
}
{
  /*onChange={e => {*/
}
{
  /*this.handleUpdateEndDate(e);*/
}
{
  /*}}*/
}
{
  /*renderInput={(props, openCalendar, closeCalendar) =>*/
}
{
  /*renderDatePickerInput(*/
}
{
  /*props,*/
}
{
  /*openCalendar,*/
}
{
  /*closeCalendar,*/
}
{
  /*"endDate"*/
}
{
  /*)*/
}
{
  /*}*/
}
{
  /*isValidDate={(currentDate, selectedDate) => {*/
}
{
  /*return currentDate.isBefore(moment());*/
}
{
  /*}}*/
}
{
  /*/>*/
}
{
  /*</div>*/
}
