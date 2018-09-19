import React, { Component } from "react";
import Loader from "./Loader";

export default class SectionWithLoader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const sectionStyle = {
      // border: this.props.noStyle ? null : "1px solid #e5e5e5",
      padding: 25,
      backgroundColor: "#fff",
      margin: this.props.noStyle ? 0 : "10px 10px",
      borderRadius: 3,
      position: "relative"
    };

    const { isLoading, title } = this.props;

    return (
      <div
        className={"shadow"}
        style={{ ...sectionStyle, ...this.props.sectionStyle }}
      >
        {title ? (
          <h5 style={{ margin: 0, marginBottom: 10, color: "rgba(0,0,0,0.5)" }}>
            {title}
          </h5>
        ) : null}
        {!isLoading ? (
          <div
            style={{
              ...{
                display: "flex",
                justifyContent: "stretch",
                alignItems: "center",
                flexDirection: "column"
              },
              ...this.props.divStyle
            }}
          >
            {this.props.children}
            {/*<div>sign up to dive deeper &rarr;</div>*/}
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <Loader
              loaderHeight={this.props.loaderHeight}
              loadingMessage={this.props.loadingMessage}
            />
          </div>
        )}
      </div>
    );
  }
}
