import { useContext } from "react";
import { StoreContext } from "../components/store/store";
import { Layout } from "antd";
import { Header } from "antd/es/layout/layout";
import "./responsiveLayout.scss";

const { Content, Sider } = Layout;

const ResponsiveLayout = ({ topbar, sidebar, main }) => {
  const [store] = useContext(StoreContext);

  return (
    <Layout style={{ height: "100vh" }}>
      <Header>{topbar}</Header>
      <Layout>
        <Sider
          collapsible
          collapsedWidth={72}
          collapsed={store.siderCollapse}
          zeroWidthTriggerStyle={{ display: "none" }}
          style={{ backgroundColor: "#e7e7e7" }}
        >
          {sidebar}
        </Sider>
        <Content>{main}</Content>
      </Layout>
    </Layout>
  );
};

export default ResponsiveLayout;
