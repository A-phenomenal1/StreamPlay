import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { useStateValue } from "./config/StateProvider";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import dev from "./api/dev";
import "./App.css";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  const [isReady, setIsReady] = useState(false);
  const [{ user }, dispatch] = useStateValue();
  const restoreUser = async () => {
    if (localStorage.getItem("JwtAuthToken") === null) {
      localStorage.setItem("JwtAuthToken", "not authenticated");
    } else if (localStorage.getItem("JwtAuthToken") !== "not authenticated") {
      await fetch(`${dev.BaseUrl}/authusers`, {
        headers: {
          "auth-token": localStorage.getItem("JwtAuthToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch({
            type: "SET_USER",
            user: [data],
          });
        })
        .catch((err) => console.log("error:", err));
    }
  };

  if (!isReady) {
    restoreUser();
    setIsReady(true);
  }

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Switch>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/uploadvideo">
              <Dashboard page="Upload Video" />
            </Route>
            <Route path="/video/:videoid">
              <Dashboard page="Video Page" />
            </Route>
            <Route path="/subscriptions">
              <Dashboard page="Subscriptions" />
            </Route>
            <Route path="/library">
              <Dashboard page="Library" />
            </Route>
            <Route path="/history">
              <Dashboard page="History" />
            </Route>
            <Route path="/likedvideos">
              <Dashboard page="Liked Videos" />
            </Route>
            <Route path="/likedvideos">
              <Dashboard page="Liked Videos" />
            </Route>
            <Route path="/myvideos">
              <Dashboard page="My Videos" />
            </Route>
            <Route path="/settings">
              <Dashboard page="Settings" />
            </Route>
            <Route path="/help">
              <Dashboard page="Help" />
            </Route>
            <Route path="/aboutus">
              <Dashboard page="About us" />
            </Route>
            <Route path="/contactus">
              <Dashboard page="Contact us" />
            </Route>
            <Route path="/search">
              <Dashboard page="Search Items" />
            </Route>
            <Route path="/nodata">
              <Dashboard page="No Data" />
            </Route>
            <Route path="/">
              <Dashboard page="Home" />
            </Route>
          </Switch>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
