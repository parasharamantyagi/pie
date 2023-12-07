/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/withAuth.jsx
 * Created:  2019-02-01
 * Author:   Brad Kaufman
 * Descr:    Authorization component wrapping ComponentToProtect.
 * -----
 * Modified: 2020-01-16
 * Changes:  Add call to Redux function setUser() to nullify the Redux store when the user is not logged in.
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import { getUser, setUser, store } from "../redux";
import { API_BASE_URL } from "../config/apiUrl";

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false
      };
    }

    componentDidMount() {
      const userData = getUser();
      console.log('userData userData', userData);
      fetch(API_BASE_URL + "/api/auth/validate", { headers: { authorization: userData.token } })
        .then(res => {
          if (res.status !== 200) {
            this.redirectToLogin();
          }
        }).catch(err => {
          console.error(err);
          store.dispatch(setUser(JSON.stringify("")));
          this.redirectToLogin();
        });
    }

    redirectToLogin() {
      if (window.location.pathname != '' && window.location.pathname != '/') {
        store.dispatch(setUser(JSON.stringify("")));
        localStorage.clear();
        sessionStorage.clear();
        window.location.assign('/?returnUrl=' + window.location.pathname)
      }
    }
    render() {
      return (
        <React.Fragment>
          <ComponentToProtect {...this.props} />
        </React.Fragment>
      );
    }
  };
}
