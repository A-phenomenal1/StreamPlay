import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../config/StateProvider";
import AccountSettings from "./AccountSettings";
import NoDataPage from "../components/NoDataPage";
import NavHeader from "../components/NavHeader";
import Sidepanel from "../components/Sidepanel";
import Subscription from "./Subscription";
import SearchItemsPage from "./SearchItemsPage";
import UploadVideoForm from "./UploadVideoForm";
import VideoPage from "./VideoPage";
import LikedVideos from "./LikedVideos";
import Temp from "../components/Temp";
import HistoryPage from "./HistoryPage";
import MyVideos from "./MyVideos";
import LibraryPage from "./LibraryPage";
import Contact from "./Contact";
import Help from "./Help";
import Home from "./Home";
import "./Dashboard.css";
import AboutUs from "./AboutUs";

const Dashboard = (props) => {
  const [{ user }, dispatch] = useStateValue();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const history = useHistory();

  const componentsSwitch = (key) => {
    switch (key) {
      case "Home":
        return <Home />;

      case "Subscriptions":
        if (user.length === 0) {
          return <NoDataPage data="User" />;
        }
        return <Subscription />;

      case "Library":
        if (user.length === 0) {
          return <NoDataPage data="User" />;
        }
        return <LibraryPage />;

      case "History":
        if (user.length === 0) {
          return <NoDataPage data="User" />;
        }
        return <HistoryPage />;

      case "Liked Videos":
        if (user.length === 0) {
          return <NoDataPage data="User" />;
        }
        return <LikedVideos />;

      case "My Videos":
        if (user.length === 0) {
          return <NoDataPage data="User" />;
        }
        return <MyVideos />;

      case "Settings":
        if (user.length === 0) {
          return <NoDataPage data="User" />;
        }
        return <AccountSettings />;

      case "Help":
        return <Help />;

      case "About us":
        return <AboutUs />;

      case "Contact us":
        return <Contact />;

      case "Upload Video":
        if (user.length === 0) {
          return <NoDataPage data="User" />;
        }
        return <UploadVideoForm />;

      case "Video Page":
        return <VideoPage />;

      case "Sign In":
        history.push("/signin");
        break;

      case "Search Items":
        return <SearchItemsPage />;

      default:
        return <Home />;
    }
  };

  return (
    <>
      <NavHeader onMobileNavOpen={() => setMobileNavOpen(true)} />

      <Sidepanel
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
        shouldDisplay={
          props.page !== "Video Page" ||
          (props.page === "Video Page" && window.innerWidth <= 480)
        }
      />

      <div
        className={
          props.page !== "Video Page"
            ? "layoutWrapper"
            : "layoutWrapper no-padding-left"
        }
      >
        <div className="layoutContainer">
          <div className="layoutContent">{componentsSwitch(props.page)}</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
