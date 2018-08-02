import React, { Component } from "react";
import { Popover } from "react-bootstrap";
import $ from "jquery";
import Icon from "react-icons-kit";
import { wikipediaW } from "react-icons-kit/fa/wikipediaW";
import { frownO } from "react-icons-kit/fa/frownO";
import { ic_close } from "react-icons-kit/md/ic_close";

export default class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      popoverOpacity: 0,
      wiki: [null, null, null, null, null, null, null, null, null],
      noResults: false,
      loadWidth: 0
    };

    this.timeoutIn = null;
    this.timeoutOut = null;

    this.timer = null;
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

  handleMouseOverPopover() {
    this.setState({ hover: !this.state.hover });
    if (!this.state.wiki[0]) {
      this.fetchWiki();
    }
  }

  handleMouseOut() {
    this.setState({ hover: false });
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
            top: "-190px",
            borderRadius: 5,
            left: "-20px",
            backgroundColor: "#527991",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow:
              "0 3px 6px rgba(255,255,255,0.08), 0 3px 6px rgba(255,255,255,0.12)"
          }}

          // onMouseLeave={() => this.handleMouseOut()}
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
                  justifyContent: "space-between",
                  textAlign: "center",
                  fontSize: 12,
                  padding: "8px 10px",
                  backgroundColor: "rgba(33, 58, 73, 0.6)",
                  color: "rgba(255, 255, 255, 0.5)",
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
                  marginBottom: 10
                }}
              >
                <Icon style={{ marginRight: 5 }} icon={wikipediaW} />
                <span>
                  {this.state.wiki[0] ? "Learn more" : "Searching ... "}
                </span>
                <Icon
                  onClick={() => {
                    this.handleMouseOut();
                    this.props.updateCurrentTag(null);
                  }}
                  style={{ marginLeft: 5, cursor: "pointer" }}
                  icon={ic_close}
                />
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
          {/*<div*/}
          {/*style={{*/}
          {/*width: 0,*/}
          {/*height: 0,*/}
          {/*borderStyle: "solid",*/}
          {/*borderWidth: "30px 30px 0 30px",*/}
          {/*borderColor: "#007bff transparent transparent transparent"*/}
          {/*}}*/}
          {/*/>*/}
        </div>
      );
    };

    return (
      <div key={i} style={{ position: "relative" }}>
        {hover && Popover()}
        <div
          onClick={() => {
            if (tag) {
              this.handleMouseOverPopover();
            }
          }}
          className={"hoverBtn"}
          style={{
            border: "0px solid rgba(255, 255, 255, 0)",
            fontSize: "20px",
            borderRadius: 3,
            margin: "5px 5px",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 12px",
            width: tag ? "auto" : 50 + 100 * Math.random(),
            height: tag ? "auto" : 30,
            // backgroundColor: "rgba(255,255,255,0.9)"
            // flex: "1 1 80px",
            display: "inline-block",
            transition: "background 0.2s",
            transform: "skew(-20deg)" /* SKEW */
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
              display: "inline-block",
              transition: "background 0.2s",
              transform: "skew(20deg)" /* SKEW */
            }}
          >
            {tag ? tag.term : ""}
          </div>
        </div>
      </div>
    );
  }
}
