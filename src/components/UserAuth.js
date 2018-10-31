import React, { Component } from "react";
import { auth } from "../firebase";
import { Input, Icon, Button, Checkbox } from "antd";
import axios from "axios/index";
import { Link } from "react-router-dom";

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
      signInSuccess: false,
      emailOptIn: false
    };
  }

  onSignUp() {
    const { email, password1 } = this.state;
    this.setState({ fetching: "signUp", error: null });

    auth
      .doCreateUserWithEmailAndPassword(email, password1)
      .then(authUser => {
        this.createUser(authUser);
        this.props.updateUser(authUser);
        // this.setState({
        //   signUpSuccess: true,
        //   fetching: null
        // });
      })
      .catch(error => {
        this.setState({
          fetching: null,
          error: error.message
        });
      });
  }

  createUser(user) {
    axios({
      method: "POST",
      url: "https://birds-eye-news-api.herokuapp.com/users",
      data: { user, subscribe: this.state.emailOptIn },
      config: { headers: { "Content-Type": "application/json" } }
    })
      .then(res => {
        this.setState({
          signUpSuccess: true,
          fetching: null
        });
      })
      .catch(error => {
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
        this.createUser(authUser, true);
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
      !this.state.emailOptIn ||
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
    const { signUpSuccess, fetching, error, email } = this.state;
    const labelStyle = {
      color: "rgba(0,0,0,0.6)",
      fontSize: 12,
      padding: "0px 0px 0px 0px",
      fontWeight: "bold",
      marginBottom: 3
    };
    const inputStyle = {
      marginBottom: 10
    };
    const btnStyle = {
      // fontSize: 14,
      // backgroundColor: "rgb(33, 58, 73)",
      // color: "#fafafa",
      // // fontWeight: "bold",
      // padding: "10px",
      // borderRadius: 3,
      // letterSpacing: "0.02em"
    };

    const disableSignup =
      this.state.email === "" ||
      !this.state.emailOptIn ||
      this.state.password1.length < 6 ||
      this.state.password1 !== this.state.password2 ||
      this.state.fetching;

    const disableSignIn =
      this.state.email === "" || this.state.password1 === "" || fetching;

    const renderSignUpForm = () => {
      const renderLegal = () => {
        const linkStyle = { color: "rgba(0,0,0,0.7)" };
        return (
          <div
            style={{
              fontSize: 11,
              margin: "10px 0px 10px 0px",
              color: "rgba(0,0,0,0.4)"
            }}
          >
            By creating an account, you agree to Newsbie's{" "}
            <Link style={linkStyle} to={"/terms"}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link style={linkStyle} to={"/privacy-policy"}>
              Privacy Policy
            </Link>.
          </div>
        );
      };

      const renderOptIn = () => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 11,
              margin: "10px 0px"
            }}
          >
            <Checkbox
              value={this.state.emailOptIn}
              style={{
                fontSize: 11,
                color: "rgba(0,0,0,0.4)",
                fontWeight: "normal"
              }}
              onChange={e => this.setState({ emailOptIn: e.target.checked })}
            >
              I'm OK with being contacted occasionally via email about Newsbie.{" "}
              <i>Required for beta participation - unsubscribe any time.</i>
            </Checkbox>
          </div>
        );
      };

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
          <Input
            style={inputStyle}
            // placeholder="jsnow@winterfell.gov"
            prefix={
              <Icon
                type="user"
                style={{ color: "rgba(0,0,0,.25)", marginRight: 10 }}
              />
            }
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <label style={labelStyle}>
            Password{" "}
            {/*<span style={{ color: "rgba(0,0,0,0.2)", fontWeight: "normal" }}>*/}
            {/*(minimum 6 characters)*/}
            {/*</span>*/}
          </label>
          <Input
            style={inputStyle}
            value={this.state.password1}
            prefix={
              <Icon
                type="lock"
                style={{ color: "rgba(0,0,0,.25)", marginRight: 10 }}
              />
            }
            onChange={e => this.setState({ password1: e.target.value })}
            type={"password"}
          />
          <label style={labelStyle}>Confirm Password</label>
          <Input
            style={inputStyle}
            value={this.state.password2}
            onChange={e => this.setState({ password2: e.target.value })}
            type={"password"}
            prefix={
              <Icon
                type="lock"
                style={{ color: "rgba(0,0,0,.25)", marginRight: 10 }}
              />
            }
          />
          {renderOptIn()}
          <Button
            type="primary"
            disabled={disableSignup}
            style={btnStyle}
            className={"shadow shadowHover"}
            onClick={() => this.onSignUp()}
          >
            {fetching ? "Creating your account..." : `Sign up`}
          </Button>
          {renderLegal()}
          {!fetching && (
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                padding: 10,
                color: "rgba(0,0,0,0.4)"
              }}
            >
              Already have an account?{" "}
              <span
                onClick={() => this.setState({ view: "signIn" })}
                className="hoverUnderline"
                style={{ color: "rgba(24, 144, 255, 1)" }}
              >
                Sign in
              </span>
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
          <label style={labelStyle}>Email</label>
          <Input
            style={inputStyle}
            prefix={
              <Icon
                type="user"
                style={{ color: "rgba(0,0,0,.25)", marginRight: 10 }}
              />
            }
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <label style={labelStyle}>Password </label>
          <Input
            style={inputStyle}
            value={this.state.password1}
            prefix={
              <Icon
                type="lock"
                style={{ color: "rgba(0,0,0,.25)", marginRight: 10 }}
              />
            }
            onChange={e => this.setState({ password1: e.target.value })}
            type={"password"}
          />
          <Button
            type="primary"
            disabled={disableSignIn}
            style={btnStyle}
            className={"shadow shadowHover"}
            onClick={() => this.onSignIn()}
          >
            {fetching ? "Signing in..." : "Sign in"}
          </Button>

          {!fetching && (
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                padding: 10,
                color: "rgba(0,0,0,0.8)"
              }}
            >
              Don't have an account yet?{" "}
              <span
                onClick={() => this.setState({ view: "signUp" })}
                className="hoverUnderline"
                style={{ color: "rgba(24, 144, 255, 1)" }}
              >
                Sign up
              </span>
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
          padding: "0px 0px 0px 0px"
        }}
        onKeyPress={e => this.handleEnterKey(e)}
      >
        {error && renderError()}
        {renderView()}
      </div>
    );
  }
}
