import React, { useState, useEffect, useRef } from "react";
import {
  Space,
  Switch,
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  FormInstance,
} from "antd";
import axios from "axios";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import UserInfo from "./components/UserInfo";
import { IRole } from "../right-manage/Rolelist";

interface DataType {
  username: string;
  password: string;
  roleState: boolean;
  default: boolean;
  id: number;
  region?: string;
  roleId: number;
}
export interface IRegion {
  id: number;
  text: string;
  value: string;
}
interface FormData {
  password: string;
  region: string;
  roleId: number;
  username: string;
}
const { roleId, region } = JSON.parse(localStorage.getItem("token"));
export default function UserList() {
  const addForm = useRef<FormInstance>(null!);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [regionList, setRegionList] = useState<IRegion[]>([]);
  const [roleList, setRoleList] = useState<IRole[]>([]);
  const [current, setcurrent] = useState<DataType>({});
  useEffect(() => {
    axios.get("/users").then((res) => {
      if (roleId === 1) {
        setDataSource(res.data);
      } else {
        const newData = res.data.filter(
          (item: DataType) => item.roleId >= roleId && item.region === region
        );
        setDataSource(newData);
      }
    });
    axios.get("/regions").then((res) => {
      setRegionList(res.data);
    });
    axios.get("/roles").then((res) => {
      setRoleList(res.data);
    });
  }, []);
  const columns: ColumnsType<DataType> = [
    {
      title: "区域",
      dataIndex: "region",
      filters: regionList,
      onFilter: (value: string, record: DataType) =>
        record.region?.indexOf(value) === 0,
      render: (key: string) => {
        if (key) {
          return key;
        } else {
          return "全球";
        }
      },
    },
    {
      title: "角色名称",
      dataIndex: "",
      key: "roleId",
      render: (key: DataType) => {
        switch (key.roleId) {
          case 1:
            return "超级管理员";
          case 2:
            return "区域管理员";
          case 3:
            return "区域编辑";
          default:
            return "--";
        }
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "用户状态",
      dataIndex: "",
      key: "roleState",
      render: (_, record: DataType) => (
        <Switch
          checked={record.roleState}
          onChange={() => handleChange(record)}
        ></Switch>
      ),
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
            <Button
              danger
              shape="circle"
              icon={<DeleteFilled />}
              disabled={record.roleId === 1}
            ></Button>
          </Popconfirm>

          <Button
            type="primary"
            shape="circle"
            // 按钮是否能点，取决于pagepermisson 属性，这个是菜单权限，能都展示配置
            disabled={record.roleId === 1}
            icon={<EditFilled />}
            onClick={() => handleClick(record)}
          ></Button>
        </Space>
      ),
    },
  ];
  const handleChange = (record: DataType) => {
    console.log(record);
    // 直接改变原数据 引用类型
    record.roleState = !record.roleState;

    setDataSource([...dataSource]);

    axios.patch(`/users/${record.id}`, {
      roleState: record.roleState,
    });
  };
  const handleClick = (record: DataType) => {
    setIsAdd(false);
    setModalOpen(true);
    setTimeout(() => {
      setcurrent(record);
      addForm.current.setFieldsValue(record);
    }, 0);
  };
  const handleOk = () => {
    // 关闭弹窗
    console.log(addForm); //可以拿到子组件的 form

    // 传给后台
    setModalOpen(false);

    addForm.current
      ?.validateFields()
      .then((value: FormData) => {
        // 新增
        if (isAdd) {
          axios
            .post(`/users`, {
              ...value,
              roleState: true,
              default: true,
            })
            .then((res) => {
              console.log(res);
              setDataSource([...dataSource, res.data]);
            });
        } else {
          //更新
          const data = { ...current, ...value };
          for (let i in dataSource) {
            if (dataSource[i].id === data.id) {
              dataSource[i] = data;
            }
          }
          console.log(dataSource);
          setDataSource([...dataSource]);
          axios.patch(`/users/${current.id}`, value).then((res) => {
            console.log(res);
          });
        }
      })
      .catch((err: Error) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setModalOpen(false);
  };
  const confirm = (record: DataType) => {
    console.log(record);

    setDataSource(dataSource?.filter((item) => item.id !== record.id));
    axios.delete(`/users/${record.id}`);

    //
  };

  const cancel = () => {
    message.error("已经取消");
  };
  const handleAdd = () => {
    setIsAdd(true);
    setModalOpen(true);
    setTimeout(() => {
      addForm.current.resetFields();
    }, 0);
  };
  return (
    <div>
      <Button type="primary" onClick={handleAdd}>
        新增用户
      </Button>
      <Table
        dataSource={dataSource}
        rowKey={(item) => item.id}
        columns={columns}
      />
      <Modal
        title={isAdd ? "添加用户信息" : "更新用户信息"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isAdd ? "添加" : "更新"}
      >
        <UserInfo
          isAdd={isAdd}
          ref={addForm}
          regionList={regionList}
          roleList={roleList}
        />
      </Modal>
    </div>
  );
}
