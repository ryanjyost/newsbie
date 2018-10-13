import React, { Component } from "react";
import axios from "axios/index";
import _ from "lodash";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { mean, standardDeviation, zScore } from "simple-statistics/index";
import SingleWordItem from "../SingleWordItem";
import { Card, Icon as AntIcon } from "antd";

export default class TermAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTags: [],
      mean: 0,
      sd: 0
    };
  }

  componentDidMount() {
    axios
      .get("https://birds-eye-news-api.herokuapp.com/terms_for_analysis", {
        Accept: "application/json"
      })
      .then(res => {
        this.setState({ topTags: res.data.terms });

        const values = res.data.terms.map(term => {
          return term.avg;
        });

        const avg = mean(values);
        const sd = standardDeviation(values);
        this.setState({ mean: avg, sd: sd });
        // let splitTags = _.partition(res.data.topTags, tag => {
        //   return tag.sourceCount / res.data.batches[0].sourceCount > 0.05;
        // });
        //
        // this.setState({
        //   topTags: splitTags[0].sort((a, b) => {
        //     if (a.sourceCount > b.sourceCount) {
        //       return -1;
        //     } else if (b.sourceCount > a.sourceCount) {
        //       return 1;
        //     } else {
        //       return 0;
        //     }
        //   })
        // });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.topTags.length < 1) {
      return (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Loader loaderHeight={"100vh"} />
        </div>
      );
    } else {
      return (
        <div style={{ padding: "100px 20px" }}>
          <Card style={{ display: "flex", flexWrap: "wrap" }}>
            {this.state.topTags.map((tag, i) => {
              const val = zScore(tag.avg, this.state.mean, this.state.sd);
              return (
                <Link
                  key={i}
                  to={`/app/terms/${tag.term.replace(" ", "-")}`}
                  className={"hoverUnderline"}
                  style={{
                    fontSize: Math.max(Math.min(20 + val * 10, 60 || 30), 12),
                    margin: 10
                  }}
                >
                  {tag.term}
                </Link>
              );
            })}
          </Card>
        </div>
      );
    }
  }
}
