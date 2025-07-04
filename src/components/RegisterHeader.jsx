import "../styles/reg-head.css";

const RegisterHeader = ({ setUser, user }) => {
  return (
    <div className="register-header">
      <div className="title">
        <h3
          style={{
            fontFamily: "sans-serif",
            fontWeight: "600",
            fontSize: "20px",
          }}
        >
          TixLite
        </h3>
      </div>
    </div>
  );
};

export default RegisterHeader;
