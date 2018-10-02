import React, { Component } from "react";
import axios from "axios/index";
import shuffle from "shuffle-array";
import detectIt from "detect-it";
import "../../../node_modules/react-datetime/css/react-datetime.css";
import TimeAgo from "react-timeago";
import { XmlEntities } from "html-entities";
import moment from "moment";
import { sortedSources as sources } from "../../sources";

import Loader from "../../components/Loader";
import { Input, Radio, Button, Icon, Collapse } from "antd";
const Search = Input.Search;
const Panel = Collapse.Panel;

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
      sites: [],

      allArticles: [],
      articles: [],
      currentTagFilter: null,
      searchInput: "",
      // startDate: null,
      // endDate: moment(),
      typeFilter: "all",
      sourceFilter: null,
      hideImages: false,
      sort: "newest",
      isFiltering: false,
      openPanel: "0"
    };

    this.entities = new XmlEntities();
  }

  componentDidMount() {
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
        .get("https://birds-eye-news-api.herokuapp.com/recent_articles")
        .then(res => {
          let currentNews = res.data.politicsArticles;

          let filteredPolitics = currentNews.filter(article => {
            return article.site.name.toLowerCase() !== "politico";
          });

          let currentOpinions = res.data.opinionArticles;

          let filteredOpinions = currentOpinions.filter(article => {
            return article.site.name.toLowerCase() !== "cbsnews";
          });

          let combined = [...filteredPolitics, ...filteredOpinions];

          let articles = combined.sort((a, b) => {
            let dateA = a.date ? moment(a.date) : moment(a.created_at);
            let dateB = b.date ? moment(b.date) : moment(b.created_at);
            if (dateA.isAfter(dateB)) {
              return -1;
            } else if (dateA.isBefore(dateB)) {
              return 1;
            } else {
              return 0;
            }
          });

          this.setState({
            sites: res.data.sites,
            allArticles: articles,
            articles: articles.slice(0, 100)
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
    window.scrollTo(0, 0);
    this.setState({
      currentTagFilter: params.currentTagFilter,
      searchInput: params.searchInput,
      typeFilter: params.typeFilter,
      sourceFilter: params.sourceFilter
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

      let matchesTypeFilter =
        params.typeFilter !== "all"
          ? article.category === params.typeFilter
          : true;

      let matchesSourceFilter = params.sourceFilter
        ? article.siteName === params.sourceFilter.name
        : true;

      return (
        matchesTagFilter &&
        matchesSearchFilter &&
        matchesTypeFilter &&
        matchesSourceFilter
      );
    });
    // this.setState({ articles: articles.slice(0, 100) });
    this.sortArticles(this.state.sort, articles);
  }

  hasFilter() {
    return (
      this.state.currentTagFilter ||
      this.state.searchInput !== "" ||
      this.state.typeFilter !== "all" ||
      this.state.sourceFilter
    );
  }

  sortArticles(order, filteredArticles) {
    window.scrollTo(0, 0);
    this.setState({ sort: order });
    let articles = filteredArticles
      ? filteredArticles
      : this.hasFilter()
        ? [...this.state.articles]
        : [...this.state.allArticles];
    let sorted = [];
    switch (order) {
      case "newest":
        sorted = articles.sort((a, b) => {
          let dateA = a.date ? moment(a.date) : moment(a.created_at);
          let dateB = b.date ? moment(b.date) : moment(b.created_at);
          if (dateA.isAfter(dateB)) {
            return -1;
          } else if (dateA.isBefore(dateB)) {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      case "oldest":
        sorted = articles.sort((a, b) => {
          let dateA = a.date ? moment(a.date) : moment(a.created_at);
          let dateB = b.date ? moment(b.date) : moment(b.created_at);
          if (dateB.isAfter(dateA)) {
            return -1;
          } else if (dateB.isBefore(dateA)) {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      case "random":
        sorted = shuffle(articles);
        break;
      default:
        break;
    }

    this.setState({ articles: sorted.slice(0, 100) });
  }

  render() {
    const {
      currentTagFilter,
      searchInput,
      touchOnly,
      typeFilter,
      sourceFilter,
      isFiltering
    } = this.state;

    const { styles } = this.props;

    let isSmall = styles.screenWidth < 800;
    let hideAdvanced;

    const { isSingleSource } = this.props;

    const params = {
      currentTagFilter,
      searchInput,
      typeFilter,
      sourceFilter
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

    const renderSearch = () => {
      return (
        <div style={{ margin: "10px 10px 10px 0px" }}>
          <Search
            placeholder="Search articles"
            onChange={e =>
              this.filterArticles({
                ...params,
                ...{ searchInput: e.target.value }
              })
            }
            style={{ width: 200 }}
          />
        </div>
      );
    };

    const renderArticle = (article, i) => {
      return (
        <a
          key={i}
          target={isSmall ? "" : "_blank"}
          className={"articleSearchItem"}
          style={{
            display: "flex",
            cursor: "pointer",
            // flexDirection: "column",
            alignItems: "stretch",
            // justifyContent: "center",
            // height: 100,
            // width: 150,
            height: 75,
            width: "100%",
            margin: "0px 0px 10px 0px",
            borderRadius: 5,
            textDecoration: "none"
          }}
          href={
            article
              ? article.link || article.guid
                ? article.link.includes("rss") || article.link.includes("feeds")
                  ? article.guid.replace(/^http:\/\//i, "https://")
                  : article.link.replace(/^http:\/\//i, "https://")
                : null
              : null
          }
          rel="noreferrer"
        >
          <div
            className={"article"}
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              position: "relative",
              color: "rgba(255, 255, 255, 0.95)",
              backgroundColor: "#fff",
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              padding: "10px 20px"
            }}
          >
            <h5
              style={{
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                color: "rgba(0, 0, 0, 1)",
                lineHeight: 1.3,
                letterSpacing: "0.01em",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                fontWeight: "normal",
                margin: 0,
                paddingBottom: 2,
                fontSize: isSmall ? 13 : ""
              }}
            >
              {this.entities.decode(article.title)}
            </h5>
            <h6
              className={"noTextDecoration"}
              style={{
                padding: "0px 0px 0px 0px",
                margin: 0,
                marginTop: 5,
                fontWeight: 400,
                color: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                fontSize: isSmall ? 10 : ""
              }}
            >
              {article.site.title}
              <div style={{ margin: "0px 5px" }}>&#183;</div>
              <TimeAgo
                date={article.date ? article.date : article.created_at}
              />
            </h6>
          </div>
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 75,
              width: 100,
              backgroundColor: "#fff",
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              position: "relative",
              backgroundImage: `url(${
                article
                  ? article.image
                    ? article.image.url
                      ? article.image.url.replace(/^http:\/\//i, "https://")
                      : "https://d1dzf0mjm4jp11.cloudfront.net/newsbie-logo.png"
                    : "https://d1dzf0mjm4jp11.cloudfront.net/newsbie-logo.png"
                  : ""
              })`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center"
            }}
          />
        </a>
      );
    };

    const renderFilterTypeButtons = () => {
      return (
        <Radio.Group
          style={{ margin: "10px 10px 10px 0px" }}
          value={this.state.typeFilter}
          onChange={e => {
            this.filterArticles({
              ...params,
              ...{ typeFilter: e.target.value }
            });
          }}
        >
          <Radio.Button style={{ fontWeight: "400" }} value={"all"}>
            all
          </Radio.Button>
          <Radio.Button style={{ fontWeight: "400" }} value="politics">
            news
          </Radio.Button>
          <Radio.Button style={{ fontWeight: "400" }} value="opinion">
            opinions
          </Radio.Button>
        </Radio.Group>
      );
    };

    const renderSortButtons = () => {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: 5, color: "rgba(0,0,0,0.5)" }}>
            Sort By
          </div>
          <Radio.Group
            style={{ margin: "10px 10px 10px 0px" }}
            value={this.state.sort}
            onChange={e => {
              this.sortArticles(e.target.value);
            }}
          >
            <Radio.Button style={{ fontWeight: "400" }} value={"newest"}>
              newest
            </Radio.Button>
            <Radio.Button style={{ fontWeight: "400" }} value="random">
              random
            </Radio.Button>
            <Radio.Button style={{ fontWeight: "400" }} value="oldest">
              oldest
            </Radio.Button>
          </Radio.Group>
        </div>
      );
    };

    const renderTagFilter = () => {
      return (
        <div style={{ padding: "0px 20px 10px 0px" }}>
          <h6 style={{ color: "rgba(0,0,0,0.5)", marginTop: 10 }}>
            search most common words
          </h6>
          {this.state.topTags.slice(0, 20).map((tag, i) => {
            if (tag) {
              let isSelected = currentTagFilter
                ? tag.term === currentTagFilter.term
                : false;
              return (
                <Button
                  key={i}
                  onClick={() =>
                    this.filterArticles({
                      ...params,
                      ...{ currentTagFilter: tag }
                    })
                  }
                  type={"default"}
                  size={"small"}
                  style={{
                    margin: 2,
                    backgroundColor: isSelected
                      ? "rgba(24, 144, 255, 1)"
                      : "#fff",

                    color: !isSelected ? "rgba(0, 0, 0, 0.6)" : "#fff"
                  }}
                >
                  {tag.term}
                </Button>
              );
            } else {
              return null;
            }
          })}
          {this.state.currentTagFilter ? (
            <Button
              onClick={() =>
                this.filterArticles({
                  ...params,
                  ...{ currentTagFilter: null }
                })
              }
              type={"danger"}
              size={"small"}
              style={{ margin: 2, fontSize: 10 }}
            >
              Clear
            </Button>
          ) : null}
        </div>
      );
    };

    const renderSourceFilter = () => {
      return (
        <div style={{ padding: "0px 20px 100px 0px" }}>
          <h6 style={{ color: "rgba(0,0,0,0.5)", marginTop: 10 }}>
            filter by source
          </h6>
          {sources.map((source, i) => {
            if (source) {
              let isSelected = sourceFilter
                ? source.name === sourceFilter.name
                : false;
              return (
                <Button
                  key={i}
                  onClick={() =>
                    this.filterArticles({
                      ...params,
                      ...{ sourceFilter: source }
                    })
                  }
                  type={"default"}
                  size={"small"}
                  style={{
                    margin: 2,
                    backgroundColor: isSelected
                      ? "rgba(24, 144, 255, 1)"
                      : "#fff",

                    color: !isSelected ? "rgba(0, 0, 0, 0.6)" : "#fff"
                  }}
                >
                  {source.title}
                </Button>
              );
            } else {
              return null;
            }
          })}
          {this.state.sourceFilter ? (
            <Button
              onClick={() =>
                this.filterArticles({
                  ...params,
                  ...{ sourceFilter: null }
                })
              }
              type={"danger"}
              size={"small"}
              style={{ margin: 2, fontSize: 10 }}
            >
              Clear
            </Button>
          ) : null}
        </div>
      );
    };

    const renderImageSelection = () => {
      return (
        <Radio.Group
          style={{ margin: "10px 0px 10px 0px" }}
          value={this.state.hideImages ? "true" : "false"}
          onChange={e => {
            this.setState({
              hideImages: e.target.value === "false" ? false : true
            });
          }}
        >
          <Radio.Button style={{ fontWeight: "400" }} value={"false"}>
            <Icon style={{ marginRight: 3 }} type={"picture"} /> images
          </Radio.Button>
          <Radio.Button style={{ fontWeight: "400" }} value="politics">
            <Icon style={{ marginRight: 3 }} type={"bars"} />text Only
          </Radio.Button>
        </Radio.Group>
      );
    };

    const renderAllFilters = () => {
      return (
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center"
            }}
          >
            {!isSmall && renderSearch()}
            {renderFilterTypeButtons()}
            {renderSortButtons()}
            {/*{renderImageSelection()}*/}
          </div>
          {renderTagFilter()}
          {styles.screenWidth > 600 && renderSourceFilter()}
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
          padding: isSmall ? "80px 20px 0px 20px" : "80px 20px 0px 20px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexWrap: "wrap"
        }}
      >
        {/* Filter */}
        {isSmall ? (
          <Collapse
            style={{
              width: "90%",
              marginBottom: 10,
              position: "fixed",
              zIndex: 10
            }}
            activeKey={this.state.openPanel}
            onChange={key =>
              this.setState({
                openPanel: this.state.openPanel === "1" ? "0" : "1"
              })
            }
          >
            <Panel header={`Click to open filter options`} key="1">
              {renderAllFilters()}
            </Panel>
          </Collapse>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: isSingleSource ? "flex-start" : "center",
              width: "50%",
              maxWidth: 450,
              position: isSmall ? "relative" : "fixed",
              height: "100vh",
              overflow: "auto"
            }}
          >
            {renderAllFilters()}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: isSmall ? "100%" : "50%",
            maxWidth: 500,
            marginLeft: !isSmall ? 460 : 0,
            paddingTop: isSmall ? 80 : 0
          }}
        >
          {this.state.articles.map((article, i) => {
            return renderArticle(article, i);
          })}
        </div>
      </div>
    );
  }
}
