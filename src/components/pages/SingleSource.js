import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import Loader from "../Loader";
import TopWordsChart from "../TopWordsChart";
import TagCloud from "../TagCloud";
import ArticleSearch from "../pages/ArticleSearch";
import FrontPageSearch from "../pages/FrontPageSearch";
import SectionWithLoader from "../SectionWithLoader";

// icons
import { Icon } from "react-icons-kit";
import { wordpress } from "react-icons-kit/fa/wordpress";
import { externalLink } from "react-icons-kit/fa/externalLink";
import { infoCircle } from "react-icons-kit/fa/infoCircle";
import { group } from "react-icons-kit/fa/group";
import { newspaperO } from "react-icons-kit/fa/newspaperO";
import { pencil } from "react-icons-kit/fa/pencil";
import { twitter } from "react-icons-kit/fa/twitter";
import { dollar } from "react-icons-kit/fa/dollar";
import { clockO } from "react-icons-kit/fa/clockO";
import { home } from "react-icons-kit/fa/home";
import { areaChart } from "react-icons-kit/fa/areaChart";

export default class SingleSource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: null,
      tags: [],
      batches: [],
      politicsTags: [],
      opinionTags: [],
      sourceCount: null,
      opinionArticles: [],
      politicsArticles: [],
      combinedArticles: [],
      view: "analysis"
    };
  }

  componentDidMount() {
    axios
      .get(
        `https://birds-eye-news-api.herokuapp.com/sources/${
          this.props.match.params.source
        }`,
        {
          Accept: "application/json"
        }
      )
      .then(res => {
        this.setState({ ...this.state, ...res.data });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { source } = this.state;
    const maxWidth = 600;

    const renderInfo = () => {
      const itemStyle = {
        display: "flex",
        padding: "6px 10px",
        borderRadius: 3,
        fontSize: 14,
        textDecoration: "none",
        margin: 5,
        backgroundColor: "rgba(33, 58, 73, 0.6)",
        color: "#fff"
      };

      const SingleLink = ({ label, link, icon, style }) => {
        return (
          <a
            href={link}
            className="shadowHover"
            style={{
              ...itemStyle,
              ...style
            }}
          >
            {icon && (
              <Icon
                style={{
                  marginRight: 5
                }}
                icon={icon}
                size={12}
              />
            )}
            {label}
          </a>
        );
      };

      const SingleItem = ({ label, style, icon }) => {
        return (
          <div
            style={{
              ...itemStyle,
              ...style
            }}
          >
            {icon && (
              <Icon
                style={{
                  marginRight: 5
                }}
                icon={icon}
                size={12}
              />
            )}{" "}
            {label}
          </div>
        );
      };

      return (
        <div style={{ display: "flex", flexWrap: "wrap", maxWidth: maxWidth }}>
          {/* Website*/}
          {source.url.length > 0 && (
            <SingleLink
              link={source.url}
              label={"Visit Website"}
              // style={{ backgroundColor: "rgba(0,0,0,0.8)", color: "#fff" }}
              icon={externalLink}
            />
          )}

          {/* Twitter */}
          {source.twitter.length > 0 && (
            <SingleLink
              link={`https://twitter.com/${source.twitter.replace("@", "")}`}
              label={source.twitter}
              // style={{ backgroundColor: "#1da1f2", color: "#fff" }}
              icon={twitter}
            />
          )}

          {/* About */}
          {source.links.about.length > 0 && (
            <SingleLink
              link={source.links.about}
              label={"About Page"}
              // style={{ backgroundColor: "rgba(0,0,0,0.8)", color: "#fff" }}
              icon={infoCircle}
            />
          )}

          {/* People */}
          {source.links.people.length > 0 && (
            <SingleLink
              link={source.links.people}
              label={"Contributors"}
              // style={{ backgroundColor: "rgba(0,0,0,0.8)", color: "#fff" }}
              icon={group}
            />
          )}

          {/* Press */}
          {source.press.length > 0 && (
            <SingleLink
              link={source.press}
              label={"Press / Media"}
              // style={{ backgroundColor: "rgba(0,0,0,0.8)", color: "#fff" }}
              icon={newspaperO}
            />
          )}

          {/* Wikipedia*/}
          {source.wikipedia.link.length > 0 && (
            <SingleLink
              link={source.wikipedia.link}
              label={"Wikipedia"}
              // style={{ color: "#fff", backgroundColor: "#36b" }}
              icon={wordpress}
            />
          )}

          {/* Submit Story */}
          {source.storySubmit.length > 0 && (
            <SingleLink
              link={source.storySubmit}
              label={"Submit a story tip"}
              // style={{ color: "#fff", backgroundColor: "rgba(46, 228, 246,1)" }}
              icon={pencil}
            />
          )}

          {/* Parent Company */}
          {source.parent.link.length > 0 && (
            <SingleItem
              link={source.parent.link}
              label={`Owned by ${source.parent.name}`}
              style={{
                backgroundColor: "rgba(255, 255, 255, .93)",
                color: "rgba(0,0,0,0.6)"
              }}
              icon={dollar}
            />
          )}

          {/* Founded */}
          {source.inception !== 0 && (
            <SingleItem
              link={source.parent.link}
              label={`Founded ${moment(source.inception).format(
                "MMM D, YYYY"
              )}`}
              style={{
                backgroundColor: "rgba(255, 255, 255, .93)",
                color: "rgba(0,0,0,0.6)"
              }}
              icon={clockO}
            />
          )}
          {source.wikipedia.summary.length ? (
            <div style={{ padding: "0px 10px" }}>
              <p style={{ color: "rgba(0,0,0,0.6)", lineHeight: 1.5 }}>
                {source.wikipedia.summary}
                <span
                  style={{
                    color: "rgba(0,0,0,0.4)",
                    fontStyle: "italic"
                  }}
                >
                  - Wikipedia
                </span>
              </p>
            </div>
          ) : null}
        </div>
      );
    };

    const renderArticles = () => {
      return (
        <ArticleSearch
          isSingleSource
          articles={this.state.combinedArticles}
          tags={this.state.tags}
        />
      );
    };

    const renderAnalysis = () => {
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "stretch",
            width: "100%"
          }}
        >
          <SectionWithLoader
            title={`most common words from ${
              this.state.sourceCount ? this.state.sourceCount : ""
            } recent headlines`}
            isLoading={this.state.tags.length < 2}
            sectionStyle={{
              margin: "10px 0px 10px 5px",
              maxWidth: 350
              // width: Math.min(this.props.screenWidth - 80, 350)
            }}
            // divStyle={{ width: screenWidth > 768 ? "50%" : "100%" }}
          >
            <TagCloud tags={this.state.tags} />
          </SectionWithLoader>
          <SectionWithLoader
            title={`% of recent headlines that include the word...`}
            isLoading={this.state.tags.length < 2}
            sectionStyle={{
              margin: "10px 0px 10px 5px"
              // width: Math.min(this.props.screenWidth - 80, 350)
            }}
            // divStyle={{ width: screenWidth > 768 ? "50%" : "100%" }}
          >
            <TopWordsChart
              topTags={this.state.tags}
              batchOfTags={{ sourceCount: this.state.combinedArticles.length }}
            />
          </SectionWithLoader>
        </div>
      );
    };

    const renderFrontPages = () => {
      return (
        <FrontPageSearch
          isSingleSource
          batches={this.state.batches}
          source={this.state.source}
        />
      );
    };

    const renderView = () => {
      switch (this.state.view) {
        case "info":
          return renderInfo();
        case "articles":
          return renderArticles();
        case "analysis":
          return renderAnalysis();
        case "frontPages":
          return renderFrontPages();
        default:
          return renderInfo();
      }
    };

    const Tab = ({ icon, text, view }) => {
      let isActive = view === this.state.view;
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0px 5px 5px 5px",
            borderBottom: isActive
              ? "2px solid rgba(46, 228, 246,1)"
              : "2px solid rgba(0,0,0,0.2)",
            flexGrow: 1,
            flexBasis: 0,
            cursor: "pointer"
          }}
          onClick={() => this.setState({ view })}
        >
          <Icon
            style={{
              marginBottom: 3,
              color: isActive ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)"
            }}
            icon={icon}
            size={20}
          />
          <span
            style={{
              fontSize: 12,
              color: isActive ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)"
            }}
          >
            {text}
          </span>
        </div>
      );
    };

    if (!source) {
      return (
        <div
          style={{
            display: "flex",
            height: "100vh",
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {" "}
          <Loader loaderHeight={500} loadingMessage={"loading source report"} />
        </div>
      );
    } else {
      return (
        <div
          style={{
            padding: "70px 10px 20px 10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            maxWidth: 900,
            margin: "auto"
          }}
        >
          <div
            style={{
              // padding: "0px 20px 20px 20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexDirection: "column",
              margin: "auto",
              width: "100%"
            }}
          >
            <div style={{ margin: "auto", width: "100%", maxWidth: maxWidth }}>
              <Link
                to={"/sources"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 12,
                  color: "rgba(0,0,0,0.2)",
                  textDecoration: "none",
                  cursor: "pointer"
                }}
              >
                &larr; pick another source
              </Link>
              <h1
                style={{
                  margin: "10px 10px 20px 10px",
                  color: "rgba(0,0,0,0.8)",
                  textAlign: "left"
                }}
              >
                {source.title}
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  margin: "10px 0px 20px 0px"
                  // borderBottom: "2px solid rgba(0,0,0,0.3)"
                }}
              >
                <Tab text={"Analysis"} view={"analysis"} icon={areaChart} />
                <Tab text={"Articles"} view={"articles"} icon={pencil} />
                <Tab
                  text={"Front Pages"}
                  view={"frontPages"}
                  icon={newspaperO}
                />
                <Tab text={"General"} view={"info"} icon={infoCircle} />
              </div>
            </div>
            <div style={{ margin: "auto" }}>{renderView()}</div>
          </div>
        </div>
      );
    }
  }
}
