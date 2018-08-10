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
import { withRouter } from "react-router";

const TopBar = ({ location }) => {
  let isLanding = location.pathname === "/";
  return (
    <div
      style={{
        height: 60,
        backgroundColor: isLanding
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(33, 58, 73, 0.9)",
        borderBottom: isLanding
          ? "1px solid #e5e5e5"
          : "1px solid rgba(255, 255," + " 255, 0.1)",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        letterSpacing: "0.03em",
        position: "fixed",
        top: 0,
        zIndex: 100
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: "5%"
        }}
      >
        <h3
          style={{
            color: isLanding
              ? "rgba(33, 58, 73, 0.9)"
              : "rgba(255, 255, 255, 0.8)",

            fontWeight: "bold"
          }}
        >
          newsbie
        </h3>
      </div>
      <Link
        to={isLanding ? "/demo" : "/"}
        style={{
          backgroundColor: isLanding
            ? "rgba(33, 58, 73, 0.4)"
            : "rgba(46, 228, 246, 0.6)",
          marginRight: "5%",
          padding: "5px 15px",
          fontSize: 14,
          fontWeight: "600",
          color: "#fff",
          borderRadius: 9999,
          textDecoration: "none"
        }}
        className={"cta"}
      >
        {isLanding ? "Try Demo" : "Get the App"}
      </Link>
    </div>
  );
};

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

const MainRouter = () => {
  return (
    <Router>
      <div>
        <ScollToTopWithRouter>
          <TopBarWithRouter />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/demo" component={App} />
            <Route component={Landing} />
          </Switch>
        </ScollToTopWithRouter>
      </div>
    </Router>
  );
};

export default MainRouter;
