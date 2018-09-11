import React, { Component } from "react";
import { auth } from "../firebase";

export default class UserAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password1: "",
      password2: "",

      view: "signUp",
      //sign up
      fetching: null,
      error: null,
      signUpSuccess: false,
      signInSuccess: false
    };
  }

  onSignUp() {
    const { email, password1 } = this.state;
    this.setState({ fetching: "signUp", error: null });

    auth
      .doCreateUserWithEmailAndPassword(email, password1)
      .then(authUser => {
        this.props.updateUser(authUser);
        this.setState({
          signUpSuccess: true,
          fetching: null
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          fetching: null,
          error: error.message
        });
      });
  }

  onSignIn() {
    const { email, password1 } = this.state;
    this.setState({ fetching: "signIn", error: null });

    auth
      .doSignInWithEmailAndPassword(email, password1)
      .then(authUser => {
        this.props.updateUser(authUser);
        this.setState({
          signUpSuccess: true,
          fetching: null
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          fetching: null,
          error: error.message
        });
      });
  }

  handleEnterKey(e) {
    const disableSignup =
      this.state.email === "" ||
      this.state.password1.length < 6 ||
      this.state.password1 !== this.state.password2 ||
      this.state.fetching;

    const disableSignIn =
      this.state.email === "" ||
      this.state.password1 === "" ||
      this.state.fetching;

    if (e.key === "Enter") {
      if (this.state.view === "signUp" && !disableSignup) {
        this.onSignUp();
      } else if (this.state.view === "signIn" && !disableSignIn) {
        this.onSignIn();
      }
    }
  }

  render() {
    const { signUpSuccess, fetching, error } = this.state;
    const labelStyle = {
      color: "rgba(0,0,0,0.8)",
      fontSize: 12,
      padding: "0px 0px 3px 0px",
      fontWeight: "bold"
    };
    const inputStyle = {
      marginBottom: 10
    };
    const btnStyle = {
      fontSize: 14,
      backgroundColor: "rgb(33, 58, 73)",
      color: "#fafafa",
      // fontWeight: "bold",
      padding: "10px",
      borderRadius: 3,
      letterSpacing: "0.02em"
    };

    const disableSignup =
      this.state.email === "" ||
      this.state.password1.length < 6 ||
      this.state.password1 !== this.state.password2 ||
      fetching;

    const disableSignIn =
      this.state.email === "" || this.state.password1 === "" || fetching;

    const renderSignUpForm = () => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column"
            // padding: "20px 0px 10px 0px"
          }}
        >
          {" "}
          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <label style={labelStyle}>
            Password{" "}
            <span style={{ color: "rgba(0,0,0,0.4)" }}>
              (minimum 6 characters)
            </span>
          </label>
          <input
            style={inputStyle}
            value={this.state.password1}
            onChange={e => this.setState({ password1: e.target.value })}
            type={"password"}
          />
          <label style={labelStyle}>Confirm Password</label>
          <input
            style={inputStyle}
            value={this.state.password2}
            onChange={e => this.setState({ password2: e.target.value })}
            type={"password"}
          />
          <button
            disabled={disableSignup}
            style={btnStyle}
            className={"shadow shadowHover"}
            onClick={() => this.onSignUp()}
          >
            {fetching ? "Creating your account..." : "Get Free Early Access"}
          </button>
          {!fetching && (
            <div
              className="hoverUnderline"
              style={{
                textAlign: "center",
                fontSize: 12,
                padding: 10,
                color: "rgba(0,0,0,0.8)"
              }}
              onClick={() => this.setState({ view: "signIn" })}
            >
              Already have an account? Click here
            </div>
          )}
        </div>
      );
    };

    const renderSignInForm = () => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column"
            // padding: "20px 0px 10px 0px"
          }}
        >
          {" "}
          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <label style={labelStyle}>Password</label>
          <input
            style={inputStyle}
            value={this.state.password1}
            onChange={e => this.setState({ password1: e.target.value })}
            type={"password"}
          />
          <button
            disabled={disableSignIn}
            style={btnStyle}
            className={"shadow shadowHover"}
            onClick={() => this.onSignIn()}
          >
            {fetching ? "Signing in..." : "Sign In"}
          </button>
          {!fetching && (
            <div
              className="hoverUnderline"
              style={{
                textAlign: "center",
                fontSize: 12,
                padding: 10,
                color: "rgba(0,0,0,0.8)"
              }}
              onClick={() => this.setState({ view: "signUp" })}
            >
              Don't have an account yet? Click here
            </div>
          )}
        </div>
      );
    };

    const renderSignupSuccess = () => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column"
            // padding: "20px 0px 10px 0px"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px 0px 0px 0px"
            }}
          >
            <span style={{ fontSize: 20, marginBottom: 5, fontWeight: "bold" }}>
              Hell Yeah!
            </span>
            <span>You're ready to become a media master</span>
          </div>
        </div>
      );
    };

    const renderSignInSuccess = () => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column"
            // padding: "20px 0px 10px 0px"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px 0px 0px 0px"
            }}
          >
            <span style={{ fontSize: 20, marginBottom: 5, fontWeight: "bold" }}>
              You're signed in!
            </span>
            <span>What cool stuff will you learn today?</span>
          </div>
        </div>
      );
    };

    const renderView = () => {
      const { view } = this.state;
      if (view === "signUp") {
        if (signUpSuccess) {
          return renderSignupSuccess();
        } else {
          return renderSignUpForm();
        }
      } else if (view === "signIn") {
        if (signUpSuccess) {
          return renderSignInSuccess();
        } else {
          return renderSignInForm();
        }
      } else {
        return renderSignUpForm();
      }
    };

    const renderError = () => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div>Whoops!</div>
          <div
            style={{
              margin: "5px 0px 10px 5px",
              fontSize: 12,
              color: "rgba(0,0,0,0.6)"
            }}
          >
            {typeof error === "string" ? error : "Something went wrong"}
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px 0px 10px 0px"
        }}
        onKeyPress={e => this.handleEnterKey(e)}
      >
        {error && renderError()}
        {renderView()}
      </div>
    );
  }
}
