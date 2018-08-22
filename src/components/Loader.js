import React from "react";

const Loader = ({ loadingMessage }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: 200,
        width: "100%",
        color: "rgba(0, 0, 0, 0.4)",
        fontSize: 14
      }}
    >
      {loadingMessage ? loadingMessage : "loading..."}
      {/*<Loader*/}
      {/*type="Bars"*/}
      {/*color="rgba(46, 228, 246, 0.9)"*/}
      {/*height="100"*/}
      {/*width="100"*/}
      {/*/>*/}
      <div style={{ marginTop: 10, maxWidth: 200 }} className="loader" />
    </div>
  );
};

export default Loader;
