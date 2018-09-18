import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainRouter from "./MainRouter";
import registerServiceWorker from "./registerServiceWorker";
require("dotenv").config();

ReactDOM.render(<MainRouter />, document.getElementById("root"));
registerServiceWorker();
