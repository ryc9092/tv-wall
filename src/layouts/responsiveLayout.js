import { useContext } from "react";
import { StoreContext } from "../components/store/store";
import { Layout } from "antd";
import { Header } from "antd/es/layout/layout";
import "./responsiveLayout.scss";

const { Content, Sider } = Layout;

const ResponsiveLayout = ({ topbar, sidebar, main }) => {
  const [store] = useContext(StoreContext);

  return (
    <Layout style={{ width: 1920, height: 1080 }}>
      <Header style={{ width: 1920, height: 56 }}>{topbar}</Header>
      <Layout style={{ width: 1920, height: 1024 }}>
        <Sider
          collapsible
          collapsedWidth={72}
          collapsed={store.siderCollapse}
          zeroWidthTriggerStyle={{ display: "none" }}
          style={{ width: 224, height: 1024, backgroundColor: "#e7e7e7" }}
        >
          {sidebar}
        </Sider>
        <Content style={{ width: 856, height: 1024 }}>{main}</Content>
      </Layout>
    </Layout>
  );
};

export default ResponsiveLayout;
