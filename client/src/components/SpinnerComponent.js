import React from "react";
import { Spinner } from "reactstrap";

export const SpinnerComponent = () => {
  return (
    <div id="loadingSpinner" className="bg-white">
      <Spinner
        animation="border"
        variant="warning"
        size="xl"
        className="text-success"
      />
    </div>
  );
};

export default SpinnerComponent;
