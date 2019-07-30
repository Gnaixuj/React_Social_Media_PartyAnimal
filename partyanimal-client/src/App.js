import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import themeFile from "./utilities/theme"; // To Be Used
import jwtDecode from "jwt-decode";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";

// MUI
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// Components
import Navbar from "./components/Navbar";
import AuthRoute from "./utilities/AuthRoute";

// Views
import home from "./views/home";
import login from "./views/login";
import signup from "./views/signup";

const theme = createMuiTheme({
  // global
  // can be used elsewhere when neccessary
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#00bcd4",
      dark: "#008394",
      contrastText: "#fff" // text color white
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff"
    }
  },
  typography: {
    useNextVariants: true
  }
});

let authenticated;
const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  console.log(decodedToken); // TBR
  if (decodedToken.exp * 1000 < Date.now()) {
    // token is expired, redirect to login page
    window.location.href = "/login";
    authenticated = false;
  } else {
    // token not expired, prevent logined user from accessing login & signup page
    authenticated = true;
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        {/*everything within the provider tags will have access to our store */}
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Switch>
              <AuthRoute
                exact
                path="/login"
                component={login}
                authenticated={authenticated}
              />
              <Route exact path="/" component={home} />
              <AuthRoute
                exact
                path="/signup"
                component={signup}
                authenticated={authenticated}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
