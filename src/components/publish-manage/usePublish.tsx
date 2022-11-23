import { useEffect, useState } from "react";
import axios from "axios";
import { notification } from "antd";

export interface IData {
  label: string;
  categoryId: number;
  content: string;
  region: string;
  author: string;
  roleId: number;
  auditState: number;
  publishState: number;
  createTime: number;
  star: number;
  view: number;
  id: number;
  publishTime: number;
  category: {
    id: number;
    label: string;
    value: string;
  };
}
function usePublish(type: number) {
  const token = localStorage.getItem("token") as string;
  const { username } = JSON.parse(token);

  const [dataSource, setdataSource] = useState<IData[]>([]);
  useEffect(() => {
    axios(
      `/news?author=${username}&publishState=${type}&_expand=category`
    ).then((res) => {
      // console.log(res.data)
      setdataSource(res.data);
    });
  }, [username, type]);

  const handlePublish = (id: number) => {
    setdataSource(dataSource.filter((item) => item.id !== id));

    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到【发布管理/已经发布】中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };

  const handleSunset = (id: number) => {
    setdataSource(dataSource.filter((item) => item.id !== id));

    axios
      .patch(`/news/${id}`, {
        publishState: 3,
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到【发布管理/已下线】中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };

  const handleDelete = (id: number) => {
    setdataSource(dataSource.filter((item) => item.id !== id));

    axios.delete(`/news/${id}`).then((res) => {
      notification.info({
        message: `通知`,
        description: `您已经删除了已下线的新闻`,
        placement: "bottomRight",
      });
    });
  };

  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete,
  };
}

export default usePublish;
