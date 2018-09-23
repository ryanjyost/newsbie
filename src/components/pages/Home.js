import React, { Component } from "react";
import axios from "axios/index";
import shuffle from "shuffle-array";
import ReactGA from "react-ga";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    /*
		* Recent Tags
		* */
    axios
      .get("https://birds-eye-news-api.herokuapp.com/recent_tags", {
        Accept: "application/json"
      })
      .then(res => {
        // get top, different topics
        let topics = [res.data.topTags[0]];

        let tags = res.data.topTags;
        for (let i = 1; i < tags.length; i++) {
          let currentTag = tags[i];
          if (topics.length > 2) {
            break;
          } else {
            let duplicate = topics.find(topic => {
              let splitTag = currentTag.term.split(" ");
              // console.log(splitTag);
              return splitTag.find(word => {
                return word.includes(topic.term) || topic.term.includes(word);
              });
            });
            if (duplicate) {
              // console.log(duplicate, currentTag);
              continue;
            } else {
              topics.push(currentTag);
            }
          }
        }

        // console.log(topics);
        for (let batch of res.data.batches) {
          // console.log(batch);
          let cohen = batch.tags.find(tag => {
            return tag.term === "cohen";
          });

          // if (cohen) {
          //   console.log(cohen);
          // } else {
          //   console.log("NOT FOUND", batch);
          // }
        }

        this.setState({
          batchOfTags: res.data.batches[0],
          allTagBatches: res.data.batches,
          topTags: res.data.topTags,
          topics
        });
      })
      .catch(err => console.log(err));

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

    /*
	 * Articles
	 * */
    axios
      .get("https://birds-eye-news-api.herokuapp.com/today", {
        Accept: "application/json"
      })
      .then(res => {
        let currentNews = shuffle(res.data.politicsArticles);

        let filteredPolitics = currentNews.filter(article => {
          return article.site.name.toLowerCase() !== "politico";
        });

        let currentOpinions = shuffle(res.data.opinionArticles);

        let filteredOpinions = currentOpinions.filter(article => {
          return article.site.name.toLowerCase() !== "cbsnews";
        });

        this.setState({
          sites: res.data.sites,
          politicsArticles: filteredPolitics,
          opinionArticles: filteredOpinions
        });
      })
      .catch(err => console.log(err));

    axios
      .get(`https://birds-eye-news-api.herokuapp.com/top_news`, {
        Accept: "application/json"
      })
      .then(res => {
        this.setState({ topics: res.data.topics, batches: res.data.batches });
      })
      .catch(err => console.log(err));
  }

  render() {
    const {} = this.state;
    const { screenWidth } = this.props;

    let imageWidth = Math.min(screenWidth - 50, 400);

    let articleWidth = Math.min(screenWidth - 100, 300);
    let articleHeight = articleWidth * 0.75;
    let articleMargin = 10;

    const sectionStyle = {
      // border: this.props.noStyle ? null : "1px solid #e5e5e5",
      padding: 25,
      backgroundColor: "#fff",
      margin: "10px 10px",
      borderRadius: 3,
      position: "relative",
      width: "100%"
    };

    const styles = {
      articleWidth,
      articleHeight,
      articleMargin,
      sectionStyle,
      screenWidth,
      maxWidth: 900
    };
    //
    // let topTags = this.state.topTags.slice();

    // const renderTopWordsGraph = () => {
    //   let data = topTags.map(tag => {
    //     if (tag) {
    //       return {
    //         x: tag.sourceCount / this.state.batchOfTags.sourceCount,
    //         y: tag.term
    //       };
    //     } else {
    //       return {
    //         x: 0,
    //         y: ""
    //       };
    //     }
    //   });
    //
    //   let sorted = data.sort((a, b) => {
    //     if (a.x > b.x) {
    //       return 1;
    //     } else if (b.x > a.x) {
    //       return -1;
    //     } else {
    //       return 0;
    //     }
    //   });
    //
    //   return (
    //     <div
    //       style={{
    //         display: "flex",
    //         width: "auto",
    //         overflowX: "scroll",
    //         overflowY: "hidden",
    //         padding: "10px 0px 0px 0px",
    //         marginLeft: -20,
    //         strokeWidth: 0
    //       }}
    //     >
    //       {data && (
    //         <XYPlot
    //           yType="ordinal"
    //           xType="linear"
    //           height={300}
    //           width={Math.min(styles.screenWidth - 60, 350)}
    //         >
    //           <VerticalGridLines />
    //           <HorizontalGridLines />
    //           <HorizontalBarSeries
    //             color={"rgba(46, 228, 246, 0.6)"}
    //             opacity={0.5}
    //             data={sorted.slice(data.length - 10)}
    //           />
    //           <YAxis
    //             left={250}
    //             style={{
    //               line: { stroke: "rgba(0,0,0,0)" },
    //               ticks: { stroke: "rgba(0,0,0,0)" },
    //               text: {
    //                 stroke: "none",
    //                 fill: "rgba(0,0,0,0.8)",
    //                 fontWeight: 400,
    //                 fontSize: 12
    //               }
    //             }}
    //           />
    //           <XAxis
    //             tickFormat={v => `${(v * 100).toFixed()}%`}
    //             style={{
    //               line: { stroke: "rgba(0,0,0,0)" },
    //               ticks: { stroke: "rgba(0,0,0,0)" },
    //               text: {
    //                 stroke: "none",
    //                 fill: "rgba(0,0,0,0.4)",
    //                 fontWeight: 300,
    //                 fontSize: 10
    //               }
    //             }}
    //           />
    //         </XYPlot>
    //       )}
    //     </div>
    //   );
    // };
    //
    // const renderFrontPages = () => {
    //   const settings = {
    //     // dots: true,
    //     infinite: true,
    //     speed: 100,
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     // dots: false,
    //     arrows: false,
    //     className: "frontPageSlider"
    //     // infinite: true,
    //     // speed: 500,
    //     // slidesToShow: 1,
    //     // slidesToScroll: 1,
    //     // className: "sliderContainer",
    //     // centerMode: true,
    //     // centerPadding: "0px",
    //     // swipeToSlide: true
    //   };
    //   if (touchOnly) {
    //     return (
    //       <Slider {...settings} style={{ padding: "20px 0px" }}>
    //         {this.state.records.map((record, i) => {
    //           return (
    //             <SingleFrontPage
    //               key={i}
    //               imageWidth={imageWidth}
    //               record={record}
    //             />
    //           );
    //         })}
    //       </Slider>
    //     );
    //   } else {
    //     return (
    //       <div
    //         className={"horzRow"}
    //         style={{
    //           display: "flex",
    //           padding: "20px 20px",
    //           overflowX: "auto",
    //           position: "relative"
    //         }}
    //       >
    //         {this.state.records.map((record, i) => {
    //           return (
    //             <div key={i} style={{ margin: "0px 15px" }}>
    //               <SingleFrontPage
    //                 key={i}
    //                 imageWidth={imageWidth}
    //                 record={record}
    //               />
    //             </div>
    //           );
    //         })}
    //       </div>
    //     );
    //   }
    // };
    //
    // const renderTopNews = () => {
    //   return <TopNews topicCount={1} />;
    // };

    return <div style={{ display: "flex", flexWrap: "wrap" }}>hey</div>;
  }
}
