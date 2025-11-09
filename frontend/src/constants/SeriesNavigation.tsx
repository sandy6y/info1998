import Skullpanda from "../pages/Skullpanda";
import Hirono from "../pages/Hirono";
import Labubu from "../pages/Labubu";

export const BACKEND_BASE_PATH = 'https://fa23-lec9-demo-soln.fly.dev/api';

export const SPATHS: {
    link: string;
    label: string;
    element?: JSX.Element;
}[] = [
    {
        link: "skullpanda",
        label: "Skullpanda",
        element: <Skullpanda />,
    },
        {
        link: "hirono",
        label: "Hirono",
        element: <Hirono />,
    },
        {
        link: "labubu",
        label: "Labubu",
        element: <Labubu />,
    },
];
