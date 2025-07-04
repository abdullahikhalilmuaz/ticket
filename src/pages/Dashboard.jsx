import { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import Welcome from "../components/Welcome";
import Events from "../components/Events";
import Tickets from "../components/Tickets";
import Profile from "../components/Profile";
import NewPost from "../components/NewPost";

export default function Dashboard() {
  const [navs, setNavs] = useState(null);
  return (
    <>
      <DashboardHeader setNavs={setNavs} />
      {navs === "home" ? (
        <Welcome />
      ) : navs === "events" ? (
        <Events />
      ) : navs === "tickets" ? (
        <Tickets />
      ) : navs === "profile" ? (
        <Profile />
      ) : (
        <Welcome />
      )}
    </>
  );
}
