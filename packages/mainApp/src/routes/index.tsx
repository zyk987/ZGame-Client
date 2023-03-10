import { ReactNode } from "react";
import icon1 from "../assets/2048.png";
import { createFromIconfontCN } from "@ant-design/icons";
import GameWindow from "@/Pages/GameWindow";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_3941644_g88dp1j4r4m.js",
});

export type RouteOpts = {
  path: string;
  label: string;
  icon?: ReactNode;
  element?: ReactNode;
};

export const routes: RouteOpts[] = [
  {
    path: "/2048",
    label: "2048",
    icon: <IconFont type="icon-a-2048" />,
    element: <GameWindow />,
  },
  {
    path: "/vite-vue-app",
    label: "VueApp",
    element: <GameWindow />,
  },
];
