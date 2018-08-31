import React, { Component } from "react";
import axios from "axios/index";
import shuffle from "shuffle-array";
import SingleFrontPage from "../SingleFrontPage";
import TimeAgo from "react-timeago";
import moment from "moment";
import { androidTime } from "react-icons-kit/ionicons/androidTime";
import { Icon } from "react-icons-kit";
import Loader from "../../components/Loader";

export default class FrontPageSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      batches: [],
      screenWidth: 0,
      sites: [],
      siteFilter: null,
      timeFilter: null
    };
  }

  componentDidMount() {
    this.updateDimensions();
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

    axios
      .get(`https://birds-eye-news-api.herokuapp.com/search_front_pages`, {
        Accept: "application/json"
      })
      .then(response => {
        let sortedSites = response.data.sites
          .filter(site => {
            return (
              site.name !== "bloomberg" && site.name !== "thewashingtonpost"
            );
          })
          .sort((a, b) => {
            if (a.title.replace("The ", "") > b.title.replace("The ", "")) {
              return 1;
            } else if (
              b.title.replace("The ", "") > a.title.replace("The ", "")
            ) {
              return -1;
            } else {
              return 0;
            }
          });

        this.setState({
          sites: sortedSites,
          batches: response.data.batches
        });
      })
      .catch(error => {
        console.log("ERROR", error);
        this.setState({ showError: true });
      });

    window.addEventListener(
      "resize",
      this.throttle(this.updateDimensions.bind(this), 200)
    );
  }

  updateDimensions() {
    let screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    // let update_height = Math.round(update_width)

    this.setState({ screenWidth: screenWidth, screenHeight: screenHeight });
  }

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
    const { screenWidth, timeFilter } = this.state;
    let currentSiteFilter = this.state.siteFilter
      ? this.state.siteFilter.name
      : null;

    // let frontPages = shuffle(this.state.records);
    let frontPages = this.state.records;

    if (currentSiteFilter && timeFilter) {
      let ts = Math.round(new Date().getTime() / 1000);
      let tsYesterday = ts - (timeFilter + 1) * 3600;
      let filteredBatches = this.state.batches.filter(batch => {
        return batch.id >= tsYesterday * 1000;
      });
      frontPages = filteredBatches
        .filter((batch, i) => {
          return i === 0 || i % 4 === 0;
        })
        .map(batch => {
          return {
            id: batch.id,
            batch: batch.id,
            site: this.state.siteFilter,
            image: `${currentSiteFilter}/${currentSiteFilter}_${batch.id}`
          };
        })
        .sort((a, b) => {
          if (a.id > b.id) {
            return 1;
          } else if (b.id > a.id) {
            return -1;
          } else {
            return 0;
          }
        });
    } else if (currentSiteFilter) {
      frontPages = this.state.batches
        .filter((batch, i) => {
          return i === 0 || i % 4 === 0;
        })
        .map(batch => {
          return {
            id: batch.id,
            batch: batch.id,
            site: this.state.siteFilter,
            image: `${currentSiteFilter}/${currentSiteFilter}_${batch.id}`
          };
        });
    } else {
      if (timeFilter) {
        let ts = Math.round(new Date().getTime() / 1000);
        let targetTime = (ts - timeFilter * 3600) * 1000;
        let currentBatch = this.state.batches[0],
          smallestDiff = targetTime;

        for (let batch of this.state.batches) {
          let diff = targetTime - batch.id;
          if (diff < 0) {
            continue;
          } else {
            if (diff < smallestDiff) {
              smallestDiff = diff;
              currentBatch = batch;
              // console.log(currentBatch);
            } else {
              continue;
            }
          }
        }

        frontPages = this.state.sites.map(site => {
          return {
            id: site.name,
            batch: currentBatch.id,
            site: site,
            image: `${site.name}/${site.name}_${currentBatch.id}`
          };
        });

        // frontPages = shuffle(frontPages);
      }
    }

    const siteItem = site => {
      let isCurrent = currentSiteFilter === site.name;
      return (
        <div
          key={site.name}
          onClick={() => this.setState({ siteFilter: site })}
          className={"hoverBtn singleTag"}
          style={{
            fontSize: 12,
            borderRadius: 3,
            margin: "3px 3px",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 12px",
            display: "inline-block",
            transition: "background 0.2s",
            backgroundColor: currentSiteFilter && !isCurrent ? "#fafafa" : "",
            boxShadow:
              currentSiteFilter && !isCurrent
                ? ""
                : "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)"
          }}
        >
          {site.title}
        </div>
      );
    };

    const renderBatch = () => {
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {frontPages.map((record, i) => {
            return (
              <div key={i} style={{ margin: "15px 15px" }}>
                {currentSiteFilter ? (
                  <div
                    style={{
                      color: "rgba(0,0,0,0.6)",
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "center",
                      fontSize: 12
                    }}
                  >
                    <span style={{ fontSize: 10 }}>
                      {moment(record.id).format("MMM DD, YYYY H:mm Z")}
                    </span>
                    <TimeAgo date={new Date(record.batch)} />
                  </div>
                ) : null}
                <SingleFrontPage
                  key={i}
                  imageWidth={Math.min(screenWidth - 40, 400)}
                  record={record}
                  noLink
                />
              </div>
            );
          })}
        </div>
      );
    };

    if (this.state.sites.length < 1 && this.state.records.length < 1) {
      return (
        <div>
          <Loader
            loaderHeight={"100vh"}
            loadingMessage={"Loading front pages..."}
          />
        </div>
      );
    } else {
      return (
        <div
          style={{
            padding: "50px 0px 0px 0px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
            // flexWrap: "wrap"
          }}
        >
          <div
            style={{
              padding: "20px 0px 20px 0px",
              maxWidth: 600,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start"
              // flexWrap: "wrap"
            }}
          >
            <div
              style={{
                margin: "5px 10px 10px 20px",
                display: "flex",
                width: 300,
                backgroundColor: "#fff",
                color: "rgba(0,0,0,0.8)",
                // padding: "5px 10px",
                justifyContent: "space-between",
                borderRadius: 5,
                fontSize: 12,
                // border: "1px solid rgba(0,0,0,0.2)",
                cursor: "pointer"
              }}
            >
              <div
                onClick={() => this.setState({ timeFilter: null })}
                style={{
                  textAlign: "center",
                  padding: 5,
                  flex: 0.33,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  backgroundColor: !timeFilter ? "rgba(0,0,0,0.8)" : "",
                  color: !timeFilter ? "rgba(255,255,255,1)" : "",
                  border: "1px solid rgba(0,0,0,0.2)"
                }}
              >
                recent
              </div>
              <div
                onClick={() => this.setState({ timeFilter: 12 })}
                style={{
                  textAlign: "center",
                  padding: 5,
                  flex: 0.33,
                  backgroundColor: timeFilter === 12 ? "rgba(0,0,0,0.8)" : "",
                  color: timeFilter === 12 ? "rgba(255,255,255,1)" : "",
                  border: "1px solid rgba(0,0,0,0.2)"
                }}
              >
                12 hours ago
              </div>
              <div
                onClick={() => this.setState({ timeFilter: 24 })}
                style={{
                  textAlign: "center",
                  padding: 5,
                  flex: 0.33,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  backgroundColor: timeFilter === 24 ? "rgba(0,0,0,0.8)" : "",
                  color: timeFilter === 24 ? "rgba(255,255,255,1)" : "",
                  border: "1px solid rgba(0,0,0,0.2)"
                }}
              >
                24 hours ago
              </div>
            </div>
            <div
              style={{ display: "flex", flexWrap: "wrap", padding: "0px 20px" }}
            >
              {this.state.sites.map(site => {
                return siteItem(site);
              })}
              {this.state.siteFilter ? (
                <div
                  onClick={() => this.setState({ siteFilter: null })}
                  style={{
                    padding: "3px 6px",
                    color: "rgba(0,0,0,1)",
                    fontSize: 10,
                    borderRadius: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "1px solid #f2f2f2",
                    height: 20,
                    marginTop: 3,
                    marginLeft: 5,
                    backgroundColor: "#fcfcfc"
                  }}
                >
                  <span style={{ transform: "rotate(45deg)", marginRight: 3 }}>
                    +
                  </span>Clear Filter
                </div>
              ) : null}
            </div>
          </div>

          {!currentSiteFilter && this.state.batch ? (
            <div
              style={{
                color: "rgba(0,0,0,0.6)",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                width: 300,
                alignItems: "center",
                textAlign: "center",
                fontSize: 14
              }}
            >
              {/*<span style={{ fontSize: 10 }}>*/}
              {/*{moment(this.state.batch.id).format("MMM DD, YYYY H:mm Z")}*/}
              {/*</span>*/}
              <Icon
                style={{
                  marginRight: 5,
                  color: "rgba(0, 0, 0, 0.6)"
                }}
                icon={androidTime}
                size={14}
              />{" "}
              <TimeAgo date={new Date(frontPages[0].batch)} />
            </div>
          ) : null}
          {renderBatch()}
        </div>
      );
    }
  }
}
