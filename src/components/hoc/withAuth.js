import React from "react";
import UserAuthPage from "../pages/UserAuthPage";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

const withAuthentication = (Component, user, updateUser) => {
  class WithAuthentication extends React.Component {
    render() {
      if (!user) {
        return (
          <UserAuthPage
            {...this.props}
            user={user}
            updateUser={user => {
              updateUser(user);
            }}
          />
        );
      } else {
        return <Component {...this.props} />;
      }
    }
  }

  return withRouter(WithAuthentication);
};

export default withAuthentication;
