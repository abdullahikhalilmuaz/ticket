const BASE_URL = "https://ticket-server-e4r3.onrender.com/api/login";
import { useState } from "react";
import "../styles/signup.css";

const Login = ({ setFormState, setRes, res }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSign = () => {
    setFormState("signup");
  };

  const handleAdmin = () => {
    window.location.href = "/admin";
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      email,
      password,
    };

    try {
      const res = await fetch(BASE_URL, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setRes(data);

      if (res.ok) {
        window.alert("You are logged in successfully");
        localStorage.setItem("tix-user", JSON.stringify(data.user));
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
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
                required
              />
            </label>
            <label>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                type="submit"
                value={isLoading ? "Logging in..." : "Login"}
                disabled={isLoading}
              />
              {isLoading && (
                <div className="spinner">
                  <div className="spinner-inner"></div>
                </div>
              )}
            </label>
            <label>
              <input
                type="button"
                value="Signup ?"
                style={{ border: "none", cursor: "pointer" }}
                onClick={handleSign}
                disabled={isLoading}
              />
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
