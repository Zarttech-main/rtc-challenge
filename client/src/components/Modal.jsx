import React from "react";

function Modal(props) {
  return (
    // Overlay
    <div className="w-screen h-screen fixed top-0 left-0 bg-[#00000090] flex items-center justify-center">
      {/* Modal */}
      <div
        className={`bg-primary-card-background relative rounded-[1rem] ${props.modalClassName}`}
      >
        {props.children}

        {/* Close Icon */}
        <div
          onClick={props.closeFn}
          className="w-[5rem] h-[5rem] rounded-full hover:bg-[#ffffff10] duration-200 flex items-center justify-center absolute top-[1rem] right-[2rem] cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="w-[3.5rem] h-[3.5rem]"
          >
            <path
              fill="white"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m7 7l10 10M7 17L17 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Modal;
