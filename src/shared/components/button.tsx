import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<
    ButtonHTMLAttributes<HTMLButtonElement> & {
        color?: "green" | "purple" | "blue" | "yellow" | "white";
        size?: "sm" | "md" | "xs";
        square?: boolean;
    }
>;

export default function Button({
    size = "md",
    color = "purple", 
    className = "",
    square = false,
    children,
    ...rest 
}: ButtonProps) {
    const base = [
        "inline-flex w-auto items-center justify-center font-semibold",
        "transition disabled:cursor-not-allowed appearance-none bg-transparent",
        "focus:outline-none cursor-pointer rounded-lg",
        ].join(" ");

    const sizes = {
        md: "h-10 px-4 text-sm",
        sm: "h-8 px-2 text-xs",
        xs: "h-9 px-3 text-sm", 
    };

    const colors = {
        green:  "border-2 border-[#30C0B7] text-[#30C0B7]",
        purple: "border-2 border-[#E977F5] text-[#E977F5]",
        blue:   "border-2 border-[#3DE0FC] text-[#3DE0FC]",
        yellow: "border-2 border-[#ffff79] text-[#ffff79]",
        white:  "border-2 border-[#d4d4d8] text-[#d4d4d8]",
    };

   
    const squareSize = 
         size === "sm" ? "h-8 w-8 text-xs" : size === "xs" ? "h-9 w-9 text-sm" : "h-10 w-10 text-sm";
    return (
        <button
            className={`${base} ${square ? squareSize : sizes[size]} ${colors[color]} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}