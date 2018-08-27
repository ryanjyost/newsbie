import React, { Component } from "react";
import { Popover } from "react-bootstrap";
import $ from "jquery";
import Icon from "react-icons-kit";
import { wikipediaW } from "react-icons-kit/fa/wikipediaW";
import { frownO } from "react-icons-kit/fa/frownO";
import { ic_close } from "react-icons-kit/md/ic_close";

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
    const { tag, i, currentTag } = this.props;
    const { hover } = this.state;

    let url = tag ? tag.term.replace(/ /g, "+") : "";
    const isCurrent = this.props.currentTag
      ? this.props.currentTag.term === tag.term
      : false;
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
          {/*<div*/}
          {/*style={{*/}
          {/*display: "inline-block",*/}
          {/*backgroundColor: "rgba(255, 255, 255, 0.1)",*/}
          {/*// backgroundColor: "red",*/}
          {/*transition: "background 0.2s",*/}
          {/*transform: "skew(-10deg)",*/}
          {/*width: this.state.loadWidth,*/}
          {/*height: "100%",*/}
          {/*position: "absolute",*/}
          {/*borderRadius: 3,*/}
          {/*bottom: 0,*/}
          {/*left: 0*/}
          {/*// height: "100%"*/}
          {/*}}*/}
          {/*/>*/}
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
            {/*<span style={{ marginLeft: 10, color: "#a4a4a4", fontSize: 12 }}>*/}
            {/*{tag ? tag.tf : ""}*/}
            {/*</span>*/}
          </div>
        </a>
      </div>
    );
  }
}
