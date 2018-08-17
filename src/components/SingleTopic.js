import React, { Component } from "react";
import TagCloud from "./TagCloud";
import TimeAgo from "react-timeago";
import Article from "./SingleArticle";
import Slider from "react-slick";

export default class SingleTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTagFilter: null
    };
  }

  render() {
    const { styles, tag, politicsArticles } = this.props;
    const { currentTagFilter } = this.state;

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

    let filteredPolitics = politicsArticles.filter(article => {
      return (
        article.title.toLowerCase().includes(tag.term.toLowerCase()) &&
        (currentTagFilter
          ? article.title
              .toLowerCase()
              .includes(currentTagFilter.term.toLowerCase()) ||
            article.summary
              .toLowerCase()
              .includes(currentTagFilter.term.toLowerCase())
          : true)
      );
    });

    const renderArticleFeed = list => {
      if (list.length > 0) {
        if (this.props.touchOnly) {
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
                padding: "20px 0px",
                justifyContent: "center",
                // flexDirection: "column",
                flexWrap: "wrap",
                // overflowX: "auto",
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
              height: 100,
              width: "100%",
              backgroundColor: "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            Loading
          </div>
        );
      }
    };

    return (
      <div style={{ ...styles.sectionStyle, ...{ position: "relative" } }}>
        <h2 style={{ margin: 0 }}>{tag ? tag.term : ""}</h2>
        <TagCloud
          tags={tag ? tag.related.slice(1, 10) : []}
          isFilter
          onClickTag={tag => this.setState({ currentTagFilter: tag })}
          currentTag={currentTagFilter}
        />

        {/*// width:*/}
        {/*//   filteredPolitics.length **/}
        {/*//   (styles.articleWidth + styles.articleMargin * 2)*/}
        {/*}}*/}
        {/*>*/}

        {renderArticleFeed(filteredPolitics)}
      </div>
      // </div>
    );
  }
}
