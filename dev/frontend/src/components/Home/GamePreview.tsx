import * as React from "react";

export const GamePreview: React.FC = () => {
    return (
        <div className="relative h-[509px] w-[501px] max-lg:h-[440px] max-lg:w-[400px] max-md:h-[330px] max-md:w-[300px]">
            <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c252629015bdcb5ff69024268ca95e06fd27001c"
                className="absolute h-full rounded-[46px] w-full object-cover"
                alt="Game preview"
            />
            <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a6b4854a7ebbeff5791a13978a66cad194a99b25"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[75%] w-[90%] max-lg:h-[85%] max-lg:w-[95%] max-md:h-[80%] max-md:w-[85%] object-contain"
                alt="Game interface"
            />
        </div>
    );
};
