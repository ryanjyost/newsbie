import React, { Component } from "react";
import { Popover } from "react-bootstrap";
import $ from "jquery";
import numeral from "numeral";

export default class SingleTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      popoverOpacity: 0,
      wiki: [null, null, null, null, null, null, null, null, null],
      noResults: false,
      loadWidth: 0
    };
  }

  fetchWiki() {
    $.ajax({
      type: "POST",
      url: `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${
        this.props.tag.term
      }&prop=info&inprop=url&utf8=&format=json`,
      dataType: "jsonp",
      contentType: "application/x-www-form-urlencoded",
      crossDomain: true,
      success: function(data) {
        this.setState({
          wiki: data.query.search,
          noResults: data.query.searchinfo.totalhits === 0
        });
      }.bind(this),
      error: function(jqXhr, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  }

  render() {
    const { tag, i, currentTag, vsAverage } = this.props;
    const { hover } = this.state;

    let url = tag ? tag.term.replace(/ /g, "+") : "";
    const isCurrent = this.props.currentTag
      ? this.props.currentTag.term === tag.term
      : false;

    const renderPercentageFreq = tag => {
      return (
        <div style={{ marginLeft: 5, color: "rgba(0,0,0,0.4)", fontSize: 12 }}>
          {numeral(tag.percentageFreq).format("0.0%")}
        </div>
      );
    };

    const renderDiffToAvg = tag => {
      return (
        <div
          style={{
            marginLeft: 5,
            color: "#26C521",
            fontSize: 12,
            display: "flex",
            alignItems: "baseline"
          }}
        >
          {"average" in tag ? (
            <span>{`${numeral(1 + tag.average.percentageDiff).format(
              "0.0"
            )}x`}</span>
          ) : (
            <span>&infin;</span>
          )}
        </div>
      );
    };

    return (
      <div key={i} style={{ position: "relative" }}>
        {/*{hover && Popover()}*/}
        <a
          target={"_blank"}
          onClick={() => {
            if (this.props.isFilter) {
              this.props.handleClick();
            }
          }}
          href={
            this.props.isFilter
              ? null
              : `https://en.wikipedia.org/w/index.php?search=${url}&title=Special:Search&fulltext=1`
          }
          className={"hoverBtn singleTag"}
          style={{
            // border: "1px solid rgba(0, 0, 0, 0.1)",
            fontSize: "20px",
            borderRadius: 3,
            margin: "3px 3px",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 12px",
            width: tag ? "auto" : 50 + 100 * Math.random(),
            height: tag ? "auto" : 30,
            // flex: "1 1 80px",
            display: "inline-block",
            transition: "background 0.2s",
            backgroundColor: currentTag && !isCurrent ? "#fafafa" : "",
            boxShadow:
              currentTag && !isCurrent
                ? ""
                : "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)"

            // transform: "skew(-20deg)" /* SKEW */
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "background 0.2s",
              fontSize: 14
            }}
          >
            {tag ? tag.term : ""}{" "}
            {this.props.showPercentageFreq && renderPercentageFreq(tag)}
            {this.props.showDiffToAvg && renderDiffToAvg(tag)}
          </div>
        </a>
      </div>
    );
  }
}
