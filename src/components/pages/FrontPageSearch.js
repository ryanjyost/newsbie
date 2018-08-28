import React, { Component } from "react";
import axios from "axios/index";
import shuffle from "shuffle-array";
import SingleFrontPage from "../SingleFrontPage";

export default class FrontPageSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      screenWidth: 0
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
        this.setState({
          sites: response.data.sites,
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
    const { screenWidth } = this.state;

    const renderBatch = records => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {records.map((record, i) => {
            return (
              <div key={i} style={{ margin: 10 }}>
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

    return (
      <div
        style={{
          padding: "50px 0px 0px 0px",
          display: "flex",
          // flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
          // flexWrap: "wrap"
        }}
      >
        <div
          style={{
            display: "flex",
            // flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        />
        {renderBatch(this.state.records)}
      </div>
    );
  }
}
