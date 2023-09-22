import React from "react";

function Media(props) {
  return (
    <div className="max-h-[40rem] max-w-[80rem] rounded-[1rem] bg-primary-card-background overflow-hidden">
      <video
        ref={props.mediaRef}
        playsInline
        muted={props.muted}
        autoPlay
        className="w-full h-full object-cover"
      ></video>
    </div>
  );
}

export default Media;
