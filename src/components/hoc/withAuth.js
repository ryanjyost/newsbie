import React from "react";
import UserAuth from "../UserAuth";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

const withAuthentication = (Component, user, updateUser) => {
  class WithAuthentication extends React.Component {
    render() {
      if (!user) {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "100vh",
              width: "100%"
            }}
          >
            <h3 style={{ margin: 5 }}>New phone, who dis?</h3>
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
                width: 300,
                maxWidth: "100%",
                backgroundColor: "#fcfcfc",
                padding: 20
              }}
            >
              <UserAuth updateUser={user => updateUser(user)} />
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
      } else {
        return <Component {...this.props} />;
      }
    }
  }

  return withRouter(WithAuthentication);
};

export default withAuthentication;
