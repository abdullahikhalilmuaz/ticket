import { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminHome from "./AdminHome";
import AdminProfile from "./AdminProfile";
import AdminEvents from "./AdminEvents";
import AdminTickets from "./AdminTickets";
const user = JSON.parse(localStorage.getItem("tix-admin"));

const AdminWelcome = () => {
  const [toShow, setToShow] = useState(null);
  return (
    <>
      <AdminHeader setToShow={setToShow} />
      <div
        className="content"
        style={{
          position: "fixed",
          top: "100px",
          left: "0",
          right: "0",
          bottom: "0",
          width: "100%",
          height: "100%",
        }}
      >
        {toShow === "home" ? (
          <AdminHome />
        ) : toShow === "events" ? (
          <AdminEvents />
        ) : toShow === "tickets" ? (
          <AdminTickets />
        ) : toShow === "profile" ? (
          <AdminProfile />
        ) : (
          <AdminHome />
        )}
      </div>
    </>
  );
};

export default AdminWelcome;
