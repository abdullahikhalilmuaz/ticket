import { useState } from "react";
import AdminSignup from "../admin/AdminSignup";
import AdminLogin from "../admin/AdminLogin";
import AdminHeader from "../admin/AdminHeader";
import AdminRes from "../admin/AdminRes";

export default function Admin() {
  const [reg, setReg] = useState(null);
  const [res, setRes] = useState(null);
  return (
    <>
      <AdminRes res={res} />
      <AdminHeader />
      {reg === "signup" ? (
        <AdminSignup setReg={setReg} setRes={setRes} />
      ) : reg === "login" ? (
        <AdminLogin setReg={setReg} setRes={setRes} />
      ) : (
        <AdminLogin setReg={setReg} setRes={setRes} />
      )}
    </>
  );
}
