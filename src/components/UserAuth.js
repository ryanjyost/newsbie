import React, { Component } from "react";
import { auth } from "../firebase";

export default class UserAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password1: "",
      password2: ""
    };
  }

  onSubmit() {
    const { email, password1 } = this.state;

    auth
      .doCreateUserWithEmailAndPassword(email, password1)
      .then(authUser => {
        alert("success");
        console.log(authUser);
      })
      .catch(error => {
        alert("error");
      });
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Email</label>
        <input
          value={this.state.email}
          onChange={e => this.setState({ email: e.target.value })}
        />
        <label>Password</label>
        <input
          value={this.state.password1}
          onChange={e => this.setState({ password1: e.target.value })}
          type={"password"}
        />
        <label>Confirm Password</label>
        <input
          value={this.state.password2}
          onChange={e => this.setState({ password2: e.target.value })}
          type={"password"}
        />

        <button onClick={() => this.onSubmit()}>Submit</button>
      </div>
    );
  }
}
