export default function ResMessage({ res }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        width: "30%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        borderRadius: "10px",
        zIndex: "1000",
        margin: "0px auto",
        left: "65%",
        right: "10px",
        color: "white",
        fontWeight: "bolder",
        backgroundColor: "red",
        border: "1px dashed red",
      }}
    >
      Message: {res.message}
    </div>
  );
}
