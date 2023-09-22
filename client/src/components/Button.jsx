import React from "react";

function Button(props) {
  return (
    <button
      // Action for button to perform on clicking
      onClick={props.onClick}
      className={`px-[4rem] py-[1rem] bg-blue-900 rounded-full hover:opacity-70 duration-200 ${props.className}`}
    >
      {props.children}
    </button>
  );
}

export default Button;
