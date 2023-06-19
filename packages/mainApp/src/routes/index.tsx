import { ReactNode } from "react";
import icon1 from "../assets/2048.png";
import { createFromIconfontCN } from "@ant-design/icons";
import GameWindow from "@/Pages/GameWindow";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_3941644_p4fl7ortcej.js",
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
    path: "/reactor-tower",
    label: "反应堆塔",
    icon: <IconFont type="icon-stack" />,
    element: <GameWindow />,
  },
];
