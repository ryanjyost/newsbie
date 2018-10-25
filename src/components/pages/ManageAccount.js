import React, { Component } from "react";
import { Layout, Menu, Icon, Button, Dropdown } from "antd";
import store from "store";

export default class ManageAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSignOut() {
    store.set("user", null);
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 20px 0px 20px",
          flexDirection: "column",
          height: "100vh",
          minHeight: 600,
          width: "100%",
          color: "rgba(0,0,0,0.5)"
        }}
      >
        <Button
          type={"primary"}
          onClick={() => {
            this.handleSignOut();
            this.props.updateUser(null);
          }}
        >
          Sign Out
        </Button>
      </div>
    );
  }
}
