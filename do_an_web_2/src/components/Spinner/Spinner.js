import ClipLoader from "react-spinners/ClipLoader";
import "./Spinner.css";
import React from "react";
const Spinner = React.memo(() => {
  return (
    <div className="container-spinner">
      <ClipLoader color="#fd6e4f"/>
    </div>
  );
});
export default Spinner;