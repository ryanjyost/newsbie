import React, { Component } from "react";
import shuffle from "shuffle-array";
import "./App.css";
import axios from "axios";
import TwitterLogin from "react-twitter-auth";

class App extends Component {
  constructor(props) {
    super(props);

    this.list = [
      "FDRLST",
      "DailyCaller",
      "cnnbrk",
      "bpolitics",
      "HuffPost",
      "WSJ",
      "WashTimes",
      "USATODAY",
      "NewYorker",
      "thehill",
      "abcnews",
      "guardian",
      "TIME",
      "BBCBreaking",
      "politico",
      "thedailybeast",
      "voxdotcom",
      "newrepublic",
      "Reuters",
      "CBSNews",
      "FoxNews",
      "NRO",
      "Slate",
      "nypost",
      "latimes",
      "MSNBC",
      "nytimes",
      "TheAtlantic"
    ];

    this.state = {
      list: shuffle(this.list)
    };
  }

  onSuccess(response) {
    response.json().then(body => {
      alert(JSON.stringify(body));
    });
  }

  onFailed(error) {
    alert(error);
  }

  login() {
    axios
      .get("http://localhost:8000/login")
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const width = 400;
    const margin = 10;
    const menuHeight = 40;

    const Feed = ({ handle }) => {
      return (
        <div
          className={"singleFeed"}
          style={{
            margin: `0px ${margin}px`,
            height: `calc(100vh - ${menuHeight + 35}px)`,
            overflowY: "auto",
            // border: "1px solid #f2f2f2",
            // borderRadius: 6,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            width: width,
            position: "relative"
          }}
        >
          <div style={{ position: "absolute", zIndex: -1 }}>
            eonfa;lsdjnaf;lsdn
          </div>
          <a
            className="twitter-timeline"
            // style={}
            href={`https://twitter.com/@${handle}`}
            data-width={`${width}`}
          />
        </div>
      );
    };

    return (
      <div
        style={{
          backgroundColor: "rgba(230, 236, 240, 1)",
          height: "100vh",
          overflowX: "hidden"
        }}
      >
        <div
          style={{
            width: "100%",
            height: menuHeight,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            marginBottom: 10,
            display: "flex",
            alignItems: "center"
          }}
        >
          <div style={{ padding: "0px 20px", color: "rgba(255,255,255,0.8)" }}>
            newsbie.io <button onClick={() => this.login()}>LOGIN</button>
            <TwitterLogin
              loginUrl="http://localhost:8000/auth/twitter"
              onFailure={() => this.onFailed()}
              onSuccess={() => this.onSuccess()}
              requestTokenUrl="http://localhost:8000/auth/twitter"
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            width: "100%",
            overflow: "scroll"
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              width: this.state.list.length * (width + margin * 2) + 40,
              paddingBottom: 10
            }}
          >
            {this.state.list.map(item => {
              return <Feed handle={item} key={item} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
