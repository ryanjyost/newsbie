import React, { Component } from "react";
import {
  AreaSeries,
  HorizontalBarSeries,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
  LineSeries
} from "react-vis";

export default class TopWordsChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { styles } = this.props;
    let data = this.props.topTags.map(tag => {
      if (tag) {
        return {
          x: tag.sourceCount / this.props.batchOfTags.sourceCount,
          y: tag.term
        };
      } else {
        return {
          x: 0,
          y: ""
        };
      }
    });

    let sorted = data.sort((a, b) => {
      if (a.x > b.x) {
        return 1;
      } else if (b.x > a.x) {
        return -1;
      } else {
        return 0;
      }
    });

    return (
      <div
        style={{
          display: "flex",
          width: "auto",
          overflowX: "scroll",
          overflowY: "hidden",
          padding: "10px 0px 0px 0px",
          marginLeft: -20,
          strokeWidth: 0
        }}
      >
        {data && (
          <XYPlot yType="ordinal" xType="linear" height={300} width={340}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <HorizontalBarSeries
              color={"rgba(46, 228, 246, 0.6)"}
              opacity={0.5}
              data={sorted.slice(data.length - 10)}
            />
            <YAxis
              left={250}
              style={{
                line: { stroke: "rgba(0,0,0,0)" },
                ticks: { stroke: "rgba(0,0,0,0)" },
                text: {
                  stroke: "none",
                  fill: "rgba(0,0,0,0.8)",
                  fontWeight: 400,
                  fontSize: 12
                }
              }}
            />
            <XAxis
              tickFormat={v => `${(v * 100).toFixed()}%`}
              style={{
                line: { stroke: "rgba(0,0,0,0)" },
                ticks: { stroke: "rgba(0,0,0,0)" },
                text: {
                  stroke: "none",
                  fill: "rgba(0,0,0,0.4)",
                  fontWeight: 300,
                  fontSize: 10
                }
              }}
            />
          </XYPlot>
        )}
      </div>
    );
  }
}
