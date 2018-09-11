import React, { Component } from "react";
import axios from "axios/index";
import Loader from "../Loader";
import { Row, Col } from "react-bootstrap";
import sources from "../../sources";
import { Icon } from "react-icons-kit";
import { ic_close } from "react-icons-kit/md/ic_close";
import { ic_menu } from "react-icons-kit/md/ic_menu";
import shuffle from "shuffle-array";
import CircularProgressbar from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import numeral from "numeral";

export default class Chyrons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: null,
      textBySource: null,
      countBySource: null,
      chyronSources: shuffle(["cnn", "foxnews", "msnbc"]),
      showHelper: true,
      timeFilter: 6,
      overlap: null
    };
  }

  componentDidMount() {
    this.handleTimeFilter(this.state.timeFilter);
  }

  handleTimeFilter(hours) {
    this.setState({ timeFilter: hours, tags: null, overlap: null });
    axios
      .get(`http://localhost:8000/chyrons/${hours}`, {
        Accept: "application/json"
      })
      .then(res => {
        console.log(res.data);
        const { cnn, foxnews, msnbc } = res.data.tags;
        const shortest = Math.min(cnn.length, foxnews.length, msnbc.length, 30);
        let cnnSorted = cnn
          .sort((a, b) => {
            if (a.tf > b.tf) {
              return -1;
            } else if (a.tf < b.tf) {
              return 1;
            } else {
              return 0;
            }
          })
          .slice(0, shortest);
        let foxnewsSorted = foxnews
          .sort((a, b) => {
            if (a.tf > b.tf) {
              return -1;
            } else if (a.tf < b.tf) {
              return 1;
            } else {
              return 0;
            }
          })
          .slice(0, shortest);

        let msnbcSorted = msnbc
          .sort((a, b) => {
            if (a.tf > b.tf) {
              return -1;
            } else if (a.tf < b.tf) {
              return 1;
            } else {
              return 0;
            }
          })
          .slice(0, shortest);

        this.setState({
          tags: {
            cnn: cnnSorted,
            foxnews: foxnewsSorted,
            msnbc: msnbcSorted
          },
          countBySource: res.data.countBySource,
          overlap: res.data.overlap
          // chyronSoures: shuffle(['cnn', 'foxnews', 'msnbc'])
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { timeFilter, countBySource } = this.state;

    // if (!this.state.tags) {
    //     //   return (
    //     //     <div>
    //     //       <Loader
    //     //         loaderHeight={"100vh"}
    //     //         loadingMessage={"Loading and analyzing chyrons"}
    //     //       />
    //     //     </div>
    //     //   );
    //     // }

    const renderHelper = () => {
      return (
        <div
          className={"shadow"}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            // alignItems: "center",
            margin: "0px 20px",
            backgroundColor: "rgba(255,255,255,1)",
            padding: 20,
            borderRadius: 3,
            position: "relative"
          }}
        >
          <Icon
            style={{
              color: "rgba(0,0,0,0.4)",
              position: "absolute",
              top: 5,
              right: 5,
              cursor: "pointer"
            }}
            onClick={() => this.setState({ showHelper: false })}
            icon={ic_close}
            size={26}
          />
          <h1 style={{ margin: "5px 0px" }}>chyrons</h1>
          <p style={{ margin: "0px 0px 10px 0px", color: "rgba(0,0,0,0.7)" }}>
            are the headlines at the bottoms of news broadcasts
          </p>
          <img
            src={"https://d1dzf0mjm4jp11.cloudfront.net/chyron.jpg"}
            width={300}
            style={{ margin: "auto" }}
          />
          <a
            style={{
              fontSize: 10,
              color: "rgba(0,0,0,0.4)",
              margin: "0px 0px 0px 0px",
              width: "100%",
              textAlign: "right"
            }}
            href={"https://archive.org/services/third-eye.php"}
          >
            Data provided by the TV News Archive
          </a>
        </div>
      );
    };

    const randomColor = ranges => {
      const getRandom = ({ max, min }) => {
        return Math.random() * (max - min) + min;
      };
      return `rgba(${getRandom(ranges[0])}, ${getRandom(
        ranges[1]
      )}, ${getRandom(ranges[2])}, ${getRandom(ranges[3])})`;
    };

    const renderCloud = (list, denom) => {
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "baseline"
          }}
        >
          {list.map((tag, i) => {
            return (
              <div
                key={i}
                style={{
                  padding: 3,
                  color: randomColor([
                    { min: 60, max: 82 },
                    { min: 100, max: 121 },
                    { min: 120, max: 145 },
                    { min: 0.5, max: 1 }
                  ]),
                  fontSize: Math.max(Math.min((tag.tf / denom) * 150, 50), 14),
                  textAlign: "center"
                }}
              >
                {tag.term}
              </div>
            );
          })}
        </div>
      );
    };

    const renderSource = name => {
      const source = sources.find(source => {
        return source.name === name;
      });

      return (
        <div
          key={source.name}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
            borerRadius: 3,
            padding: 20,
            backgroundColor: "rgba(255,255,255,1)",
            margin: "5px 10px 20px 10px",
            maxWidth: 300
          }}
          className={"shadow"}
        >
          <div
            style={{
              width: "100%",
              padding: "0px 10px",
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <img
              src={`https://d1dzf0mjm4jp11.cloudfront.net/logos/${
                source.image
              }`}
              height={20}
            />
            <div
              style={{
                fontSize: 14,
                color: "rgba(0,0,0,0.4)"
              }}
            >
              {source.title}
            </div>
          </div>
          {renderCloud(this.state.tags[name], countBySource[name])}
        </div>
      );
    };

    const renderFilter = () => {
      return (
        <div
          style={{
            display: "flex",
            // flexWrap: "wrap",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            marginTop: 20
          }}
        >
          <h4 style={{ margin: 10, textAlign: "center" }}>
            Most common chyron terms from the past...
          </h4>
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
              onClick={() => this.handleTimeFilter(6)}
              style={{
                textAlign: "center",
                padding: 5,
                flex: 0.33,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                backgroundColor: timeFilter === 6 ? "rgba(0,0,0,0.8)" : "",
                color: timeFilter === 6 ? "rgba(255,255,255,1)" : "",
                border: "1px solid rgba(0,0,0,0.2)"
              }}
            >
              6 hours
            </div>
            <div
              onClick={() => this.handleTimeFilter(12)}
              style={{
                textAlign: "center",
                padding: 5,
                flex: 0.34,
                backgroundColor: timeFilter === 12 ? "rgba(0,0,0,0.8)" : "",
                color: timeFilter === 12 ? "rgba(255,255,255,1)" : "",
                border: "1px solid rgba(0,0,0,0.2)"
              }}
            >
              12 hours
            </div>
            <div
              onClick={() => this.handleTimeFilter(24)}
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
              24 hours
            </div>
          </div>
        </div>
      );
    };

    const renderComparison = (overlap, source1, source2) => {
      console.log(overlap);
      let first = sources.find(source => {
        return source.name === source1;
      });

      if (first.name === "msnbc") {
        first.title = "MSNBC";
      }

      let second = sources.find(source => {
        return source.name === source2;
      });

      if (second.name === "msnbc") {
        second.title = "MSNBC";
      }

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexDirection: "column",
            borerRadius: 3,
            padding: 20,
            backgroundColor: "rgba(255,255,255,1)",
            margin: "5px 10px 20px 10px",
            width: "100%",
            maxWidth: 300
          }}
          className={"shadow"}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginBottom: 20
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginRight: 10,
                color: "rgba(0,0,0,0.9)",
                textAlign: "right",
                width: 100
              }}
            >
              {first.title}
            </div>
            <div style={{ color: "rgba(0,0,0,0.3)" }}>vs.</div>
            <div
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginLeft: 10,
                color: "rgba(0,0,0,0.9)",
                width: 100
              }}
            >
              {second.title}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginBottom: 10
            }}
          >
            <div style={{ width: 150, margin: "0px 0px 0px 0px" }}>
              <CircularProgressbar
                percentage={overlap.percentage * 100}
                text={numeral(overlap.percentage).format("0%")}
                styles={{
                  path: { stroke: "rgba(46, 228, 246,1)" },
                  text: {
                    // Tweak text color:
                    fill: "rgba(0,0,0,0.9)",
                    // Tweak text size:
                    fontSize: "30px"
                  }
                }}
              />
            </div>
            <div
              style={{
                marginLeft: 10,
                color: "rgba(0,0,0,0.4)",
                fontSize: 14,
                lineHeight: 1.5
              }}
            >
              similarity between{" "}
              <strong
                style={{
                  color: "rgba(0,0,0,0.6)"
                }}
              >
                {first.title}
              </strong>{" "}
              and{" "}
              <strong
                style={{
                  color: "rgba(0,0,0,0.6)"
                }}
              >
                {second.title}
              </strong>{" "}
              chyron topics in the past {this.state.timeFilter} hours
            </div>
          </div>
          {renderCloud(
            overlap.words,
            overlap.words.length / overlap.percentage
          )}
        </div>
      );
    };

    return (
      <div
        style={{
          padding: "70px 10px 0px 10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }}
      >
        {this.state.showHelper && renderHelper()}
        <Row>{renderFilter()}</Row>

        {this.state.tags && this.state.overlap ? (
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
                padding: "0px 10px",
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap"
              }}
            >
              {this.state.chyronSources.map(chyron => {
                return renderSource(chyron);
              })}
            </div>

            <h4 style={{ margin: "30px 10px 10px 10px", textAlign: "center" }}>
              How do the three major news networks compare?
            </h4>
            <div
              style={{
                padding: "0px 10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "stretch",
                flexWrap: "wrap",
                width: "100%"
              }}
            >
              {renderComparison(
                this.state.overlap["foxToCnn"],
                "foxnews",
                "cnn"
              )}
              {renderComparison(
                this.state.overlap["foxToMSNBC"],
                "msnbc",
                "foxnews"
              )}
              {renderComparison(
                this.state.overlap["cnnToMSNBC"],
                "cnn",
                "msnbc"
              )}
            </div>
          </div>
        ) : (
          <div>
            <Loader
              loaderHeight={"calc(100vh - 300px)"}
              loadingMessage={"Loading and analyzing chyrons"}
            />
          </div>
        )}
      </div>
    );
  }
}
