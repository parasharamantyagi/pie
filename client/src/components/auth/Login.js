/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/Login.js
 * Descr:    Login component, authenticates the user into the app.
 * Created:  2019-02-04
 * Author:   Brad Kaufman
 * Descr:    Login and authentication for the app.
 * -----
 * Modified: 2019-04-17
 * Editor:   Brad Kaufman
 */
import React from "react";
import { Link, Redirect } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import Card from "@material-ui/core/Card/index";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid/index";
import SectionHeader from "../typo/SectionHeader";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {
  store,
  setUser,
  setOrg,
  isAdministrator,
  setProjectListFilter,
  isLoggedIn,
  checkPermision,
} from "../../redux";

import "./Login.css";
import { LOGIN_API_URL } from "../../config/apiUrl";

class Login extends React.Component {
  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    id: "",
    email: "",
    pwdhash: "",
    password: "",
    isEditing: false,
    isUserLoggedIn: false,
    isFailedLogin: false,
    readyToRedirect: false,
    redirectTarget: "",
    userData: "",
    storeUser: "",
    expanded: false,
    labelWidth: 0,
    msgText: "",
    disableButton: false,
    width: 0,
    height: 0,
  };

  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  getParameterByName(name) {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    let redirectTarget = "";
    this.setState({ disableButton: true });
    // Authenticate against the username
    fetch(LOGIN_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        this.setState({ disableButton: false });
        if (!response.ok) {
          // here, we get out of the then handlers and
          // over to the catch handler
          response.json().then((res) => {
            if (res.success === false) {
              this.setState({
                isFailedLogin: true,
                msgText: res.message
                  ? "Email or password is incorrect"
                  : res.err,
              });
            }
          });
          throw new Error("Network response was not ok.");
        } else {
          // status code 200 is success.
          return response.json();
        }
      })
      .then((user) => {
        // Use Redux to save the user information.
        store.dispatch(setUser(JSON.stringify(user)));
        // Initialize project filters for the Redux store.
        let status = [];
        let startYear = [];
        let endYear = [];
        let filters = { status, startYear, endYear };
        store.dispatch(setProjectListFilter(filters));
        if (user.organization) {
          store.dispatch(setOrg(JSON.stringify(user.organization)));
        }
      })
      .then(() => {
        redirectTarget = "/analytics-dashboard";
        this.setState({
          isUserLoggedIn: true,
          readyToRedirect: true,
          redirectTarget: redirectTarget,
        });
      })
      .catch((err) => {
        // this.setState({
        // isFailedLogin: true,
        // msgText: "Login failed, please try again."
        // });
      });
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  renderOld() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    if (this.state.readyToRedirect) {
      return <Redirect to={this.state.redirectTarget} />;
    }

    if (isLoggedIn()) {
      let redirectTarget = "";
      redirectTarget = "/about";
      this.setState({
        isUserLoggedIn: true,
        readyToRedirect: true,
        redirectTarget: redirectTarget,
      });
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <form onSubmit={this.handleSubmit} noValidate>
          <div className={classes.root}>
            <Grid container justify="center">
              <Grid
                spacing={24}
                alignItems="center"
                justify="center"
                container
                className={classes.grid}
              >
                <Grid item xs={12} md={6}>
                  <SectionHeader title="" subtitle="" />
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        component="h2"
                        color="secondary"
                        gutterBottom
                      >
                        Please login
                      </Typography>

                      <Typography
                        variant="h7"
                        component="h6"
                        style={{ color: "red" }}
                        gutterBottom
                      >
                        {this.state.msgText}
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="email"
                          label="Email"
                          fullWidth
                          onChange={this.handleChange("email")}
                          value={this.state.email}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          fullWidth
                          id="password"
                          label="Password"
                          type="Password"
                          onChange={this.handleChange("password")}
                          value={this.state.password}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <div className={classes.spaceTop}>
                          <br />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                            className={classes.secondary}
                            disabled={this.state.disableButton}
                          >
                            Submit
                          </Button>
                        </div>
                      </Typography>
                      <Typography component="div">
                        <br />
                        <br />
                        <Link to={`/resetpassword`}>Forgot password?</Link>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </form>
      </React.Fragment>
    );
  }

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    if (this.state.readyToRedirect) {
      return <Redirect to={this.state.redirectTarget} />;
    }

    if (isLoggedIn()) {
      let redirectTarget = "";
      if (!isAdministrator()) {
        if (checkPermision("Dashboard", "read")) {
          redirectTarget = "/paneldashboard";
        } else if (checkPermision("Mind Map", "read")) {
          redirectTarget = "/mindmaplist";
        } else if (checkPermision("Regrouping", "read")) {
          redirectTarget = "/organizationactions";
        } else if (checkPermision("Search", "read")) {
          redirectTarget = "/search";
        } else if (checkPermision("Analytics", "read")) {
          redirectTarget = "/analytics";
        } else if (checkPermision("Organization", "read")) {
          redirectTarget = "/organization";
        } else if (checkPermision("About", "read")) {
          redirectTarget = "/about";
        }
      } else {
        redirectTarget = "/analytics-dashboard";
      }
      this.setState({
        isUserLoggedIn: true,
        readyToRedirect: true,
        redirectTarget: redirectTarget,
      });
    }

    return (
      <div className="main-body" style={{ height: this.state.height }}>
        <div className="main-wrapper">
          <div className="content-part">
            <div className="container">
              <div className="content-left">
                <img href="#" src={require("../../images/new-logo.png")} />
                <h4>ValueInfinity Innovation Platform </h4>
                <p></p>
              </div>
              <div className="content-right">
                <div className="content-right-inner">
                  <h4>Please Log In</h4>
                  <form onSubmit={this.handleSubmit} noValidate>
                    {this.state.msgText && (
                      <p style={{ color: "red" }}>{this.state.msgText}</p>
                    )}
                    <div className="form-group margin-bottom">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Email"
                        onChange={this.handleChange("email")}
                        value={this.state.email}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        id="pwd"
                        name="pwd"
                        placeholder="Password"
                        onChange={this.handleChange("password")}
                        value={this.state.password}
                      />
                    </div>
                    <Link to={`/resetpassword`} className="form-error">
                      Forgot password?
                    </Link>
                    <button
                      className="button"
                      type="submit"
                      value="Submit"
                      onClick={this.handleSubmit}
                    >
                      submit{" "}
                    </button>
                  </form>
                  <span className="number">V.01062020 </span>
                </div>
              </div>
            </div>
            <footer>
              <div className="container">
                <p>
                  {" "}
                  <a href="https://www.value-infinity.com/" target="_blank">
                    Copyright.2020 All Right Reserved | ValueInfinity Inc.
                  </a>{" "}
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
