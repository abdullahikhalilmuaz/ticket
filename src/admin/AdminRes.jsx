import "../styles/adminres.css";
const AdminRes = ({ res }) => {
  console.log(res);
  return <div className="admin-res">{res && res.message}</div>;
};

export default AdminRes;
