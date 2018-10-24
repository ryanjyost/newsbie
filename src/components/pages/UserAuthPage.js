import React, { Component } from "react";
import UserAuth from "../UserAuth";
import { withRouter } from "react-router";

class UserAuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          // justifyContent: "center",
          alignItems: "center",
          padding: "120px 20px 50px 20px",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
          color: "rgba(0,0,0,0.5)"
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "rgba(0,0,0,0.7)",
            lineHeight: 1.2
          }}
        >
          Join the Private Beta
        </h3>
        <h5
          style={{
            maxWidth: 500,
            fontWeight: 500,
            color: "#9B9B9B",
            fontSize: 15,
            letterSpacing: "0.02em",
            lineHeight: 1.5,
            textAlign: "center",
            marginBottom: 20
          }}
        >
          The <strong>first 100 folks</strong> to join get free early access,
          discounts in the future, and will help build the news app of their
          dreams.
        </h5>

        <div
          style={{
            width: 400,
            maxWidth: "100%",
            backgroundColor: "#fff",
            padding: 20,
            border: "1px solid rgba(0,0,0,0.05)",
            borderRadius: 3
          }}
        >
          <UserAuth
            updateUser={user => {
              this.props.updateUser(user);
              if (this.props.location.pathname === "/login") {
                this.props.history.push(
                  this.props.location.state
                    ? this.props.location.state.prevPath
                    : "/app"
                );
              }
            }}
          />
        </div>
        <a
          href={"https://twitter.com/ryanjyost"}
          target={"_blank"}
          style={{
            textDecoration: "underline",
            marginTop: 40,
            textAlign: "center"
          }}
        >
          Being made by Ryan 👋
        </a>
      </div>
    );
  }
}

export default withRouter(UserAuthPage);
