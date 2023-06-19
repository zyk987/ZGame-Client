import { memo, ReactNode } from "react";
import { ConfigProvider, Layout } from "antd";
import { publicTheme } from "config/theme";
import styles from "./index.module.less";
import SiderMenu from "./SiderMenu";

const { Content } = Layout;

interface HomeProps {
  children: ReactNode;
}

const BaseLayout: React.FC<HomeProps> = (props) => {
  const { children } = props;
  return (
    <ConfigProvider theme={publicTheme}>
      <Layout style={{ minHeight: "100vh" }}>
        <SiderMenu />
        <Layout className={styles.contentLayout}>
          <Content className={styles.content}>{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default memo(BaseLayout);
