import React, { useState, useEffect } from "react";
import {
  Space,
  Switch,
  Table,
  Tag,
  Button,
  Popconfirm,
  message,
  Popover,
} from "antd";
import axios from "axios";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
interface DataType {
  key: number;
  label: string;
  pagepermisson: number;
  grade: number;
  id: number;
  rightId?: number;
  children: DataType[];
}

export default function Rightlist() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      if (res.data[0].children.length === 0) {
        res.data[0].children = "";
      }
      setDataSource(res.data);
    });
  }, []);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "权限名称",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      key: "key",
      render: (key: string) => {
        const color = "yellow";
        return (
          <Tag color={color} key={key}>
            {key}
          </Tag>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "",
      key: "x",
      render: (_, record: DataType) => (
        <Space size="middle">
          <Popconfirm
            title="确定要删除这个任务?"
            onConfirm={() => confirm(record)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button danger shape="circle" icon={<DeleteFilled />}></Button>
          </Popconfirm>
          <Popover
            title="页面是否配置显示"
            style={{ textAlign: "center" }}
            content={
              <Switch
                checked={record.pagepermisson ? true : false}
                onChange={() =>
                  handleChange(record.pagepermisson ? true : false, record)
                }
              ></Switch>
            }
            trigger={record.pagepermisson === undefined ? "" : "click"}
          >
            <Button
              type="primary"
              shape="circle"
              // 按钮是否能点，取决于pagepermisson 属性，这个是菜单权限，能都展示配置
              disabled={record.pagepermisson === undefined}
              icon={<EditFilled />}
            ></Button>
          </Popover>
        </Space>
      ),
    },
  ];
  const handleChange = (checked: boolean, record: DataType) => {
    console.log(record);
    // 直接改变原数据 引用类型
    record.pagepermisson = record.pagepermisson === 1 ? 0 : 1;

    setDataSource([...dataSource]);
    if (record.grade === 1) {
      axios.patch(`/rights/${record.id}`, {
        pagepermisson: record.pagepermisson,
      });
    } else {
      axios.patch(`/children/${record.id}`, {
        pagepermisson: record.pagepermisson,
      });
    }
  };
  const confirm = (record: DataType) => {
    console.log(record);
    if (record.grade === 2) {
      // 取出来id 找到当前的父亲，删除孩子
      for (let i in dataSource) {
        if (dataSource[i].id === record.rightId) {
          const data = dataSource[i].children?.filter(
            (item) => item.id !== record.id
          );
          dataSource[i].children = data;
          console.log(data);
        }
      }
      console.log(dataSource); // ...浅拷贝 等于没有变化，通过展开运算符来操作
      setDataSource([...dataSource]);
      axios.delete(`/children/${record.id}`);
    } else {
      setDataSource(dataSource?.filter((item) => item.key !== record.key));
      axios.delete(`/rights/${record.id}`);
    }
    //
  };

  const cancel = () => {
    message.error("已经取消");
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        rowKey={(item) => item.id}
        columns={columns}
      />
      ;
    </div>
  );
}
