import React, { Component } from "react";
import axios from "axios";
import Loader from "../Loader";
import { Link } from "react-router-dom";

export default class Sources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: []
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8000/sources")
      .then(res => {
        let sorted = res.data.sources.sort((a, b) => {
          if (a.title.replace("The ", "") > b.title.replace("The ", "")) {
            return 1;
          } else if (
            b.title.replace("The ", "") > a.title.replace("The ", "")
          ) {
            return -1;
          } else {
            return 0;
          }
        });

        this.setState({ sources: sorted });
      })
      .catch(err => console.log(err));
  }

  render() {
    let baseURL = "https://d1dzf0mjm4jp11.cloudfront.net";

    if (!this.state.sources.length) {
      return (
        <div
          style={{
            display: "flex",
            height: "100vh",
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {" "}
          <Loader loaderHeight={500} loadingMessage={"loading sources"} />
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: "70px 0px 50px 0px"
          }}
        >
          <div style={{ marginBottom: 20 }}>
            Click a source to see its <strong>source report</strong>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: 900,
              paddingBottom: 20
            }}
          >
            {this.state.sources.map((source, i) => {
              return (
                <Link
                  key={i}
                  to={`/sources/${source.name}`}
                  style={{ margin: 10, padding: "2px 6px", borderRadius: 3 }}
                  className={"shadowHover"}
                >
                  <img
                    src={`https://d1dzf0mjm4jp11.cloudfront.net/logos/${
                      source.image
                    }`}
                    height={30}
                  />
                </Link>
              );
            })}
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(0,0,0,0.1)",
              paddingTop: 10,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              marginTop: 50,
              margin: "0px 20px"
            }}
          >
            Not seeing a source you want?<br />
            <a
              style={{ marginTop: 10 }}
              href={"mailto:ryanjyost@gmail.com?subject=New source for Newsbie"}
            >
              Email me about it
            </a>
          </div>
        </div>
      );
    }
  }
}
