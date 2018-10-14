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
import { Card } from "antd";
import axios from "axios/index";

export default class TrendTimelines extends Component {
  constructor(props) {
    super(props);
    this.state = { batches: [] };
  }

  componentDidMount() {
    axios
      .get("https://birds-eye-news-api.herokuapp.com/trend_timelines", {
        Accept: "application/json"
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          batches: res.data.batches
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return <div>hey</div>;
  }
}
