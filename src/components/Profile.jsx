import { useState, useEffect } from "react";
import "../styles/profile.css";
const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("tix-user"));
    console.log(savedUser);
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);
  return (
    <div className="main-profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar"></div>
          <h2>{user && (user.firstname + " " + user.lastname || "User")}</h2>
          <p>{user && user.email}</p>
        </div>

        <div className="profile-details">
          <h3>Account Details</h3>
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">
              {user && (user.firstname + " " + user.lastname || "Not provided")}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user && user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
