import React from "react";
import { Layout, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";

const { Header } = Layout;

interface ITopheader {
  collapsed: boolean;
  handleClick: (value: boolean) => void;
}

export default function TopHeader(props: ITopheader) {
  const collapsed = props.collapsed;
  const click = props.handleClick;
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.removeItem("token");
    navigate("./login");
  };
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token"));
  const items: MenuProps["items"] = [
    {
      label: <div>{roleName}</div>,
      key: "0",
    },
    {
      label: <div onClick={handleClick}>退出</div>,
      key: "1",
    },
  ];
  return (
    <div>
      <Header className="site-layout-background" style={{ padding: "16px" }}>
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            onClick: () => click(!collapsed),
          }
        )}
        <div style={{ float: "right" }}>
          <span>欢迎你回来 {username}</span>
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Avatar size="large" icon={<UserOutlined />} />
            </a>
          </Dropdown>
        </div>
      </Header>
    </div>
  );
}
