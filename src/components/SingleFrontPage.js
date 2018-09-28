import React, { Component } from "react";

export default class SingleFrontPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { imageWidth, record } = this.props;
    return (
      <a
        // target={"_blank"}
        href={record.site ? record.site.url : ""}
        key={record.id}
        style={{
          // margin: "0px 10px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.4)",
          border: "1px solid #f2f2f2",
          borderRadius: 5,
          display: "block",
          height: imageWidth,
          width: imageWidth,
          // margin: "auto",
          backgroundColor: "#fcfcfc"
        }}
      >
        <img
          style={{ borderRadius: 5 }}
          height={imageWidth}
          width={imageWidth}
          src={`https://d1dzf0mjm4jp11.cloudfront.net/${record.image}`}
        />
      </a>
    );
  }
}
