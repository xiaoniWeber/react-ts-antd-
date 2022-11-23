import React, { useState } from "react";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/topheader/TopHeader";
import NewsRouter from "../../components/sandbox/NewsRouter";
import "./newsSandBox.css";
import { Layout } from "antd";
const { Content } = Layout;
export default function NewsSandBox() {
  const [collapsed, setCollapsed] = useState(false);
  const setData = (value: boolean) => {
    setCollapsed(value);
  };
  return (
    <Layout>
      <SideMenu collapsed={collapsed}></SideMenu>
      <Layout className="site-layout">
        <TopHeader collapsed={collapsed} handleClick={setData}></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  );
}
