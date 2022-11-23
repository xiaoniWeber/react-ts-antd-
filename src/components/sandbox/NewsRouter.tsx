import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Spin } from "antd";
import Home from "../../views/SandBox/home/Home";
import UserList from "../../views/SandBox/user-manage/UserList";
import Rightlist from "../../views/SandBox/right-manage/Rightlist";
import Rolelist from "../../views/SandBox/right-manage/Rolelist";
import Nopermission from "../../views/SandBox/nopermission/Nopermission";
import NewsAdd from "../../views/SandBox/news-manage/NewsAdd";
import NewsDraft from "../../views/SandBox/news-manage/NewsDraft";
import NewsCategory from "../../views/SandBox/news-manage/NewsCategory";
import Audit from "../../views/SandBox/audit-manage/Audit";
import AuditList from "../../views/SandBox/audit-manage/AuditList";
import Unpublished from "../../views/SandBox/publish-manage/Unpublished";
import Published from "../../views/SandBox/publish-manage/Published";
import Sunset from "../../views/SandBox/publish-manage/Sunset";
import NewsPreview from "../../views/SandBox/news-manage/NewsPreview";
import NewsUpdate from "../../views/SandBox/news-manage/NewsUpdate";
import { connect } from "react-redux";

const isValidKey = (
  key: string | number | symbol,
  object: object
): key is keyof typeof object => {
  return key in object;
};
const LocalRouterMap = {
  "/home": <Home />,
  "/user-manage/list": <UserList />,
  "/right-manage/role/list": <Rolelist />,
  "/right-manage/right/list": <Rightlist />,
  "/news-manage/add": <NewsAdd />,
  "/news-manage/draft": <NewsDraft />,
  "/news-manage/preview/:id/*": <NewsPreview />,
  "/news-manage/update/:id/*": <NewsUpdate />,
  "/news-manage/category": <NewsCategory />,
  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/unpublished": <Unpublished />,
  "/publish-manage/published": <Published />,
  "/publish-manage/sunset": <Sunset />,
};
interface IRouter {
  grade: number;
  id: number;
  key: string;
  label: string;
  pagepermisson: number;
  routepermisson: number;
}
const token = localStorage.getItem("token") as string;
const {
  role: { rights },
} = JSON.parse(token);
const NewsRouter = (props: { isLoading: boolean }) => {
  const [BackRouteList, setBackRouteList] = useState<IRouter[]>([]);
  useEffect(() => {
    Promise.all([axios.get("/rights"), axios.get("/children")]).then((res) => {
      setBackRouteList([...res[0].data, ...res[1].data]);
    });
  }, []);
  // 控制路由

  const checkRoute = (item: IRouter) => {
    // 在权限列表中禁用或者删除权限菜单之后 校验 禁用则pagePermission为false
    // 删除之后，则localRouterMap中找不到此项
    if (isValidKey(item.key, LocalRouterMap))
      return (
        LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
      );
  };
  const checkUserPermission = (item: IRouter) => {
    //当前登录的用户是否包含此项权限
    return rights.includes(item.key);
  };

  return (
    <div>
      <Spin size="large" spinning={props.isLoading}>
        <Routes>
          {BackRouteList.map((item) => {
            console.log(checkUserPermission(item));
            console.log(checkRoute(item));
            if (checkRoute(item) && checkUserPermission(item)) {
              return (
                <Route
                  path={item.key}
                  key={item.key}
                  element={
                    isValidKey(item.key, LocalRouterMap) &&
                    LocalRouterMap[item.key]
                  }
                />
              );
            }
            return null;
          })}
          <Route path="/" element={<Navigate to="/home" />} />
          {BackRouteList.length > 0 && (
            <Route path="*" element={<Nopermission />} />
          )}
        </Routes>
      </Spin>
    </div>
  );
};
const mapStateToProps = ({
  LoadingReducer: { isLoading },
}: {
  LoadingReducer: { isLoading: boolean };
}) => ({
  isLoading,
});

export default connect(mapStateToProps)(NewsRouter);
