const BASE_URL = "https://ticket-server-e4r3.onrender.com/api/admin/login";
import { useState } from "react";

const AdminLogin = ({ setReg, setRes }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSign = () => {
    setReg("signup");
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = {
      email,
      password,
    };

    const res = await fetch(BASE_URL, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data);
    setRes(data);

    if (res.ok) {
      window.alert("You are lucky");
      localStorage.setItem("tix-user", JSON.stringify(data.admin));
      window.location.href = "/admin/home";
    }
  };
  return (
    <div className="signup-container">
      <div className="signup-content-container">
        <div className="signup-right-container">
          <form onSubmit={handleForm}>
            <label>
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              <input type="submit" value="Login" />
            </label>
            <label>
              <input
                type="button"
                value="Signup ?"
                style={{ border: "none", cursor: "pointer" }}
                onClick={handleSign}
              />
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
