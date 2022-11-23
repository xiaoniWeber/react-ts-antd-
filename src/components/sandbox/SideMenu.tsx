import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import axios from "axios";
import { UserOutlined } from "@ant-design/icons";
interface ISidemenu {
  collapsed: boolean;
}
export interface Idata {
  id: number;
  label: string;
  rightId: number;
  key: string;
  rade: number;
  pagepermisson: number | string;
  children: Idata[] | string;
  icon: React.ReactNode;
}
const { Sider } = Layout;

export default function SideMenu(props: ISidemenu) {
  const [menu, setMenu] = useState<Idata[]>();
  const collapsed = props.collapsed;
  const navigator = useNavigate();
  const defaultOpenKeys = "/" + useLocation().pathname.split("/")[1];
  const handleClick = ({ key }: { key: string }) => {
    navigator(key);
  };
  const token = localStorage.getItem("token") as string;
  const {
    role: { rights },
  } = JSON.parse(token);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      const data = res.data.filter(
        (item: Idata) => item.pagepermisson === 1 && rights.includes(item.key)
      );
      setMenu(filterAllData(data));
    });
  }, []);

  const filterAllData = (data: Idata[]) => {
    let newdata: Idata[] | string = [];
    for (let i in data) {
      data[i].icon = <UserOutlined />;
      if (data[i].children?.length > 0) {
        let child = data[i].children as Idata[];
        newdata = child.filter((item: Idata) => {
          item.icon = <UserOutlined />;
          return item.pagepermisson === 1 && rights.includes(item.key);
        });
      }

      if (data[i].children?.length === 0) {
        let child = data[i].children as string;
        child = "";
        newdata = child;
      }
      data[i].children = newdata;
    }
    return data;
  };
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo">全球新闻发布系统</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[useLocation().pathname]}
        onClick={handleClick}
        items={menu}
        defaultOpenKeys={[defaultOpenKeys]}
      />
    </Sider>
  );
}
