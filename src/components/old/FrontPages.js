import React, { Component } from "react";
import Site from "../Site";
import Slider from "react-slick";
import $ from "jquery";

export default class FrontPages extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate() {
    return this.props.records.length === 0;
  }

  handleHorzScroll(direction, selector) {
    $(`#${selector}`).animate(
      {
        scrollLeft: `${direction === "left" ? "-" : "+"}=${this.props
          .screenWidth - 20}px`
      },
      "fast"
    );
  }

  render() {
    const { touchOnly, imageWidth, showSlider } = this.props;
    const Arrow = ({ direction, selector }) => {
      let isLeft = direction === "left";
      return (
        <div
          id={`${selector}-${direction}`}
          style={{
            height: 40,
            width: 40,
            // backgroundColor: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            // alignItems: "center",
            justifyContent: "center",
            top: "50%",
            // bottom: "-8px",
            left: isLeft ? "2px" : "",
            right: isLeft ? "" : "2px",
            transform: "translateY(-50%)",
            position: "absolute",
            zIndex: 1,
            borderRadius: 9999,
            boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            fontSize: 24,
            // color: "rgba(255, 255, 255, 0.4)",
            lineHeight: "37px",
            cursor: "pointer"
          }}
          className={"navArrow"}
          onClick={() => this.handleHorzScroll(direction, selector)}
          // onClick={() => handleClick()}
        >
          {isLeft ? <span>&lsaquo;</span> : <span>&rsaquo;</span>}
        </div>
      );
    };

    if (touchOnly && this.props.records.length) {
      const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        className: "sliderContainer",
        centerMode: true,
        centerPadding: "0px",
        swipeToSlide: true
      };
      return (
        <Slider {...settings}>
          {this.props.records.length
            ? this.props.records.map((record, i) => {
                return (
                  <Site
                    key={i}
                    index={i}
                    record={record}
                    siteMargin={30}
                    imageWidth={touchOnly ? imageWidth : imageWidth - 50}
                    showSlider={showSlider}
                    touchOnly={touchOnly}
                  />
                );
              })
            : this.props.sites.map((site, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      height: imageWidth,
                      width: imageWidth,
                      backgroundColor: "red"
                    }}
                  />
                );
              })}
        </Slider>
      );
    } else {
      return (
        <div style={{ position: "relative" }}>
          <Arrow direction={"left"} selector={"frontPages"} />
          <div
            id={"frontPages"}
            className={"horzRow"}
            style={{
              borderRadius: 5,
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              height: imageWidth + 50,
              overflowX: "auto",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              // borderTop: "5px solid rgba(255, 255, 255, 0.01)",
              padding: "50px 20px 35px 20px",
              position: "relative"
            }}
          >
            {this.props.records.length
              ? this.props.records.map((record, i) => {
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column"
                      }}
                    >
                      <Site
                        key={i}
                        index={i}
                        record={record}
                        siteMargin={30}
                        imageWidth={imageWidth - 50}
                        showSlider={showSlider}
                        touchOnly={touchOnly}
                      />
                    </div>
                  );
                })
              : this.props.sites.map((site, i) => {
                  return (
                    <div
                      key={i}
                      style={{
                        margin: `0px ${29}px`,
                        height: imageWidth - 50,
                        width: imageWidth - 50,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        position: "relative"
                      }}
                      // onMouseEnter={() => this.setState({ hover: true })}
                      // onMouseLeave={() => this.setState({ hover: false })}
                    />
                  );
                })}
          </div>
          <Arrow direction={"right"} selector={"frontPages"} />
        </div>
      );
    }
  }
}
