import React from "react";
import { Spin, Icon } from "antd";
import quotes from "../helpers/quotes";

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: null
    };
  }

  componentDidMount() {
    this.setState({ quote: quotes[Math.floor(Math.random() * quotes.length)] });
  }

  render() {
    const { quote } = this.state;
    const { loaderHeight } = this.props;

    const antIcon = (
      <Icon type="loading" style={{ fontSize: 40, color: "rgb(0,192,243)" }} />
    );

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: loaderHeight ? loaderHeight : 200,
          width: "100%",
          color: "rgba(0, 0, 0, 0.6)",
          fontSize: 18
        }}
      >
        {antIcon}
        {quote && (
          <div
            style={{
              marginTop: 20,
              fontSize: 14,
              padding: "20px",
              textAlign: "center",
              maxWidth: 400
            }}
          >
            <div>{quote.text}</div>
            <div style={{ marginTop: 10, fontWeight: "bold" }}>
              {quote.attr}
            </div>
          </div>
        )}
      </div>
    );
  }
}
