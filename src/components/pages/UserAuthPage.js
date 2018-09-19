import React, { Component } from "react";
import UserAuth from "../UserAuth";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import Dashbaord from "../pages/Dashboard";

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
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 100,
            paddingBottom: 100,
            flexDirection: "column",
            minHeight: "100vh",
            width: "100%"
          }}
        >
          <h3 style={{ margin: 5, fontWeight: "bold" }}>New phone, who dis?</h3>
          <h5
            style={{
              margin: "5px 0px 20px 0px",
              color: "rgba(0,0,0,0.5)",
              textAlign: "center"
            }}
          >
            You'll need to sign up or sign in <br />to access this feature
          </h5>
          <div
            className="shadow"
            style={{
              width: 400,
              maxWidth: "100%",
              backgroundColor: "#fcfcfc",
              padding: 20
            }}
          >
            <UserAuth updateUser={user => this.props.updateUser(user)} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <h5
              style={{
                color: "rgba(0,0,0,0.5)",
                textAlign: "center",
                margin: "50px 0px 10px 0px"
              }}
            >
              Want a taste of what newsbie can do for you?
            </h5>
            <Link
              to={"/"}
              className={"shadow shadowHover"}
              style={{
                textAlign: "center",
                display: "block",
                backgroundColor: "#fff",
                padding: "7px 15px",
                borderRadius: 3,
                color: "rgba(0,0,0,0.5)",
                fontSize: 14
              }}
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      );
    }
  }
}
