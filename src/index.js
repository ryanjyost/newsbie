import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainRouter from "./MainRouter";
import registerServiceWorker from "./registerServiceWorker";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from "react-router-dom";
import { withRouter } from "react-router";
import ScrollToTop from "./components/hoc/ScrollToTop";

const MainWithRouter = withRouter(MainRouter);

ReactDOM.render(
  <Router>
    <ScrollToTop>
      <MainWithRouter />
    </ScrollToTop>
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
