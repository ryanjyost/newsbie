import React, { Component } from "react";
import TagCloud from "./TagCloud";
import FrequencyLineGraph from "./FrequencyLineGraph";
import SectionWithLoader from "./SectionWithLoader";
import ArticleFeed from "./ArticleFeed";

export default class SingleTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTagFilter: null
    };
  }

  render() {
    const {
      styles,
      tag,
      politicsArticles,
      opinionArticles,
      touchOnly
    } = this.props;
    const { currentTagFilter } = this.state;

    let filteredPolitics = politicsArticles.filter(article => {
      if (tag) {
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
      } else {
        return false;
      }
    });

    let filteredOpinions = opinionArticles.filter(article => {
      if (tag) {
        return article.title.toLowerCase().includes(tag.term.toLowerCase());
      } else {
        return false;
      }
    });

    return (
      <div
        style={{
          ...styles.sectionStyle,
          ...{
            position: "relative",
            border: "1px solid #e5e5e5",
            borderRadius: 3,
            width: Math.min(
              this.props.styles.screenWidth - 50,
              this.props.styles.maxWidth
            )
          }
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // borderBottom: "1px solid rgba(0,0,0,0.1)",
            paddingBottom: 5
          }}
        >
          <h2 style={{ margin: 0, marginRight: 5 }}>{tag ? tag.term : ""}</h2>{" "}
          <h6 style={{ margin: 0, color: "rgba(0,0,0,0.3)" }}>
            {`breakdown of #${this.props.tagIndex + 1} term`}
          </h6>
        </div>
        {tag ? (
          tag.related.length > 3 ? (
            <TagCloud
              tags={tag ? tag.related.slice(1, 10) : []}
              isFilter
              onClickTag={tag => this.setState({ currentTagFilter: tag })}
              currentTag={currentTagFilter}
            />
          ) : null
        ) : (
          <TagCloud
            tags={tag ? tag.related.slice(1, 10) : []}
            isFilter
            onClickTag={tag => this.setState({ currentTagFilter: tag })}
            currentTag={currentTagFilter}
          />
        )}

        <div style={{ padding: "20px 0px" }}>
          <h5
            style={{
              margin: "5px 0px",
              color: "rgba(0,0,0,0.7)",
              textAlign: "left"
            }}
          >
            news articles
          </h5>
          <ArticleFeed
            list={filteredPolitics}
            touchOnly={touchOnly}
            styles={styles}
          />
        </div>

        <div style={{ margin: "20px 0px" }}>
          <h5 style={{ margin: 0, display: "flex" }}>
            <span>{`headline frequency over the past 24 hours`}</span>
          </h5>
          {this.props.allTagBatches.length < 2 ? (
            <SectionWithLoader noStyle isLoading={true} />
          ) : (
            <FrequencyLineGraph
              tag={tag}
              data={this.props.allTagBatches}
              styles={styles}
            />
          )}
        </div>

        <div style={{ padding: "20px 0px" }}>
          <h5
            style={{
              margin: "5px 0px",
              color: "rgba(0,0,0,0.7)",
              textAlign: "left"
            }}
          >
            opinion pieces
          </h5>
          <ArticleFeed
            list={filteredOpinions}
            touchOnly={touchOnly}
            styles={styles}
          />
        </div>
      </div>
    );
  }
}
