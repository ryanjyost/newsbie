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
import { withRouter } from "react-router";

import { ic_home } from "react-icons-kit/md/ic_home";
import { Icon } from "react-icons-kit";

const TopBar = ({ location }) => {
  let isLanding = location.pathname === "/";

  if (isLanding) {
    return (
      <div
        style={{
          height: 40,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderBottom: "1px solid #e5e5e5",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "0.03em",
          // boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          position: "fixed",
          top: 0,
          zIndex: 100
        }}
      >
        <h4
          style={{
            color: "rgb(33, 58, 73)",
            margin: "0px 30px",
            letterSpacing: "0.04em",
            textDecoration: "none"
          }}
        >
          <Link style={{ textDecoration: "none" }} to={"/"}>
            newsbie
          </Link>
        </h4>
      </div>
    );
  } else {
    return (
      <div
        style={{
          height: 40,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderBottom: "1px solid #e5e5e5",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          letterSpacing: "0.03em",
          padding: "0px 20px",
          // boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          position: "fixed",
          top: 0,
          zIndex: 100
        }}
      >
        <Link style={{ textDecoration: "none" }} to={"/"}>
          {" "}
          <Icon
            style={{
              marginRight: 3,
              color: "rgba(0, 0, 0, 0.6)"
            }}
            icon={ic_home}
            size={20}
          />
        </Link>
      </div>
    );
  }

  // }
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
            {/*<Route exact path="/" component={Landing} />*/}
            {/*<Route path="/demo" component={App} />*/}
            <Route path="/" exact component={Dashboard} />
            <Route path="/articles" component={Articles} />
            <Route path="/front_pages" component={FrontPageSearch} />
            <Route path="/old/landing" component={Landing} />
            <Route component={Dashboard} />
          </Switch>
        </ScollToTopWithRouter>
      </div>
    </Router>
  );
};

export default MainRouter;
