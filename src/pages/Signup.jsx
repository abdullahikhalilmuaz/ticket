const BASE_URL = "https://ticket-server-e4r3.onrender.com/api/signup";
import { useState } from "react";
import "../styles/signup.css";

const Signup = ({ setFormState, setRes, res }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setFormState("login");
  };

  const handleAdmin = () => {
    window.location.href = "/admin";
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      firstname,
      lastname,
      username,
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
      setRes(data);
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
                type="text"
                placeholder="Firstname"
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="Lastname"
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
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
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                type="submit"
                value={isLoading ? "Signing up..." : "Signup"}
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
                value="Login ?"
                style={{ border: "none", cursor: "pointer" }}
                onClick={handleLogin}
                disabled={isLoading}
              />
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
