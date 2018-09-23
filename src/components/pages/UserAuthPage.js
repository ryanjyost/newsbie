import React, { Component } from "react";
import UserAuth from "../UserAuth";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import Dashbaord from "./old/Dashboard";

export default class UserAuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.location.pathname === "/") {
      return (
        <Dashbaord
          user={this.props.user}
          updateUser={user => {
            this.props.updateUser(user);
          }}
        />
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "100px 20px",
            flexDirection: "column",
            minHeight: "100vh",
            width: "100%"
          }}
        >
          <div
            style={{
              width: 400,
              maxWidth: "100%",
              backgroundColor: "#fff",
              padding: 20,
              border: "1px solid rgba(0,0,0,0.05)",
              borderRadius: 5
            }}
          >
            <UserAuth updateUser={user => this.props.updateUser(user)} />
          </div>
        </div>
      );
    }
  }
}
