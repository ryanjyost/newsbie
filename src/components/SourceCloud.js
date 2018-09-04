import React, { Component } from "react";
import sources from "../sources";
import { Link } from "react-router-dom";

export default class SourceCloud extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const siteItem = site => {
      return (
        <Link
          to={`/sources/${site.name}`}
          key={site.name}
          onClick={() => this.setState({ siteFilter: site })}
          className={"hoverBtn singleTag"}
          style={{
            fontSize: 12,
            borderRadius: 3,
            margin: "3px 3px",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 12px",
            display: "inline-block",
            transition: "background 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)"
          }}
        >
          {site.title}
        </Link>
      );
    };
    return (
      <div
        style={{
          margin: "auto",
          // padding: "10px 20px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {" "}
        {sources
          .sort((a, b) => {
            if (a.title.replace("The ", "") > b.title.replace("The ", "")) {
              return 1;
            } else if (
              b.title.replace("The ", "") > a.title.replace("The ", "")
            ) {
              return -1;
            } else {
              return 0;
            }
          })
          .map(site => {
            return siteItem(site);
          })}
      </div>
    );
  }
}
