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
import Dashboard from "./components/pages/Dashboard";
import Articles from "./components/pages/ArticleSearch";
import FrontPageSearch from "./components/pages/FrontPageSearch";
import Sources from "./components/pages/Sources";
import SingleSource from "./components/pages/SingleSource";
import { withRouter } from "react-router";

import { ic_menu } from "react-icons-kit/md/ic_menu";
import { ic_close } from "react-icons-kit/md/ic_close";
import { search } from "react-icons-kit/fa/search";
import { Icon } from "react-icons-kit";

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
  }
  render() {
    const { menuOpen } = this.state;

    const renderTools = () => {
      const SingleTool = ({ link, title, desc, icon }) => {
        return (
          <Link
            style={{
              padding: "10px 20px",
              textDecoration: "none",
              display: "inline-block",
              margin: 10,
              width: 300
              // flexDirection: "column",
              // alignItems: "center"
            }}
            className={"shadow shadowHover"}
            to={link}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                // flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Icon
                style={{
                  marginRight: 10,
                  color: "rgba(46, 228, 246,1)"
                }}
                icon={icon}
                size={34}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  justifyContent: "center",
                  marginLeft: 10
                }}
              >
                <span style={{ fontSize: 14 }}>
                  <strong>{title}</strong>
                </span>
                <span style={{ fontSize: 12, color: "rgba(0,0,0,0.7)" }}>
                  {desc}
                </span>
              </div>
            </div>
          </Link>
        );
      };
      return (
        <div
          className={"overlay-content"}
          style={{
            width: "100%",
            padding: "100px 0px 50px 0px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center"
            // height: "100vh",
            // backgroundColor: "rgba(0,0,0,0.02)"
          }}
        >
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
          <SingleTool
            link={"/articles"}
            title={"Article Finder"}
            desc={
              "Search + filter hundreds of articles from dozens of" +
              " sources."
            }
            icon={search}
          />
        </div>
      );
    };

    return (
      <div
        className={"overlay"}
        style={{
          height: menuOpen ? "100vh" : 40,
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
            maxWidth: 900
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
              this.props.updateState(menuOpen, !this.state.menuOpen);
              this.setState({ menuOpen: !this.state.menuOpen });
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
        {menuOpen ? renderTools() : null}
      </div>
    );
  }
}

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
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
      menuOpen: false
    };
  }
  render() {
    return (
      <Router>
        <div>
          <ScollToTopWithRouter>
            <TopBarWithRouter
              updateState={(key, value) => this.setState({ [key]: value })}
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
