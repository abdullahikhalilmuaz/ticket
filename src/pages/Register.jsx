import { useState } from "react";
import "../styles/register.css";
import RegisterHeader from "../components/RegisterHeader";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ResMessage from "../components/ResMessasge";
const Register = () => {
  const [formstate, setFormState] = useState(null);
  const [res, setRes] = useState(null);
  return (
    <div className="register-container">
      <RegisterHeader />
      {res && <ResMessage res={res} />}
      {formstate === "signup" ? (
        <Signup setFormState={setFormState} setRes={setRes} res={res} />
      ) : formstate === "login" ? (
        <Login setFormState={setFormState} setRes={setRes} res={res} />
      ) : (
        <Login setFormState={setFormState} setRes={setRes} res={res} />
      )}
    </div>
  );
};

export default Register;
