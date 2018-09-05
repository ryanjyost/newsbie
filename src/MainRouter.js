import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";
import App from "./App";
import Landing from "./components/Landing";
import ToolMenu from "./components/ToolMenu";
import Dashboard from "./components/pages/Dashboard";
import Articles from "./components/pages/ArticleSearch";
import FrontPageSearch from "./components/pages/FrontPageSearch";
import Sources from "./components/pages/Sources";
import SingleSource from "./components/pages/SingleSource";
import { withRouter } from "react-router";

import { ic_menu } from "react-icons-kit/md/ic_menu";
import { ic_close } from "react-icons-kit/md/ic_close";
import { search } from "react-icons-kit/fa/search";
import { newspaperO } from "react-icons-kit/fa/newspaperO";
import { Icon } from "react-icons-kit";
import sources from "./sources";
import SourceCloud from "./components/SourceCloud";

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   menuOpen: false
    // };
  }

  render() {
    const { menuOpen } = this.props;

    return (
      <div
        className={"overlay"}
        style={{
          height: menuOpen ? "" : 40,
          backgroundColor: "rgba(255, 255, 255, 1)",
          borderBottom: "1px solid #e5e5e5",
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: menuOpen ? "flex-start" : "center",
          flexDirection: "column",
          letterSpacing: "0.02em",
          // padding: "0px 20px",
          // boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          position: "fixed",
          top: 0,
          zIndex: 100,
          overflow: "hidden"
        }}
        // onClick={() => window.scrollTo(0, 0)}
      >
        <div
          style={{
            height: 55,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            letterSpacing: "0.02em",
            maxWidth: 900,
            margin: "auto"
            // padding: "0px 20px",
            // boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            // position: "fixed",
            // top: 0,
            // zIndex: 100,
          }}
          // onClick={() => window.scrollTo(0, 0)}
        >
          <Link
            to={"/"}
            style={{
              fontSize: 16,
              cursor: "pointer",
              marginLeft: 10,
              display: "flex",
              alignItems: "center"
            }}
            onClick={() => window.scrollTo(0, 0)}
          >
            <img src={"/images/ms-icon-310x310.png"} height={30} width={30} />
          </Link>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              this.props.updateState("menuOpen", !menuOpen);
            }}
          >
            <Icon
              style={{
                marginRight: 10,
                color: "rgba(0,0,0,0.4)"
              }}
              icon={menuOpen ? ic_close : ic_menu}
              size={26}
            />
          </div>
        </div>
        {menuOpen ? <ToolMenu /> : null}
      </div>
    );
  }
}

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
      this.props.updateState("menuOpen", false);
    }
  }

  render() {
    return this.props.children;
  }
}

const ScollToTopWithRouter = withRouter(ScrollToTop);

const TopBarWithRouter = withRouter(TopBar);

class MainRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      screenWidth: 0
    };
  }

  componentDidMount() {
    this.updateDimensions();

    window.addEventListener(
      "resize",
      this.throttle(this.updateDimensions.bind(this), 200)
    );
  }

  updateDimensions() {
    let screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    // let update_height = Math.round(update_width)

    this.setState({ screenWidth: screenWidth, screenHeight: screenHeight });
  }

  throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  render() {
    return (
      <Router>
        <div>
          <ScollToTopWithRouter
            updateState={(key, value) => this.setState({ [key]: value })}
          >
            <TopBarWithRouter
              updateState={(key, value) => this.setState({ [key]: value })}
              menuOpen={this.state.menuOpen}
            />
            <div>
              <Switch>
                {/*<Route exact path="/" component={Landing} />*/}
                {/*<Route path="/demo" component={App} />*/}
                <Route path="/" exact component={Dashboard} />
                <Route path="/articles" component={Articles} />
                <Route path="/front_pages" component={FrontPageSearch} />
                <Route path="/sources" exact component={Sources} />
                <Route path="/sources/:source" component={SingleSource} />
                <Route path="/old/landing" component={Landing} />
                <Route component={Dashboard} />
              </Switch>
            </div>
          </ScollToTopWithRouter>
        </div>
      </Router>
    );
  }
}

export default MainRouter;
