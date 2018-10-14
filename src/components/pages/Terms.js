import React, { Component } from "react";
import axios from "axios/index";
import _ from "lodash";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
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
              return (
                <Link
                  key={i}
                  to={`/app/terms/${tag.term.replace(" ", "-")}`}
                  className={"hoverUnderline"}
                  style={{
                    fontSize: 30,
                    margin: 5,
                    display: "inline-block",
                    border: "1px solid #d8d8d8",
                    borderRadius: 3,
                    padding: "0px 5px"
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
