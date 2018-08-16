import React, { Component } from "react";
import TagCloud from "./TagCloud";
import TimeAgo from "react-timeago";
import Article from "./SingleArticle";

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

    let slicedArticles = filteredPolitics.slice(0, 4);

    return (
      <div style={{ ...styles.sectionStyle, ...{ position: "relative" } }}>
        <h2 style={{ margin: 0 }}>{tag ? tag.term : ""}</h2>
        <TagCloud
          tags={tag ? tag.related.slice(1, 10) : []}
          isFilter
          onClickTag={tag => this.setState({ currentTagFilter: tag })}
          currentTag={currentTagFilter}
        />

        <div
          // className={"horzRow"}
          style={{
            display: "flex",
            padding: "20px 0px",
            justifyContent: "center",
            // flexDirection: "column",
            flexWrap: "wrap",
            // overflowX: "auto",
            position: "relative"

            // width:
            //   filteredPolitics.length *
            //   (styles.articleWidth + styles.articleMargin * 2)
          }}
        >
          {slicedArticles.map((article, i) => {
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
      </div>
    );
  }
}
