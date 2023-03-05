import React from "react";

interface ButtonProps {
  text: string;
  width: string;
  height: string;
  variant: string;
}

const Button = ({ text, width, height, variant }: ButtonProps) => {
  return (
    <button
      className={`h-${height} w-${width} bg-${variant} rounded-full px-8 py-3 text-white`}
    >
      {text}
    </button>
  );
};

export default Button;
