import React, { Component } from "react";
import axios from "axios/index";
import shuffle from "shuffle-array";
import moment from "moment";
import { sortedSources as sources, mappedSourceToImage } from "../../sources";

import Article from "../articles/Article";

import Loader from "../../components/Loader";
import { Input, Radio, Button, Icon, Collapse, Drawer } from "antd";
import { throttle } from "../../helpers/util";

const Search = Input.Search;

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
      extraArticles: [],
      currentTagFilter: null,
      searchInput: "",
      typeFilter: "all",
      sourceFilter: null,
      hideImages: false,
      sort: "newest",
      isFiltering: false,
      openPanel: "0",
      drawerOpen: false
    };
  }

  componentDidMount() {
    this.setState({ mappedImages: mappedSourceToImage() });
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
            allArticles: articles
          });

          this.paginateArticles(articles);
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

  paginateArticles(articles) {
    this.setState({
      articles: articles.slice(0, 30)
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
      case "shuffle":
        sorted = shuffle(articles);
        break;
      default:
        break;
    }

    this.paginateArticles(articles);
  }

  render() {
    const {
      currentTagFilter,
      searchInput,
      touchOnly,
      typeFilter,
      sourceFilter,
      mappedImages
    } = this.state;

    const { styles, isSingleSource } = this.props;

    let isSmall = styles.screenWidth < 900;

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
            onChange={e => {
              throttle(
                this.filterArticles({
                  ...params,
                  ...{ searchInput: e.target.value }
                }),
                200
              );
            }}
            style={{ width: 200 }}
          />
        </div>
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
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <div style={{ marginRight: 5, color: "rgba(0,0,0,0.5)" }}>
            Sort By
          </div>
          <Radio.Group
            style={{ margin: "5px 10px 10px 0px" }}
            value={this.state.sort}
            onChange={e => {
              this.sortArticles(e.target.value);
            }}
          >
            <Radio.Button style={{ fontWeight: "400" }} value={"newest"}>
              newest
            </Radio.Button>
            <Radio.Button style={{ fontWeight: "400" }} value="shuffle">
              shuffle
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 0px"
            }}
          >
            <h6
              style={{
                color: "rgba(0,0,0,0.5)",
                margin: 0,
                marginRight: 5
              }}
            >
              search most common terms
            </h6>
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
        </div>
      );
    };

    const renderSourceFilter = () => {
      return (
        <div style={{ padding: "0px 20px 100px 0px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 0px"
            }}
          >
            <h6
              style={{
                color: "rgba(0,0,0,0.5)",
                margin: 0,
                marginRight: 5
              }}
            >
              filter by source
            </h6>
            {sourceFilter ? (
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
          {renderSourceFilter()}
        </div>
      );
    };

    const renderNoArticles = () => {
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            paddingTop: 50,
            textAlign: "center"
          }}
        >
          <Icon
            type="frown"
            theme="outlined"
            style={{ fontSize: 30, marginBottom: 10 }}
          />
          <h5 style={{ maxWidth: 200 }}>
            We don't have anything that matches your search.
          </h5>
        </div>
      );
    };

    const renderHelperText = () => {
      let sortText = "";
      switch (this.state.sort) {
        case "oldest":
          sortText = <span>old &rarr; new</span>;
          break;
        case "newest":
          sortText = <span>new &rarr; old</span>;
          break;
        case "shuffle":
          sortText = <span>shuffled</span>;
          break;
      }

      let typeText = "";
      switch (typeFilter) {
        case "politics":
          typeText = "news";
          break;
        case "opinion":
          typeText = "opinion";
          break;
        default:
          break;
      }
      return (
        <div
          style={{
            position: "absolute",
            top: 90,
            fontSize: 13,
            left: 20,
            maxWidth: 250,
            width: "100%"
          }}
        >
          <strong>{sortText}</strong> <strong>{typeText}</strong>
          <span>&nbsp;articles&nbsp;</span>
          {sourceFilter ? (
            <span>
              from <strong>{sourceFilter.title}</strong>
            </span>
          ) : null}
          {currentTagFilter ? (
            <span>
              &nbsp;that include the term{" "}
              <strong>{currentTagFilter.term}</strong>
            </span>
          ) : null}
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
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div
          style={{
            padding: isSmall ? "60px 20px 0px 20px" : "80px 20px 0px 20px",
            display: "flex",
            justifyContent: isSmall ? "center" : "flex-start",
            alignItems: "flex-start",
            flexWrap: "wrap",
            position: "relative",
            width: "100%",
            maxWidth: 1000
          }}
        >
          {isSmall ? (
            <Button
              onClick={() => this.setState({ drawerOpen: true })}
              style={{
                position: "fixed",
                top: 80,
                right: 10,
                zIndex: 10
              }}
              size="large"
              type="primary"
              shape="circle"
              icon="search"
            />
          ) : null}

          {/* Filter */}
          {isSmall ? (
            <Drawer
              title="Search Articles"
              placement="right"
              closable={true}
              width={Math.min(styles.screenWidth - 50, 500)}
              onClose={() => this.setState({ drawerOpen: false })}
              visible={this.state.drawerOpen}
            >
              {renderAllFilters()}
            </Drawer>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: isSingleSource ? "flex-start" : "center",
                width: "50%",
                maxWidth: 450,
                position: isSmall ? "relative" : "fixed",
                height: "100vh",
                overflow: "auto",
                paddingTop: 20
              }}
            >
              {renderAllFilters()}
            </div>
          )}

          {isSmall && renderHelperText()}
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
            {this.state.articles.length === 0
              ? renderNoArticles()
              : this.state.articles.map((article, i) => {
                  return (
                    <Article
                      key={i}
                      article={article}
                      i={i}
                      isSmall={isSmall}
                      image={mappedImages[article.siteName]}
                      styles={styles}
                    />
                  );
                })}
          </div>
        </div>
      </div>
    );
  }
}
