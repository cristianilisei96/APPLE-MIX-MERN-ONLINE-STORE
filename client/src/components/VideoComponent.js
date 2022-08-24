import React from "react";
import video from "../video/prezentation.mp4";

const VideoComponent = () => {
  return (
    <div className="col-md-9 mb-4">
      <video
        src={video}
        className="card w-100 border-dark"
        autoPlay="autoplay"
        muted="muted"
        loop="loop"
      ></video>
    </div>
  );
};

export default VideoComponent;
