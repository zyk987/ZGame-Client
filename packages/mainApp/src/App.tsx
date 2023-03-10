import { Navigate, Route, Routes } from "react-router-dom";
import BaseLayout from "./Layout";
import { RouteOpts, routes } from "./routes";

function App() {
  return (
    <div className="App">
      <BaseLayout>
        <Routes>
          <Route path="/" element={<Navigate to={"/2048"} />} />
          {routes.map((item: RouteOpts) => (
            <Route path={item.path} element={item.element}></Route>
          ))}
        </Routes>
      </BaseLayout>
    </div>
  );
}

export default App;
