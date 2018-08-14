import React, { Component } from "react";
import TagCloud from "./TagCloud";
import axios from "axios/index";
import shuffle from "shuffle-array";
import ReactGA from "react-ga";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTags: [],
      batchOfTags: null,
      records: [],
      batch: []
    };
  }

  componentDidMount() {
    let tagPlaceholders = [];

    for (let i = 1; i <= 20; i++) {
      tagPlaceholders.push(null);
    }

    this.setState({ topTags: tagPlaceholders });

    axios
      .get("http://localhost:8000/recent_tags")
      .then(res => {
        this.setState({
          batchOfTags: res.data.batch,
          topTags: res.data.batch.tags.slice(0, 20)
        });
      })
      .catch(err => console.log(err));

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

    window.addEventListener(
      "resize",
      this.throttle(this.updateDimensions.bind(this), 1000)
    );

    // google analystics
    this.initReactGA();

    window.addEventListener("touchstart", this.touchStart);
    window.addEventListener("touchmove", this.preventTouch, { passive: false });
  }
  render() {
    const {
      screenWidth,
      screenHeight,
      records,
      touchOnly,
      isLanding
    } = this.state;
    let imageWidth = touchOnly
      ? Math.min(screenWidth, 700)
      : Math.min(screenWidth, 400);

    let articleWidth = touchOnly
      ? Math.min(screenWidth, 400)
      : Math.min(screenWidth, 340);
    let articleMargin = 10;

    let isWide = screenWidth > 768;
    let showSlider = screenWidth < 500;

    return (
      <div
        style={{
          backgroundColor: "#f2f2f2",
          minHeight: "100vh",
          padding: "20px 0px"
        }}
      >
        <div
          style={{
            borderTop: "1px solid #f2f2f2",
            borderBottom: "1px solid #f2f2f2",
            padding: 20,
            backgroundColor: "#fff",
            marginBottom: 10
          }}
        >
          <h5 style={{ margin: 0 }}>
            {`most common words ${this.state.batchOfTags ? "from" : ""} ${
              this.state.batchOfTags ? this.state.batchOfTags.sourceCount : ""
            } ${this.state.batchOfTags ? "headlines" : ""}`}
          </h5>
          <TagCloud tags={this.state.topTags} />
        </div>
        <div
          style={{
            borderTop: "1px solid #f2f2f2",
            borderBottom: "1px solid #f2f2f2",
            padding: 20,
            backgroundColor: "#fff",
            marginBottom: 10
          }}
        >
          <h5 style={{ margin: 0 }}>
            {`most common words ${this.state.batchOfTags ? "from" : ""} ${
              this.state.batchOfTags ? this.state.batchOfTags.sourceCount : ""
            } ${this.state.batchOfTags ? "headlines" : ""}`}
          </h5>
          {this.state.records.map((record, i) => {
            return;
          })}
        </div>
      </div>
    );
  }
}
