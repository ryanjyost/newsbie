import React, { Component } from "react";
import {
  LineChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  BarChart,
  Bar
} from "recharts";

export default class TermBarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { styles, barGraphData } = this.props;
    let ticks = this.props.barGraphData.map(item => {
      return item.term;
    });

    class Tick extends Component {
      render() {
        const { x, y, stroke, payload, value } = this.props;
        return (
          <text
            x={x}
            y={y + 5}
            // height={30}
            // width={120}
            className="recharts-text recharts-cartesian-axis-tick-value"
            fill="rgba(0,0,0,0.5)"
            textAnchor={"end"}
          >
            <tspan>{payload.value}</tspan>
          </text>
        );
      }
    }

    return (
      <BarChart
        width={Math.min(
          500 - (25 * 2 + 30),
          styles.screenWidth - (25 * 2 + 30)
        )}
        height={300}
        data={barGraphData}
        ticks={ticks}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        barCategoryGap={"20%"}
        layout={"vertical"}
        stroke={"rgba(0,0,0,0.4)"}
        barSize={20}
      >
        {/*<CartesianGrid strokeDasharray="3 3" />*/}
        <XAxis
          type={"number"}
          stroke={"rgba(0,0,0,0.3)"}
          axisLine={{ stroke: "#f2f2f2" }}
          tickLine={{ stroke: "#f2f2f2" }}
          tickFormatter={tick => {
            return `${(Number(tick) * 100).toFixed(0)}%`;
          }}
        />
        <Bar dataKey="percentage" fill="#B8E8FF" stroke={"transparent"} />
        <YAxis
          width={120}
          tickSize={10}
          tickLine={{ stroke: "transparent" }}
          stroke={"rgba(0,0,0,0.4)"}
          type="category"
          dataKey="term"
          axisLine={{ stroke: "transparent" }}
          mirror
          orientation={"right"}
          tick={<Tick />}
        />
      </BarChart>
    );
  }
}
