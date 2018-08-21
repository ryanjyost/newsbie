import React, { Component } from "react";
import {
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
  LineSeries
} from "react-vis";
import moment from "moment";

export default class FrequencyLineGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: []
    };
  }

  componentDidMount() {
    let data = this.props.data;

    let graphData = data
      .sort((a, b) => {
        if (moment(a.created_at).isAfter(moment(b.created_at))) {
          return 1;
        } else if (moment(b.created_at).isAfter(moment(a.created_at))) {
          return -1;
        } else {
          return 0;
        }
      })
      .map((batch, i) => {
        // console.log(i, batch.created_at);
        if (batch) {
          let yVal = batch.tags.find(item => {
            return item.term === this.props.tag.term;
          });

          let dur = moment.duration(moment().diff(moment(batch.created_at)));
          let xVal = dur.asHours();

          return {
            x: -xVal,
            y: yVal ? yVal.sourceCount / batch.sourceCount : 0
          };
        } else {
          return {
            x: 0,
            y: ""
          };
        }
      });

    this.setState({ graphData });
  }

  render() {
    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {" "}
        <XYPlot
          width={Math.min(
            this.props.styles.screenWidth - 50,
            this.props.styles.maxWidth - 50
          )}
          height={150}
          style={{ strokeWidth: 1, marginLeft: 0, paddingTop: 10 }}
        >
          <VerticalGridLines />
          <HorizontalGridLines hideLine />
          <XAxis
            style={{
              line: { stroke: "rgba(0,0,0,0.2)" },
              ticks: { stroke: "rgba(0,0,0,0.4)" },
              text: {
                stroke: "none",
                fill: "rgba(0,0,0,0.8)",
                fontWeight: 300,
                fontSize: 8
              }
            }}
            tickValues={[-24, -12, -1]}
            tickFormat={v => `${-v} hour${v === -1 ? "" : "s"} ago`}
          />
          <YAxis
            hideLine
            tickFormat={v => `${(v * 100).toFixed()}%`}
            style={{
              line: { stroke: "rgba(0,0,0,0)" },
              ticks: { stroke: "rgba(0,0,0,0)" },
              text: {
                stroke: "none",
                fill: "rgba(0,0,0,0.7)",
                fontWeight: 300,
                fontSize: 8
              }
            }}
          />
          <LineSeries data={this.state.graphData} />
        </XYPlot>
      </div>
    );
  }
}
