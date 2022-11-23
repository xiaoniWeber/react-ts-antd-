import React, { useEffect, useState } from "react";
import { Table, Button, Tag, notification } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Ica, INews } from "../news-manage/NewsDraft";

export default function AuditList() {
  const [dataSource, setdataSource] = useState([]);
  const navigator = useNavigate();
  const token = localStorage.getItem("token") as string;
  const { username } = JSON.parse(token);
  useEffect(() => {
    axios(
      `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
    ).then((res) => {
      setdataSource(res.data);
    });
  }, [username]);

  const columns = [
    {
      title: "新闻标题",
      dataIndex: "label",
      render: (label: string, item: INews) => {
        return <Link to={`/news-manage/preview/${item.id}/*`}>{label}</Link>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category: Ica) => {
        return <div>{category.label}</div>;
      },
    },
    {
      title: "审核状态",
      dataIndex: "auditState",
      render: (auditState: number) => {
        const colorList = ["", "orange", "green", "red"];
        const auditList = ["草稿箱", "审核中", "已通过", "未通过"];
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>;
      },
    },
    {
      title: "操作",
      render: (item: INews) => {
        return (
          <div>
            {item.auditState === 1 && (
              <Button onClick={() => handleRervert(item)}>撤销</Button>
            )}
            {item.auditState === 2 && (
              <Button danger onClick={() => handlePublish(item)}>
                发布
              </Button>
            )}
            {item.auditState === 3 && (
              <Button type="primary" onClick={() => handleUpdate(item)}>
                更新
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const handleRervert = (item: INews) => {
    setdataSource(dataSource.filter((data: INews) => data.id !== item.id));

    axios
      .patch(`/news/${item.id}`, {
        auditState: 0,
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到草稿箱中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };

  const handleUpdate = (item: INews) => {
    navigator(`/news-manage/update/${item.id}`);
  };

  const handlePublish = (item: INews) => {
    axios
      .patch(`/news/${item.id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        navigator("/publish-manage/published");

        notification.info({
          message: `通知`,
          description: `您可以到【发布管理/已经发布】中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
