import { Roboto } from "next/font/google";

const roboto = Roboto({
    subsets: ["latin", "vietnamese"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--font-roboto"
});

export { roboto };