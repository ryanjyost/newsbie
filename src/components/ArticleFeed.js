import React, { Component } from "react";
import TimeAgo from "react-timeago";
import Article from "./SingleArticle";
import Slider from "react-slick";

const ArticleFeed = ({ list, styles, touchOnly }) => {
  const settings = {
    infinite: true,
    speed: 100,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
    className: "singleTopicSlider",
    centerPadding: "20px",
    centerMode: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 650, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  if (list.length > 0) {
    if (touchOnly) {
      return (
        <Slider {...settings} style={{ padding: "20px 0px" }}>
          {list.map((article, i) => {
            return (
              <Article
                key={i}
                index={i}
                article={article}
                articleWidth={styles.articleWidth}
                articleHeight={styles.articleHeight}
                articleMargin={styles.articleMargin}
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
            padding: "0px 0px",
            // justifyContent: "center",
            // flexDirection: "column",
            // flexWrap: "wrap",
            maxWidth: styles.screenWidth,
            overflowX: "auto",
            position: "relative"
          }}
        >
          {list.map((article, i) => {
            return (
              <Article
                key={i}
                index={i}
                article={article}
                articleWidth={styles.articleWidth}
                articleHeight={styles.articleHeight}
                articleMargin={styles.articleMargin}
              />
            );
          })}
        </div>
      );
    }
  } else {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: styles.articleHeight,
          width: "100%",
          color: "rgba(0, 0, 0, 0.4)",
          fontSize: 14
        }}
      >
        loading articles
        <div style={{ marginTop: 10, maxWidth: 200 }} className="loader" />
      </div>
    );
  }
};

export default ArticleFeed;
