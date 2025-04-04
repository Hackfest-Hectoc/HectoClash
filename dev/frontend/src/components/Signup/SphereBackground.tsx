import React from "react";

export const SphereBackground: React.FC = () => {
  return (
    <>
      <div>
        <svg
          width="256"
          height="132"
          viewBox="0 0 256 132"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute w-[255px] h-[255px] left-[413px] top-[-124px]"
        >
          <circle
            cx="127.678"
            cy="3.67836"
            r="127.36"
            transform="rotate(-0.143373 127.678 3.67836)"
            fill="url(#paint0_radial_2135_14)"
          />
          <defs>
            <radialGradient
              id="paint0_radial_2135_14"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(190.282 -81.3436) rotate(92.517) scale(203.734)"
            >
              <stop stopColor="#A9F99E" />
              <stop offset="0.298916" stopColor="#A9F99E" />
              <stop offset="0.736299" stopColor="#A9F99E" />
              <stop offset="1" stopColor="#A9F99E" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div>
        <svg
          width="138"
          height="138"
          viewBox="0 0 138 138"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute w-[137px] h-[137px] right-[308px] top-[88px]"
        >
          <circle
            cx="68.8654"
            cy="68.8654"
            r="68.6937"
            transform="rotate(-0.143373 68.8654 68.8654)"
            fill="url(#paint0_radial_2135_12)"
          />
          <defs>
            <radialGradient
              id="paint0_radial_2135_12"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(38.3349 33.2464) rotate(59.144) scale(115.955)"
            >
              <stop stopColor="#646464" />
              <stop offset="0.604593" stopColor="#292929" />
              <stop offset="0.796202" stopColor="#0F0F0F" />
              <stop offset="1" stopColor="#1B1B1B" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </>
  );
};
