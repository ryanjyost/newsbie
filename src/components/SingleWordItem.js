import React, { Component } from "react";
import { wikipedia } from "react-icons-kit/icomoon/wikipedia";
import { Icon } from "react-icons-kit";
import { Progress } from "antd";
import { Icon as AntIcon } from "antd";

export default class SingleWordItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { tag, isSmall } = this.props;
    let wikiUrl = tag ? tag.term.replace(/ /g, "+") : "";

    const renderLinks = () => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "rgba(0, 0, 0, 0.25)"
          }}
        >
          <a
            style={{ marginRight: 5 }}
            target="_blank"
            href={`http://www.google.com/search?q=${wikiUrl}`}
          >
            <AntIcon type="google" size={20} />
          </a>
          <a
            style={{
              display: "flex",
              marginRight: 5
            }}
            target="_blank"
            href={`https://en.wikipedia.org/w/index.php?search=${wikiUrl}&title=Special:Search&fulltext=1`}
          >
            <Icon icon={wikipedia} size={20} />
          </a>
          <a target="_blank" href={`https://twitter.com/search?q=${wikiUrl}`}>
            <AntIcon type="twitter" size={20} />
          </a>
        </div>
      );
    };

    const renderPercentageChange = () => {
      return (
        <div
          style={{
            width: isSmall ? 40 : 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: "bold",
              color:
                this.props.mainValue > 0
                  ? "rgb(135, 208, 104)"
                  : "rgb(255, 85, 0)"
            }}
          >
            {this.props.mainValue > 0 && <AntIcon type="caret-up" size={20} />}
            {`${Math.abs(this.props.mainValue)}%`}
            {this.props.mainValue <= 0 && (
              <AntIcon type="caret-down" size={20} />
            )}
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          margin: 5,
          display: "flex",
          alignItems: isSmall ? "center" : "stretch",
          padding: 10,
          border: "1px solid rgba(0,0,0,0.02)",
          backgroundColor: "rgba(240,242,245,0.15)"
        }}
      >
        <div>
          {this.props.isPercentageChange ? (
            renderPercentageChange()
          ) : (
            <Progress
              style={{ color: this.props.color || "#1890ff" }}
              type="circle"
              percent={Number(this.props.mainValue)}
              width={isSmall ? 40 : 60}
            />
          )}
        </div>
        <div style={{ padding: "0px 10px" }}>
          <div
            style={{
              fontSize: isSmall ? 16 : 20,
              color: "rgba(0,0,0,0.75)",
              fontWeight: "500"
            }}
          >
            {tag.term}
          </div>
          {this.props.isPercentageChange ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                color: "rgba(0,0,0,0.3)",
                fontSize: 12
              }}
            >
              <span>{`${this.props.compValPrev}%`}</span>
              <span style={{ margin: "0px 5px" }}>&rarr;</span>
              <span
                style={{ fontWeight: "bold", color: "rgba(0,0,0,0.6)" }}
              >{`${this.props.compValMain}%`}</span>
              <span style={{ color: "rgba(0,0,0,0.2)", marginLeft: 4 }}>
                now
              </span>
            </div>
          ) : !isSmall ? (
            renderLinks()
          ) : null}
        </div>
      </div>
    );
  }
}
