import "../styles/adminheader.css";
export default function AdminHeader({ setToShow }) {
  const user = localStorage.getItem("tix-user");
  const handlehome = () => {
    setToShow("home");
  };
  const handletickets = () => {
    setToShow("tickets");
  };
  const handleevents = () => {
    setToShow("events");
  };
  const handleProfile = () => {
    setToShow("profile");
  };

  const handleAdminLogout = () => {
    const admin = localStorage.getItem("tix-user");
    localStorage.removeItem("tix-user");
    window.location.href = "/";
  };

  return (
    <div className="admin-main-header">
      <div className="title">
        <h3>TixLite</h3>
      </div>
      <div className="navs-container">
        <div className="navs">
          {user && (
            <ul>
              <li onClick={handlehome}>
                <span>Home</span>
              </li>
              <li onClick={handleevents}>
                <span>Events</span>
              </li>
              <li onClick={handletickets}>
                <span>Tickets</span>
              </li>
              <li onClick={handleProfile}>
                <span>Profile</span>
              </li>
            </ul>
          )}
        </div>
        {user && (
          <div className="action">
            <button
              onClick={handleAdminLogout}
              style={{
                padding: "8px 10px",
                border: "none",
                color: "white",
                background: "blue",
                fontWeight: "900",
                borderRadius: "3px",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
