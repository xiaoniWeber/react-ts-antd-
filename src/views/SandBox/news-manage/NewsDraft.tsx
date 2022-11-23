import React, { useState, useEffect } from "react";
import { Button, Table, Modal, notification } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
const { confirm } = Modal;
export interface Ica {
  id: number;
  label: string;
  value: string;
}

export interface INews {
  auditState: number;
  author: string;
  category: Ica;
  categoryId: number;
  content: string;
  createTime: number;
  id: number;
  label: string;
  publishState: number;
  region: string;
  roleId: number;
  star: number;
  view: number;
  publishTime: number;
}
export default function NewsDraft() {
  const navigate = useNavigate();
  const [dataSource, setdataSource] = useState<INews[]>([]);
  const token = localStorage.getItem("token") as string;
  const { username } = JSON.parse(token);
  useEffect(() => {
    axios
      .get(`/news?author=${username}&auditState=0&_expand=category`)
      .then((res) => {
        const list = res.data;
        setdataSource(list);
      });
  }, [username]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number) => {
        return <b>{id}</b>;
      },
    },
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
      title: "分类",
      dataIndex: "category",
      render: (category: Ica) => {
        return category.label;
      },
    },
    {
      title: "操作",
      render: (item: INews) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => confirmMethod(item)}
            />

            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                navigate(`/news-manage/update/${item.id}`);
              }}
            />

            <Button
              type="primary"
              shape="circle"
              icon={<UploadOutlined />}
              onClick={() => handleCheck(item.id)}
            />
          </div>
        );
      },
    },
  ];

  const handleCheck = (id: number) => {
    axios
      .patch(`/news/${id}`, {
        auditState: 1,
      })
      .then((res) => {
        navigate("/audit-manage/list");

        notification.info({
          message: `通知`,
          description: `您可以到${"审核列表"}中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };

  const confirmMethod = (item: INews) => {
    confirm({
      title: "你确定要删除?",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        //   console.log('OK');
        deleteMethod(item);
      },
      onCancel() {
        //   console.log('Cancel');
      },
    });
  };
  //删除
  const deleteMethod = (item: INews) => {
    // console.log(item)
    // 当前页面同步状态 + 后端同步

    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/news/${item.id}`);
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
