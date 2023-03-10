import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./public-path";
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

  reportWebVitals();
}

if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log("[react18] react app bootstraped");
}

export async function mount(props: any) {
  console.log("[react18] props from main framework", props);
  render(props);
}

export async function unmount(props: any) {
  const { container } = props;
  root.unmount(
    container
      ? container.querySelector("#root")
      : document.getElementById("root")
  );
}
