import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";
import { withRouter } from "react-router";
import ReactGA from "react-ga";
import store from "store";
import detectIt from "detect-it";

import LandingOld from "./components/Landing";
import DashboardOld from "./components/pages/old/Dashboard";

import Landing from "./components/pages/Landing";
import Home from "./components/pages/Home";
import FrontPages from "./components/pages/FrontPages";
import Sources from "./components/pages/Sources";
import UserAuthPage from "./components/pages/UserAuthPage";
import SingleSource from "./components/pages/SingleSource";
import TopNews from "./components/pages/TopNews";
import Chyrons from "./components/pages/Chyrons";
import Articles from "./components/pages/ArticleSearch";
import Images from "./components/pages/Images";
import Trends from "./components/pages/Trends";

//=========================================

import { Layout, Menu, Icon as AntIcon, Button, Dropdown } from "antd";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Header, Content, Footer, Sider } = Layout;
//=========================================

function renderAuthRoute(Component, props, user, styles, updateUser) {
  if (user) {
    return <Component {...props} styles={styles} />;
  } else {
    return (
      <UserAuthPage
        {...props}
        styles={styles}
        updateUser={user => updateUser(user)}
      />
    );
  }
}

class MainRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      screenWidth: 0,
      user: true,
      collapsed: true,
      didMount: false,
      touchOnly: false,
      topMenuKey: null,
      currentPageRequiresAuth: false
    };
  }

  componentDidMount() {
    this.setState({ didMount: true });
    this.updateDimensions();

    let user = store.get("user");
    if (user) {
      this.setState({ user });
    }

    window.addEventListener(
      "resize",
      this.throttle(this.updateDimensions.bind(this), 200)
    );
    window.addEventListener("touchstart", this.touchStart);
    window.addEventListener("touchmove", this.preventTouch, { passive: false });

    this.initReactGA();

    this.setState({
      touchOnly: detectIt.deviceType === "touchOnly",
      currentPageRequiresAuth:
        window.location.pathname !== "/" && window.location.pathname !== "/app"
    });
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

  touchStart(e) {
    this.firstClientX = e.touches[0].clientX;
    this.firstClientY = e.touches[0].clientY;
  }

  updateUser(user) {
    this.setState({ user });
    store.set("user", user);
  }

  preventTouch(e) {
    const minValue = 5; // threshold

    this.clientX = e.touches[0].clientX - this.firstClientX;
    this.clientY = e.touches[0].clientY - this.firstClientY;

    // Vertical scrolling does not work when you start swiping horizontally.
    if (Math.abs(this.clientX) > minValue) {
      e.preventDefault();
      e.returnValue = false;
      return false;
    }
  }

  render() {
    const { user, screenWidth, collapsed, didMount } = this.state;
    let hideSidebar = screenWidth < 800;
    let isOpenWide = !hideSidebar && !collapsed;

    let styles = {
      screenWidth,
      hideSidebar,
      isOpenWide,
      collapsed,
      sidebarWidth: hideSidebar ? 0 : collapsed ? 80 : 200,
      touchOnly: this.state.touchOnly
    };

    const Sidebar = ({ location }) => {
      const activeKey = location.pathname || "";

      if (!location.pathname.includes("app")) {
        return null;
      } else {
        return (
          <Sider
            collapsedWidth={hideSidebar ? 0 : 80}
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              backgroundColor: "#FDFEFF",
              zIndex: 10000000
            }}
          >
            <Link
              to={"/app"}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: collapsed ? "center" : "flex-start",
                alignItems: "center",
                height: 64,
                paddingLeft: collapsed ? 0 : 15,
                borderRight: "1px solid #f2f2f2"
              }}
              onClick={() => {
                window.scrollTo(0, 0);
                this.handleNav("/app");
              }}
            >
              <img
                src={
                  collapsed
                    ? "https://d1dzf0mjm4jp11.cloudfront.net/newsbie-logo.png"
                    : "https://d1dzf0mjm4jp11.cloudfront.net/newsbie-logo-wide.png"
                }
                height={30}
                // width={collapsed ? 30 * (4571 / 1000)}
              />
            </Link>
            <Menu
              mode="inline"
              style={{ borderRight: "1px solid #e8e8e8" }}
              selectedKeys={[activeKey]}
              onSelect={item => {
                if (hideSidebar) {
                  this.setState({ collapsed: true });
                }
              }}
            >
              <Menu.Item key="/app" style={{ marginTop: 0 }}>
                <Link to={"/app"}>
                  <AntIcon type="home" />
                  <span className="nav-text">Overview</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/app/trends" style={{ marginTop: 0 }}>
                <Link to={"/app/trends"}>
                  <AntIcon type="line-chart" />
                  <span className="nav-text">Trends</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/app/term" style={{ marginTop: 0 }}>
                <Link to={"/app/term"}>
                  <AntIcon type="experiment" />
                  <span className="nav-text">Term Analysis</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/app/articles" style={{ marginTop: 0 }}>
                <Link to={"/app/articles"}>
                  <AntIcon type="read" />
                  <span className="nav-text">Articles</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/app/front_pages" style={{ marginTop: 0 }}>
                <Link to={"/app/front_pages"}>
                  <AntIcon type="block" />
                  <span className="nav-text">Front Pages</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/app/news_images" style={{ marginTop: 0 }}>
                <Link to={"/app/news_images"}>
                  <AntIcon type="picture" />
                  <span className="nav-text">Images</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
        );
      }
    };
    const SidebarWithRouter = withRouter(Sidebar);

    const HeaderNoRouter = ({ location }) => {
      let title = "";
      const routeMapping = {
        "/app": "Overview",
        "/app/articles": "Articles",
        "/app/front_pages": "Front Pages",
        "/app/news_images": "Images",
        "/app/trends": "Term Trends - Snapshot",
        "/app/term": "Term Analyzer"
      };

      if (location.pathname in routeMapping) {
        title = routeMapping[location.pathname];
      }

      if (location.pathname === "/") {
        const menu = (
          <Menu onClick={e => this.setState({ topMenuKey: e.key })}>
            <Menu.Item key="/pricing" style={{ marginTop: 0 }}>
              <Link to={"/pricing"}>
                <span className="nav-text">Pricing</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to={"/pricing"}>1st item</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to={"/pricing"}>1st item</Link>
            </Menu.Item>
          </Menu>
        );

        return (
          <Header
            style={{
              backgroundColor: "#FDFEFF",
              padding: 0,
              position: "fixed",
              zIndex: 8,
              width: "100%",
              borderBottom: "1px solid rgb(232, 232, 232)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ marginLeft: 20 }}>
              <img
                src={
                  screenWidth < 500
                    ? "https://d1dzf0mjm4jp11.cloudfront.net/newsbie-logo.png"
                    : "https://d1dzf0mjm4jp11.cloudfront.net/newsbie-logo-wide.png"
                }
                height={30}
                // width={collapsed ? 30 * (4571 / 1000)}
              />
            </div>

            <div
              style={{ marginLeft: 20, display: "flex", alignItems: "center" }}
            >
              <div style={{ marginRight: 20 }}>
                <Dropdown overlay={menu}>
                  <Button style={{ padding: "0px 15px" }}>
                    Menu <AntIcon type="down" />
                  </Button>
                </Dropdown>
              </div>
              <Button size={"small"} style={{ marginRight: 20 }}>
                <Link to="/app">Enter the App &rarr;</Link>
              </Button>
            </div>
          </Header>
        );
      } else {
        return (
          <Header
            style={{
              backgroundColor: "#FDFEFF",
              padding: 0,
              position: "fixed",
              zIndex: 100,
              width: "100%",
              borderBottom: "1px solid rgb(232, 232, 232)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <AntIcon
                style={{
                  marginLeft: hideSidebar ? 20 : collapsed ? 100 : 220,
                  cursor: "pointer"
                }}
                className="trigger"
                type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                onClick={() =>
                  this.setState({ collapsed: !this.state.collapsed })
                }
              />
              <h4 style={{ margin: "0px 0px 0px 10px" }}>{title}</h4>
            </div>
            {!hideSidebar && (
              <a
                style={{ display: "flex", alignItems: "center" }}
                target={"_blank"}
                href={
                  "https://join.slack.com/t/newsbie/shared_invite/enQtNDM4MzY3NTY4MzA2LWI2YzQzMTZjMmU4ZDdlZjk4NTJiYjc4OTBlZjY0N2UxMjIwMjk1YWM3YzI0OWM0MmYxNTE5MjkwYTc2YjFmZDY"
                }
              >
                <Button
                  size="small"
                  style={{ marginRight: 20, backgroundColor: "transparent" }}
                  type="default"
                >
                  <AntIcon type="slack" style={{ marginRight: 0 }} />Chat on
                  Slack
                </Button>
              </a>
            )}
          </Header>
        );
      }
    };
    const HeaderWithRouter = withRouter(HeaderNoRouter);

    if (!didMount) {
      return null;
    } else {
      return (
        <Router>
          <Layout>
            <SidebarWithRouter />
            <Layout>
              <HeaderWithRouter />
              <Content
                style={{
                  paddingLeft: styles.sidebarWidth,
                  position: "relative",
                  float: "left"
                }}
              >
                {!this.state.collapsed &&
                  hideSidebar && (
                    <div
                      onClick={() => this.setState({ collapsed: true })}
                      style={{
                        height: "100%",
                        width: "100%",
                        position: "absolute",
                        top: 0,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        zIndex: 10000
                      }}
                    />
                  )}

                <Switch>
                  <Route
                    path="/"
                    exact
                    render={props => {
                      if (user) {
                        return (
                          <Redirect
                            to={{
                              pathname: "/app",
                              state: { from: props.location }
                            }}
                          />
                        );
                      } else {
                        return (
                          <Landing {...props} {...this.state} styles={styles} />
                        );
                      }
                    }}
                  />
                  <Route
                    path="/app"
                    exact
                    render={props => (
                      <Home {...props} {...this.state} styles={styles} />
                    )}
                  />
                  <Route
                    path="/app/articles"
                    render={props =>
                      renderAuthRoute(
                        Articles,
                        props,
                        user,
                        styles,
                        this.updateUser.bind(this)
                      )
                    }
                  />
                  <Route
                    path="/app/front_pages"
                    render={props =>
                      renderAuthRoute(
                        FrontPages,
                        props,
                        user,
                        styles,
                        this.updateUser.bind(this)
                      )
                    }
                  />
                  <Route
                    path="/app/trends"
                    render={props =>
                      renderAuthRoute(
                        Trends,
                        props,
                        user,
                        styles,
                        this.updateUser.bind(this)
                      )
                    }
                  />
                  <Route
                    path="/app/news_images"
                    render={props =>
                      renderAuthRoute(
                        Images,
                        props,
                        user,
                        styles,
                        this.updateUser.bind(this)
                      )
                    }
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
                  <Route path="/old/landing" component={LandingOld} />
                  <Route path="/old/dashboard" component={DashboardOld} />
                  <Route
                    render={props => (
                      <Home
                        {...props}
                        {...this.state}
                        styles={styles}
                        updateUser={user => {
                          this.setState({ user });
                        }}
                      />
                    )}
                  />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Router>
      );
    }
  }
}

export default MainRouter;

//class TopBarOld extends React.Component {
//   constructor(props) {
//     super(props);
//     // this.state = {
//     //   menuOpen: false
//     // };
//   }
//
//   render() {
//     const { menuOpen, location } = this.props;
//     let title = "";
//     if (menuOpen) {
//       title = "Menu";
//     } else {
//       switch (location.pathname) {
//         case "/":
//           title = "newsbie";
//           break;
//         case "/articles":
//           title = "Articles";
//           break;
//         case "/front_pages":
//           title = "Front Pages";
//           break;
//         case "/sources":
//           title = "Sources";
//           break;
//         case "/chyrons":
//           title = "Chyrons";
//           break;
//         case "/top_news":
//           title = "Top News";
//           break;
//         default:
//           break;
//       }
//     }
//
//     if (title === "") {
//       if (location.pathname.includes("/sources/")) {
//         title = "Source Report";
//       }
//     }
//
//     return (
//       <div
//         className={"overlay"}
//         style={{
//           height: menuOpen ? "" : 40,
//           backgroundColor: "rgba(255, 255, 255, 1)",
//           borderBottom: "1px solid #e5e5e5",
//           width: "100%",
//           display: "flex",
//           alignItems: "flex-start",
//           justifyContent: menuOpen ? "flex-start" : "center",
//           flexDirection: "column",
//           letterSpacing: "0.02em",
//           // padding: "0px 20px",
//           // boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//           position: "fixed",
//           top: 0,
//           zIndex: 100,
//           overflow: "hidden"
//         }}
//         // onClick={() => window.scrollTo(0, 0)}
//       >
//         <div
//           style={{
//             height: 55,
//             backgroundColor: "rgba(255, 255, 255, 0.95)",
//             width: "100%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             letterSpacing: "0.02em",
//             maxWidth: 900,
//             margin: "auto"
//             // padding: "0px 20px",
//             // boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//             // position: "fixed",
//             // top: 0,
//             // zIndex: 100,
//           }}
//           // onClick={() => window.scrollTo(0, 0)}
//         >
//           <Link
//             to={"/"}
//             style={{
//               fontSize: 16,
//               cursor: "pointer",
//               marginLeft: 10,
//               display: "flex",
//               width: 100
//             }}
//             onClick={() => window.scrollTo(0, 0)}
//           >
//             <img src={"/images/ms-icon-310x310.png"} height={30} width={30} />
//             <span
//               style={{
//                 textDecoration: "none",
//                 fontSize: 10,
//                 color: "rgba(0,0,0,0.5)",
//                 marginLeft: 3
//               }}
//             >
//               beta
//             </span>
//           </Link>
//           <div
//             onClick={() => window.scrollTo(0, 0)}
//             style={{ fontSize: 14, cursor: "pointer" }}
//           >
//             {title}
//           </div>
//           <div
//             style={{
//               cursor: "pointer",
//               width: 100,
//               display: "flex",
//               justifyContent: "flex-end"
//             }}
//             onClick={() => {
//               this.props.updateState("menuOpen", !menuOpen);
//             }}
//           >
//             <Icon
//               style={{
//                 marginRight: 10,
//                 color: "rgba(0,0,0,0.4)"
//               }}
//               icon={menuOpen ? ic_close : ic_menu}
//               size={26}
//             />
//           </div>
//         </div>
//         {menuOpen ? <ToolMenu user={this.props.user} /> : null}
//       </div>
//     );
//   }
// }
//
// class TopBar extends React.Component {
//   render() {}
// }
//
// class ScrollToTop extends React.Component {
//   componentDidUpdate(prevProps) {
//     if (this.props.location !== prevProps.location) {
//       window.scrollTo(0, 0);
//       this.props.updateState("menuOpen", false);
//     }
//   }
//
//   render() {
//     return this.props.children;
//   }
// }
//
// const ScollToTopWithRouter = withRouter(ScrollToTop);
//
// const TopBarWithRouter = withRouter(TopBar);
