import React from "react";

function Microphone(props) {
  const [audioEnabled, setAudioEnabled] = React.useState(true);

  return (
    <div
      onClick={() => {
        setAudioEnabled((prevState) => {
          const audioTracks = props.userStream.getAudioTracks();

          if (audioTracks.length > 0) {
            audioTracks[0].enabled = !prevState;
          }

          return !prevState;
        });
      }}
      className="cursor-pointer hover:bg-[#ffffff10] duration-200 p-[1rem] rounded-full"
    >
      {audioEnabled && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="256"
          height="256"
          viewBox="0 0 256 256"
          className="w-[3rem] h-[3rem]"
        >
          <path
            fill="currentColor"
            d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
          />
        </svg>
      )}

      {!audioEnabled && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="w-[3rem] h-[3rem]"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.5"
          >
            <path
              stroke-linejoin="round"
              d="M19 11c0 .71-.106 1.395-.302 2.04M12 18a7 7 0 0 1-7-7m7 7v3m0-3a6.97 6.97 0 0 0 4.425-1.576M9.714 4.057A3 3 0 0 1 15 6v3.343M9 9v2a3 3 0 0 0 4.562 2.562"
            />
            <path d="m4 4l16 16" />
          </g>
        </svg>
      )}
    </div>
  );
}

export default Microphone;
