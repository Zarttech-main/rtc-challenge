import React from "react";

function PartnerMedia(props) {
  const mediaRef = React.useRef();
  const [streamAvailable, setStreamAvailable] = React.useState(false);

  React.useEffect(() => {
    if (!props.peer.stream) {
      setStreamAvailable(false);
      return;
    }

    mediaRef.current.srcObject = props.peer.stream;
    setStreamAvailable(true);
  }, [props.peer.stream]);

  return (
    <div
      className={`max-h-[40rem] max-w-[80rem] rounded-[1rem] bg-primary-card-background overflow-hidden flex items-center justify-center`}
    >
      <video
        ref={mediaRef}
        playsInline
        autoPlay
        controls={false}
        controlsList="nodownload"
        className={`w-full h-full object-cover ${!streamAvailable && "hidden"}`}
      ></video>

      {!streamAvailable && (
        <p className="text-[2rem] font-semibold">{props.peer.peerName}</p>
      )}
    </div>
  );
}

export default PartnerMedia;
