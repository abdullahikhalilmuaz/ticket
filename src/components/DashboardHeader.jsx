import "../styles/dashboadheader.css";
export default function DashboardHeader({ setNavs }) {
  const saved = JSON.parse(localStorage.getItem("tix-user")).email;
  const handleLogout = () => {
    localStorage.removeItem("tix-user");
    window.location.href = "/register";
  };

  const handleHome = () => {
    setNavs("home");
  };
  const handleEvents = () => {
    setNavs("events");
  };
  const handleTickets = () => {
    setNavs("tickets");
  };
  return (
    <div className="dashboard-header">
      <div
        className="title"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <h3>TixLite</h3>
        <div
          onClick={() => setNavs("profile")}
          style={{ marginTop: "-10px", cursor: "pointer", display: "flex" }}
        >
          <div
            className="user"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "20px",
              height: "20px",
              background: "black",
              borderRadius: "50%",
              margin: "0px 5px",
            }}
          >
            <div className="user-head"></div>
            <div className="user-body"></div>
          </div>
          <div>{saved}</div>
        </div>
      </div>

      <div className="header-content-container">
        <div className="navs">
          <ul>
            <li onClick={handleHome}>
              <span>Home</span>
            </li>
            <li onClick={handleEvents}>
              <span>Events</span>
            </li>
            <li onClick={handleTickets}>
              <span>Tickets</span>
            </li>
          </ul>
        </div>

        <div className="actions">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
