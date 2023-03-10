import { memo, useState } from "react";
import { Layout, Menu, MenuProps } from "antd";
import { getItem } from "utils/antd";
import { RouteOpts, routes } from "../routes";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const SiderMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();

  const items: MenuProps["items"] = routes.map((item: RouteOpts) =>
    getItem(<Link to={item.path}>{item.label}</Link>, item.path, item.icon)
  );

  return (
    <Sider
      theme={"light"}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <a href="/">
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <h3>ZGame</h3>
        </div>
      </a>
      <Menu
        defaultSelectedKeys={["/2048"]}
        selectedKeys={[location.pathname]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default memo(SiderMenu);
