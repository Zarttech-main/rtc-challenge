import React from "react";

function Camera(props) {
  const [videoEnabled, setVideoEnabled] = React.useState(true);

  return (
    <div
      // Toggle video on click
      onClick={() => {
        setVideoEnabled((prevState) => {
          const videoTracks = props.userStream.getVideoTracks();

          if (videoTracks.length > 0) {
            videoTracks[0].enabled = !prevState;
          }

          return !prevState;
        });
      }}
      className="cursor-pointer hover:bg-[#ffffff10] duration-200 p-[1rem] rounded-full"
    >
      {videoEnabled && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="w-[3rem] h-[3rem]"
        >
          <path
            fill="currentColor"
            d="M21.53 7.15a1 1 0 0 0-1 0L17 8.89A3 3 0 0 0 14 6H5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h9a3 3 0 0 0 3-2.89l3.56 1.78A1 1 0 0 0 21 17a1 1 0 0 0 .53-.15A1 1 0 0 0 22 16V8a1 1 0 0 0-.47-.85ZM15 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1Zm5-.62l-3-1.5v-1.76l3-1.5Z"
          />
        </svg>
      )}

      {!videoEnabled && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="w-[3rem] h-[3rem]"
        >
          <path
            fill="currentColor"
            d="M3.41 1.86L2 3.27L4.73 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12c.21 0 .39-.08.55-.18L19.73 21l1.41-1.41l-8.86-8.86l-8.87-8.87M5 16V8h1.73l8 8H5m10-8v2.61l6 6V6.5l-4 4V7a1 1 0 0 0-1-1h-5.61l2 2H15Z"
          />
        </svg>
      )}
    </div>
  );
}

export default Camera;
