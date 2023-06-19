import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";
import { BrowserRouter } from "react-router-dom";

let root: any;
function render(props: any) {
  const { container } = props;
  const dom = container
    ? container.querySelector("#root")
    : document.getElementById("root");
  root = ReactDOM.createRoot(dom);
  root.render(
    <React.StrictMode>
      <BrowserRouter
        basename={(window as any).__POWERED_BY_QIANKUN__ ? "/2048" : "/"}
      >
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

renderWithQiankun({
  mount(props: any) {
    // console.log("mount");
    render(props);
  },
  bootstrap() {
    // console.log("bootstrap");
  },
  unmount(props: any) {
    const { container } = props;
    root.unmount(
      container
        ? container.querySelector("#root")
        : document.getElementById("root")
    );
  },
  update() {},
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}
