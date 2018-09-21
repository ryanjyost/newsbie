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
import FrontPageSearch from "./components/pages/FrontPageSearch";
import Sources from "./components/pages/Sources";
import UserAuthPage from "./components/pages/UserAuthPage";
import SingleSource from "./components/pages/SingleSource";
import TopNews from "./components/pages/TopNews";
import Chyrons from "./components/pages/Chyrons";
import { withRouter } from "react-router";
import { ic_menu } from "react-icons-kit/md/ic_menu";
import { ic_close } from "react-icons-kit/md/ic_close";
import { Icon } from "react-icons-kit";
import ReactGA from "react-ga";
import store from "store";

//=========================================
import ArticlesOld from "./components/pages/ArticleSearch";
import Articles from "./components/pages/Articles";

import { Layout, Menu, Icon as AntIcon } from "antd";
const { Header, Content, Footer, Sider } = Layout;
//=========================================

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   menuOpen: false
    // };
  }

  render() {
    const { menuOpen, location } = this.props;
    let title = "";
    if (menuOpen) {
      title = "Menu";
    } else {
      switch (location.pathname) {
        case "/":
          title = "newsbie";
          break;
        case "/articles":
          title = "Articles";
          break;
        case "/front_pages":
          title = "Front Pages";
          break;
        case "/sources":
          title = "Sources";
          break;
        case "/chyrons":
          title = "Chyrons";
          break;
        case "/top_news":
          title = "Top News";
          break;
        default:
          break;
      }
    }

    if (title === "") {
      if (location.pathname.includes("/sources/")) {
        title = "Source Report";
      }
    }

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
              width: 100
            }}
            onClick={() => window.scrollTo(0, 0)}
          >
            <img src={"/images/ms-icon-310x310.png"} height={30} width={30} />
            <span
              style={{
                textDecoration: "none",
                fontSize: 10,
                color: "rgba(0,0,0,0.5)",
                marginLeft: 3
              }}
            >
              beta
            </span>
          </Link>
          <div
            onClick={() => window.scrollTo(0, 0)}
            style={{ fontSize: 14, cursor: "pointer" }}
          >
            {title}
          </div>
          <div
            style={{
              cursor: "pointer",
              width: 100,
              display: "flex",
              justifyContent: "flex-end"
            }}
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
        {menuOpen ? <ToolMenu user={this.props.user} /> : null}
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
      screenWidth: 0,
      user: null,
      collapsed: true
    };
  }

  componentDidMount() {
    this.updateDimensions();

    let user = store.get("user");
    if (user) {
      this.setState({ user });
    }

    window.addEventListener(
      "resize",
      this.throttle(this.updateDimensions.bind(this), 200)
    );

    this.initReactGA();
  }

  initReactGA() {
    ReactGA.initialize("UA-97014671-5");
    ReactGA.pageview(window.location.pathname + window.location.search);
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

  updateUser(user) {
    console.log("update");
    this.setState({ user });
    store.set("user", user);
  }

  render() {
    const { user, screenWidth, collapsed } = this.state;

    const renderSidebar = () => {
      return (
        <Sider
          // collapsedWidth={0}
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            backgroundColor: "#fff",
            zIndex: 10000000
          }}
        >
          <Link
            to={"/"}
            style={{
              fontSize: 16,
              cursor: "pointer",
              marginLeft: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 64
            }}
            onClick={() => window.scrollTo(0, 0)}
          >
            <img src={"/images/ms-icon-310x310.png"} height={30} width={30} />
            <span
              style={{
                textDecoration: "none",
                fontSize: 10,
                color: "rgba(0,0,0,0.5)",
                marginLeft: 3
              }}
            >
              beta
            </span>
          </Link>
          <Menu mode="inline" defaultSelectedKeys={["4"]}>
            <Menu.Item key="1">
              <AntIcon type="user" />
              <span className="nav-text">nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <AntIcon type="video-camera" />
              <span className="nav-text">nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <AntIcon type="upload" />
              <span className="nav-text">nav 3</span>
            </Menu.Item>
            <Menu.Item key="4">
              <AntIcon type="bar-chart" />
              <span className="nav-text">nav 4</span>
            </Menu.Item>
            <Menu.Item key="5">
              <AntIcon type="cloud-o" />
              <span className="nav-text">nav 5</span>
            </Menu.Item>
            <Menu.Item key="6">
              <AntIcon type="appstore-o" />
              <span className="nav-text">nav 6</span>
            </Menu.Item>
            <Menu.Item key="7">
              <AntIcon type="team" />
              <span className="nav-text">nav 7</span>
            </Menu.Item>
            <Menu.Item key="8">
              <AntIcon type="shop" />
              <span className="nav-text">nav 8</span>
            </Menu.Item>
          </Menu>
        </Sider>
      );
    };

    return (
      <Router>
        <Layout>
          {renderSidebar()}
          <Layout>
            <Header style={{ background: "#fff", padding: 0 }}>
              <AntIcon
                style={{ marginLeft: collapsed ? 100 : 210, cursor: "pointer" }}
                className="trigger"
                type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                onClick={() =>
                  this.setState({ collapsed: !this.state.collapsed })
                }
              />
            </Header>
            <Content>
              {!this.state.collapsed && (
                <div
                  onClick={() => this.setState({ collapsed: true })}
                  style={{
                    height: "100vh",
                    width: "100%",
                    position: "absolute",
                    top: 0,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    zIndex: 10000
                  }}
                />
              )}
              {!user ? (
                <Route
                  render={props => (
                    <UserAuthPage
                      {...props}
                      user={user}
                      updateUser={user => {
                        this.updateUser(user);
                      }}
                    />
                  )}
                />
              ) : (
                <Switch>
                  {/*<Route exact path="/" component={Landing} />*/}
                  {/*<Route path="/demo" component={App} />*/}
                  <Route
                    path="/"
                    exact
                    render={props => (
                      <Dashboard
                        {...props}
                        user={user}
                        updateUser={user => {
                          this.setState({ user });
                        }}
                      />
                    )}
                  />
                  <Route
                    path="/articles"
                    render={props => <Articles {...props} />}
                  />
                  <Route
                    path="/old/articles"
                    render={props => <ArticlesOld {...props} />}
                  />
                  <Route
                    path="/front_pages"
                    render={props => <FrontPageSearch {...props} />}
                  />
                  <Route
                    path="/sources"
                    exact
                    render={props => <Sources {...props} />}
                  />
                  <Route
                    path="/sources/:source"
                    render={props => <SingleSource {...props} />}
                  />
                  <Route
                    path="/chyrons"
                    render={props => <Chyrons {...props} />}
                  />
                  <Route
                    path="/top_news"
                    render={props => <TopNews {...props} />}
                  />
                  <Route path="/old/landing" component={Landing} />
                  <Route component={Dashboard} />
                </Switch>
              )}
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default MainRouter;
