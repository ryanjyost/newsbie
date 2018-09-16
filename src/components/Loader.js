import React from "react";

const Loader = ({ loadingMessage, loaderHeight }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: loaderHeight ? loaderHeight : 200,
        width: "100%",
        color: "rgba(0, 0, 0, 0.6)",
        fontSize: 18
      }}
    >
      {loadingMessage ? loadingMessage : "loading..."}
      {/*<Loader*/}
      {/*type="Bars"*/}
      {/*color="rgba(46, 228, 246, 0.9)"*/}
      {/*height="100"*/}
      {/*width="100"*/}
      {/*/>*/}
      <div style={{ marginTop: 20, maxWidth: 200 }} className="loader" />
    </div>
  );
};

export default Loader;
