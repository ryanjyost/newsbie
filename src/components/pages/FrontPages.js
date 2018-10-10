import React, { Component } from "react";
import axios from "axios/index";
import shuffle from "shuffle-array";
import SingleFrontPage from "../front_pages/SingleFrontPage";
import Loader from "../Loader";
import { Input, Radio, Button, Icon, Drawer, Slider, InputNumber } from "antd";
import { sourcesForFrontPages as sources } from "../../sources";
import TimeAgo from "react-timeago";
import moment from "moment";

export default class FrontPages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batches: [],
      visibleList: [],
      //filters
      sourceFilter: null,
      timeFilter: 0, // hours
      timeSort: "newest",
      sourceSort: "az"
    };
  }

  componentDidMount() {
    axios
      .get(`https://birds-eye-news-api.herokuapp.com/search_front_pages`, {
        Accept: "application/json"
      })
      .then(response => {
        let visibleList = this.addSourceToBatch(response.data.batches[0]);

        this.setState({
          batches: response.data.batches,
          visibleList
        });
      })
      .catch(error => {
        console.log("ERROR", error);
        this.setState({ showError: true });
      });
  }

  addSourceToBatch(batch) {
    return sources.map(source => {
      return {
        ...batch,
        ...{
          site: source,
          batch: batch.id,
          image: `${source.name}/${source.name}_${batch.id}`
        }
      };
    });
  }

  filter(params) {
    window.scrollTo(0, 0);
    this.setState({
      sourceFilter: params.sourceFilter,
      timeFilter: params.timeFilter,
      sourceSort: params.sourceSort,
      timeSort: params.timeSort
    });

    const { sourceFilter, timeFilter } = params;
    let frontPages = [];

    if (!sourceFilter) {
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

      frontPages = this.addSourceToBatch(currentBatch);
    } else {
      frontPages = this.state.batches
        .filter((batch, i) => {
          return i === 0 || i % (4 * 12) === 0;
        })
        .map(batch => {
          return {
            id: batch.id,
            created_at: batch.created_at,
            batch: batch.id,
            site: this.state.sourceFilter,
            image: `${sourceFilter.name}/${sourceFilter.name}_${batch.id}`
          };
        })
        .slice(0, 50);
    }

    this.sort(frontPages, sourceFilter);
  }

  sort(frontPages, sourceFilter, sortKey, paramOrder) {
    let order = sortKey
      ? paramOrder
      : sourceFilter
        ? this.state.timeSort
        : this.state.sourceSort;

    if (sortKey) {
      window.scrollTo(0, 0);
      this.setState({ [sortKey]: paramOrder });
    }

    if (order === "newest" || order === "oldest") {
      this.setState({ timeSort: order });
      let isNewest = order === "newest";

      let sortedList = frontPages.sort((a, b) => {
        let momentA = moment(a.created_at);
        let momentB = moment(b.created_at);

        if (momentA.isAfter(momentB)) {
          return isNewest ? -1 : 1;
        } else if (momentB.isAfter(momentA)) {
          return isNewest ? 1 : -1;
        } else {
          return 0;
        }
      });
      this.setState({ visibleList: sortedList });
    } else {
      if (order === "shuffle") {
        this.setState({ visibleList: shuffle(frontPages) });
      } else {
        let az = order === "az";
        frontPages.sort((a, b) => {
          if (
            a.site.title.replace("The ", "") > b.site.title.replace("The ", "")
          ) {
            return az ? 1 : -1;
          } else if (
            b.site.title.replace("The ", "") > a.site.title.replace("The ", "")
          ) {
            return az ? -1 : 1;
          } else {
            return 0;
          }
        });
      }
      this.setState({ visibleList: frontPages });
    }
  }

  render() {
    const {
      visibleList,
      sourceFilter,
      timeFilter,
      sourceSort,
      timeSort
    } = this.state;
    const { styles } = this.props;

    let isSmall = styles.screenWidth < 900;

    const params = {
      sourceFilter,
      timeFilter,
      sourceSort,
      timeSort
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
            {this.state.sourceFilter ? (
              <Button
                onClick={() =>
                  this.filter({
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
                  onClick={() =>
                    this.filter({
                      ...params,
                      ...{ sourceFilter: source }
                    })
                  }
                  key={i}
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

    const renderTimeFilter = () => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            padding: "0px 5px"
          }}
        >
          <Slider
            min={0}
            max={7}
            onChange={val =>
              this.filter({
                ...params,
                ...{ timeFilter: val * 24 }
              })
            }
            style={{ width: 200 }}
            value={typeof timeFilter === "number" ? timeFilter / 24 : 0}
            disabled={sourceFilter !== null}
          />
          <InputNumber
            min={0}
            max={7}
            disabled={sourceFilter !== null}
            style={{ marginLeft: 15, width: 70, fontSize: 14 }}
            value={timeFilter / 24}
            onChange={val =>
              this.filter({
                ...params,
                ...{ timeFilter: val * 24 }
              })
            }
          />
          <div
            style={{ marginLeft: 5, color: "rgba(0,0,0,0.4)", fontSize: 12 }}
          >
            {timeFilter === 0
              ? "just now"
              : timeFilter === 24
                ? "day ago"
                : "days ago"}
          </div>
        </div>
      );
    };

    const renderSourceSort = () => {
      return (
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <Radio.Group
            disabled={sourceFilter !== null}
            style={{ margin: "5px 10px 10px 0px" }}
            value={this.state.sourceSort}
            onChange={e => {
              this.sort(
                this.state.visibleList,
                null,
                "sourceSort",
                e.target.value
              );
            }}
          >
            <Radio.Button style={{ fontWeight: "400" }} value={"az"}>
              <Icon style={{ marginRight: 5 }} type={"sort-ascending"} /> asc
            </Radio.Button>
            <Radio.Button style={{ fontWeight: "400" }} value={"shuffle"}>
              <Icon style={{ marginRight: 5 }} type={"interation"} />shuffle
            </Radio.Button>
            <Radio.Button style={{ fontWeight: "400" }} value="za">
              <Icon style={{ marginRight: 5 }} type={"sort-descending"} /> desc
            </Radio.Button>
          </Radio.Group>
        </div>
      );
    };

    const renderTimeSort = () => {
      return (
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <Radio.Group
            disabled={sourceFilter === null}
            style={{ margin: "5px 10px 10px 0px" }}
            value={this.state.timeSort}
            onChange={e => {
              this.sort(
                this.state.visibleList,
                null,
                "timeSort",
                e.target.value
              );
            }}
          >
            <Radio.Button style={{ fontWeight: "400" }} value={"newest"}>
              newest
            </Radio.Button>
            <Radio.Button style={{ fontWeight: "400" }} value={"oldest"}>
              oldest
            </Radio.Button>
          </Radio.Group>
        </div>
      );
    };

    const renderAllFilters = () => {
      return (
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              paddingTop: 20
            }}
          >
            {renderSourceSort()}
            {renderTimeFilter()}
            <hr
              style={{ height: 2, width: "100%", backgroundColor: "#fafafa" }}
            />
            {renderTimeSort()}
            {renderSourceFilter()}
          </div>
        </div>
      );
    };

    const renderHelperText = () => {
      let text = "";
      if (sourceFilter) {
        let timeSortText = "";
        switch (timeSort) {
          case "oldest":
            timeSortText = <span>old &rarr; new</span>;
            break;
          case "newest":
            timeSortText = <span>new &rarr; old</span>;
            break;
        }

        return (
          <div
            style={{
              position: "absolute",
              top: 90,
              fontSize: 13,
              left: 40,
              maxWidth: 250
            }}
          >
            <strong>{timeSortText}</strong>
            <span style={{ margin: "0px 6px", fontSize: 10 }}>from</span>
            <strong>{sourceFilter.title}</strong>
          </div>
        );
      } else {
        let sourceSortText = "";
        switch (sourceSort) {
          case "az":
            sourceSortText = <span>a &rarr; z</span>;
            break;
          case "za":
            sourceSortText = <span>z &rarr; a</span>;
            break;
          case "shuffle":
            sourceSortText = "shuffled";
            break;
        }
        return (
          <div
            style={{
              position: "absolute",
              top: 90,
              fontSize: 13,
              left: 40,
              maxWidth: 250
            }}
          >
            <strong>{sourceSortText}</strong>
            <span style={{ margin: "0px 6px", fontSize: 10 }}>from</span>
            <strong>
              {timeFilter === 0
                ? "just now"
                : timeFilter === 24
                  ? "1 day ago"
                  : `${timeFilter / 24} days ago`}
            </strong>
          </div>
        );
      }
    };

    if (this.state.visibleList.length < 1) {
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
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <div
            style={{
              padding: isSmall ? "60px 20px 0px 20px" : "80px 20px 0px 20px",
              display: "flex",
              justifyContent: isSmall ? "center" : "flex-start",
              alignItems: "flex-start",
              flexWrap: "wrap",
              position: "relative",
              width: "100%",
              maxWidth: 1400
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

            {isSmall ? (
              <Drawer
                title="Search Front Pages"
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
                  justifyContent: "center",
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

            {isSmall && renderHelperText()}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                // flexDirection: "column",
                width: isSmall ? "100%" : "50%",
                // maxWidth: 500,
                marginLeft: !isSmall ? 460 : 0,
                paddingTop: isSmall ? 80 : 0
              }}
            >
              {visibleList.map((record, i) => {
                return (
                  <div key={i} style={{ margin: "15px 15px" }}>
                    {sourceFilter && (
                      <div
                        style={{
                          color: "rgba(0,0,0,0.5)",
                          padding: "5px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems: "center",
                          fontSize: 12
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            fontSize: 12
                          }}
                        >
                          <Icon
                            style={{ marginRight: 5 }}
                            type={"clock-circle"}
                          />
                          <TimeAgo date={moment(record.created_at).format()} />
                        </div>
                        <div style={{ color: "rgba(0,0,0,0.4)" }}>
                          {moment(record.created_at).format(
                            "YYYY-MM-DD HH:mm Z"
                          )}
                        </div>
                      </div>
                    )}
                    <SingleFrontPage
                      imageWidth={
                        !styles.screenWidth
                          ? 300
                          : isSmall
                            ? Math.min(styles.screenWidth - 40, 400)
                            : Math.min(styles.screenWidth / 2 - 200, 500)
                      }
                      record={record}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }
  }
}
