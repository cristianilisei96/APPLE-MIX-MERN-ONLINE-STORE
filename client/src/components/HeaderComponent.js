import React from "react";
import CategorySidebarComponent from "../components/CategorySidebarComponent";
import VideoComponent from "../components/VideoComponent";

const HeaderComponent = () => {
  return (
    <div id="headerComponent">
      <div className="container">
        <div className="row">
          <CategorySidebarComponent />
          <VideoComponent />
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
