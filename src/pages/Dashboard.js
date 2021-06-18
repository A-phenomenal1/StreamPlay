import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
import Home from "./Home";
import "./Dashboard.css";
import Contact from "./Contact";
import Help from "./Help";
import AccountSettings from "./AccountSettings";
import { useStateValue } from "../config/StateProvider";
import NoDataPage from "../components/NoDataPage";

const Dashboard = (props) => {
  const [{ user }, dispatch] = useStateValue();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const history = useHistory();

  const componentsSwitch = (key) => {
    switch (key) {
      case "Home":
        return <Home />;

      case "Subscriptions":
        return <Subscription />;

      case "Library":
        return <LibraryPage />;

      case "History":
        return <HistoryPage />;

      case "Liked Videos":
        return <LikedVideos />;

      case "My Videos":
        return <MyVideos />;

      case "Settings":
        if (user.length === 0) {
          return <NoDataPage data="User" />;
        }
        return <AccountSettings />;

      case "Help":
        return <Help />;

      case "About us":
        return <Temp page="About us" />;

      case "Contact us":
        return <Contact />;

      case "Upload Video":
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
