import React, { Component } from "react";
import $ from "jquery";
import Icon from "react-icons-kit";
import { wikipediaW } from "react-icons-kit/fa/wikipediaW";
import { frownO } from "react-icons-kit/fa/frownO";

export default class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      popoverOpacity: 0,
      wiki: [null, null, null, null, null, null, null, null, null],
      noResults: false
    };

    this.timeoutIn = null;
    this.timeoutOut = null;
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
        console.log(data);
        this.setState({
          wiki: data.query.search,
          noResults: data.query.searchinfo.totalhits === 0
        });
        // if(data.query.search)
      }.bind(this),
      error: function(jqXhr, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  }

  handleMouseOver() {
    clearTimeout(this.timeoutOut);
    this.timeoutOut = null;

    this.timeoutIn = setTimeout(
      function() {
        this.setState({ hover: true });
        this.fetchWiki();
      }.bind(this),
      500
    );
  }

  handleMouseOverPopover() {
    clearTimeout(this.timeoutOut);
    this.timeoutOut = null;
    this.setState({ hover: true });
  }

  handleMouseOut() {
    this.timeoutOut = setTimeout(
      function() {
        this.setState({ hover: false });
        clearTimeout(this.timeoutIn);
        this.timeoutIn = null;
      }.bind(this),
      200
    );
  }

  render() {
    const { tag, i } = this.props;
    const { hover } = this.state;

    const Popover = () => {
      return (
        <div
          key={i}
          style={{
            height: 200,
            width: 200,
            position: "absolute",
            top: "-199px",
            borderRadius: 5,
            left: "-20px",
            backgroundColor: "#527991",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow:
              "0 3px 6px rgba(255,255,255,0.08), 0 3px 6px rgba(255,255,255,0.12)"
          }}
          onMouseOver={() => {
            this.handleMouseOverPopover();
          }}
          onMouseOut={() => this.handleMouseOut()}
        >
          {this.state.noResults ? (
            <div
              style={{
                textAlign: "center",
                padding: "50px 20px 0px 20px",
                display: "block",
                color: "rgba(255, 255, 255, 0.4)"
              }}
            >
              <Icon style={{ margin: "auto" }} icon={frownO} size={50} /> <br />
              <div>Bummer... we couldn't find anything on Wikipedia.</div>
            </div>
          ) : (
            <div
              className={"noScrollBar"}
              style={{
                overflow: "auto",
                height: 200,
                width: 200,
                position: "relative"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: 12,
                  padding: "8px 0px",
                  backgroundColor: "rgba(33, 58, 73, 0.6)",
                  color: "rgba(255, 255, 255, 0.5)",
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
                  marginBottom: 10
                }}
              >
                <Icon style={{ marginRight: 5 }} icon={wikipediaW} />
                <span>
                  {this.state.wiki[0]
                    ? "Related Wikipedia Entries"
                    : "Searching Wikipedia... "}
                </span>
              </div>

              {this.state.wiki.map((item, i) => {
                if (item) {
                  let url = item.title.replace(/ /g, "_");
                  return (
                    <a
                      href={`https://en.wikipedia.org/wiki/${url}`}
                      className={"wikiResultLink"}
                      key={i}
                      style={{
                        padding: "5px 10px",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
                        display: "block",
                        fontSize: 11
                      }}
                    >
                      {item.title}
                    </a>
                  );
                } else {
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "5px 10px",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
                        display: "block",
                        fontSize: 11
                      }}
                    >
                      <div
                        style={{
                          width: 20 + 50 * Math.random(),
                          height: 11,
                          backgroundColor: "rgba(255, 255, 255," + " 0.3)"
                        }}
                      />
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      );
    };

    return (
      <div key={i} style={{ position: "relative" }}>
        {hover && Popover()}
        <div
          onMouseOver={() => {
            if (tag) {
              this.handleMouseOver();
            }
          }}
          onMouseOut={() => {
            if (tag) {
              this.handleMouseOut();
            }
          }}
          className={"hoverBtn"}
          style={{
            border: "0px solid rgba(255, 255, 255, 0)",
            fontSize: "20px",
            borderRadius: 9999,
            margin: "5px 5px",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 12px",
            width: tag ? "auto" : 50 + 100 * Math.random(),
            height: tag ? "auto" : 30
            // backgroundColor: "rgba(255,255,255,0.9)"
            // flex: "1 1 80px"
          }}
        >
          {tag ? tag.term : ""}
        </div>
      </div>
    );
  }
}
