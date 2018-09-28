import React, { Component } from "react";
import SingleFrontPage from "./SingleFrontPage";
import Slider from "react-slick";
import detectIt from "detect-it";

export default class FrontPagesRow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { styles, records } = this.props;
    const settings = {
      // dots: true,
      infinite: true,
      speed: 100,
      slidesToShow: 1,
      slidesToScroll: 1,
      // dots: false,
      arrows: false,
      className: "frontPageSlider"
      // infinite: true,
      // speed: 500,
      // slidesToShow: 1,
      // slidesToScroll: 1,
      // className: "sliderContainer",
      // centerMode: true,
      // centerPadding: "0px",
      // swipeToSlide: true
    };

    let imageWidth = Math.min(styles.screenWidth - 50, 400);

    let articleWidth = Math.min(styles.screenWidth - 100, 300);
    let articleHeight = articleWidth * 0.75;
    let articleMargin = 10;

    if (styles.touchOnly || styles.screenWidth < 500) {
      return (
        <Slider {...settings} style={{ padding: "20px 0px" }}>
          {records.map((record, i) => {
            return (
              <SingleFrontPage
                key={i}
                imageWidth={imageWidth}
                record={record}
              />
            );
          })}
        </Slider>
      );
    } else {
      return (
        <div
          className={"horzRow"}
          style={{
            display: "flex",
            padding: "20px 20px 20px 0px",
            overflowX: "auto",
            position: "relative"
          }}
        >
          {records.map((record, i) => {
            return (
              <div key={i} style={{ margin: "0px 15px" }}>
                <SingleFrontPage
                  key={i}
                  imageWidth={imageWidth}
                  record={record}
                />
              </div>
            );
          })}
        </div>
      );
    }
  }
}
