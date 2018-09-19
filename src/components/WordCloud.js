import React, { Component } from "react";
import { ic_close } from "react-icons-kit/md/ic_close";
import { mean, standardDeviation, zScore, median } from "simple-statistics";
import shuffle from "shuffle-array";

export default class WordCloud extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mean: 0,
      sd: 0,
      list: []
    };
  }

  componentDidMount() {
    const values = this.props.list.map(item => {
      return this.props.calcValue(item);
    });

    const avg = mean(values);
    const sd = standardDeviation(values);
    const list = this.props.shuffle
      ? shuffle(this.props.list)
      : this.props.list;
    this.setState({ mean: avg, sd: sd, list });
  }

  render() {
    const { list } = this.state;

    const randomColor = ranges => {
      const getRandom = ({ max, min }) => {
        let random = Math.random() * (max - min) + min;
        console.log();
        return random;
      };
      return `rgba(${Math.floor(getRandom(ranges[0]))}, ${Math.floor(
        getRandom(ranges[1])
      )}, ${Math.floor(getRandom(ranges[2]))}, ${getRandom(ranges[3])})`;
    };

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {list.map((tag, i) => {
          const val = zScore(
            this.props.calcValue(tag),
            this.state.mean,
            this.state.sd
          );
          let url = tag ? tag.term.replace(/ /g, "+") : "";
          return (
            <a
              className={"wordCloudLink"}
              key={i}
              href={`https://en.wikipedia.org/w/index.php?search=${url}&title=Special:Search&fulltext=1`}
              style={{
                padding: 2,
                color: randomColor([
                  { min: 60, max: 82 },
                  { min: 100, max: 121 },
                  { min: 120, max: 145 },
                  { min: 0.5, max: 1 }
                ]),
                fontSize: Math.max(
                  Math.min(20 + val * 10, this.props.maxFontSize || 30),
                  this.props.minFontSize || 12
                ),
                textAlign: "center"
              }}
            >
              {tag.term}
            </a>
          );
        })}
      </div>
    );
  }
}
