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
    const base = 
        "inline-flex w-auto items-center justify-center font-semibold rounded-lg " +
        "transition disabled:opacity-60 disabled:cursor-not-allowed appearance-none" +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]/40";
    const sizes = {
        md: "h-10 px-4 text-sm",
        sm: "h-8 px-2 text-xs",
        xs: "h-9 px-3 text-sm", 
    };

    const colors = {
        green:  "border-2 border-[#22c55e] text-[#22c55e]",
        purple: "border-2 border-[#8b5cf6] text-[#8b5cf6]",
        blue:   "border-2 border-[#3b82f6] text-[#3b82f6]",
        yellow: "border-2 border-[#eab308] text-[#eab308]",
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