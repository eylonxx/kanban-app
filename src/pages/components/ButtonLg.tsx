import React from "react";

interface ButtonLgProps {
  text: string;
  width: string;
  height: string;
  variant: string;
}

const ButtonLg = ({ text, width, height, variant }: ButtonLgProps) => {
  return (
    <button
      className={`h-${height} w-${width} bg-${variant} rounded-full px-8 py-3 text-white`}
    >
      {text}
    </button>
  );
};

export default ButtonLg;
