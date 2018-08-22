import React, { Component } from "react";
import Loader from "./Loader";

export default class SectionWithLoader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const sectionStyle = {
      border: this.props.noStyle ? null : "1px solid #e5e5e5",
      padding: 20,
      backgroundColor: "#fff",
      margin: this.props.noStyle ? 0 : "10px 10px",
      borderRadius: 3
    };

    const { isLoading, title } = this.props;

    return (
      <div style={{ ...sectionStyle, ...this.props.sectionStyle }}>
        <h5 style={{ margin: 0 }}>{title}</h5>
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
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <Loader loadingMessage={this.props.loadingMessage} />
          </div>
        )}
      </div>
    );
  }
}
