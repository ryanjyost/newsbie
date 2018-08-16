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
        href={record.site.url}
        key={record.id}
        style={{
          margin: "0px 10px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.12)",
          border: "1px solid #f2f2f2",
          borderRadius: 5
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
