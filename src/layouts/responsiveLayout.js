import { useContext } from "react";
import { StoreContext } from "../components/store/store";
import { Actions } from "../components/store/reducer";
import useWindowDimensions from "../utils/WindowDimension";
import { Layout } from "antd";
import { useEffect } from "react";

const { Content, Sider } = Layout;
export const SIDEBAR_WIDTH = 240;

const ResponsiveLayout = ({ sidebar, main }) => {
  const { width } = useWindowDimensions();
  const [store, dispatch] = useContext(StoreContext);

  const onCollapse = (collapsed) => {
    dispatch({ type: Actions.SetSiderCollapse, payload: collapsed });
  };

  useEffect(() => {
    if (width > 1024) onCollapse(false);
    else onCollapse(true);
  }, [width]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsedWidth="0"
        theme="light"
        width={SIDEBAR_WIDTH}
        collapsible
        collapsed={store.siderCollapse}
        onCollapse={(collapsed, type) => {
          onCollapse(collapsed);
        }}
        zeroWidthTriggerStyle={{
          top: 72,
          left: 6,
          fontSize: "24pt",
          border: "0 solid",
        }}
      >
        {sidebar}
      </Sider>
      <Content
        style={{
          paddingTop: 10,
          paddingLeft: store.siderCollapse ? 100 : 50,
          backgroundColor: "white",
        }}
      >
        {main}
      </Content>
    </Layout>
  );
};

export default ResponsiveLayout;
