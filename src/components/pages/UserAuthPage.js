import React, { Component } from "react";
import UserAuth from "../UserAuth";

export default class UserAuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
            borderRadius: 3
          }}
        >
          <UserAuth updateUser={user => this.props.updateUser(user)} />
        </div>
      </div>
    );
  }
}
