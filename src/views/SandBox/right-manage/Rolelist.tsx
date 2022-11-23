import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Popconfirm } from "antd";
import { Space, Modal, Tree } from "antd";
import { DeleteFilled, UnorderedListOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import { Idata } from "./../../../components/sandbox/SideMenu";

export interface IRole {
  id: number;
  roleName: string;
  roleType: number;
  rights: string[];
}
interface IRight {
  checked: string[];
}
export default function Rolelist() {
  const [rolelist, setRoleList] = useState<IRole[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [roloData, setRoleData] = useState<Idata[]>([]);
  const [currentRights, setcurrentRights] = useState<string[]>([]);
  const [currentId, setcurrentId] = useState(0);
  useEffect(() => {
    axios.get("/roles").then((res) => {
      setRoleList(res.data);
    });
    axios.get("/rights?_embed=children").then((res) => {
      for (let i in res.data) {
        res.data[i].title = res.data[i].label;
        if (res.data[i].children.length > 0) {
          for (let j in res.data[i].children) {
            res.data[i].children[j].title = res.data[i].children[j].label;
          }
        }
        if (res.data[i].children.length === 0) {
          res.data[i].children = "";
        }
      }
      setRoleData(res.data);
      //所有的权限，是否打勾有别的属性决定 checkedKeys 当前选项所具有的权限
    });
  }, []);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "操作",
      dataIndex: "",
      key: "x",
      render: (_, record: IRole) => (
        <Space size={"middle"}>
          <Popconfirm
            title="确定要删除这个角色?"
            onConfirm={() => confirm(record)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button danger shape="circle" icon={<DeleteFilled />}></Button>
          </Popconfirm>
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => showModal(record)}
          ></Button>
          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Tree
              checkable
              onSelect={onSelect}
              onCheck={onCheck}
              treeData={roloData}
              checkedKeys={currentRights}
              checkStrictly
            />
          </Modal>
        </Space>
      ),
    },
  ];

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    setcurrentRights(checkedKeys);
  };
  const confirm = (record: IRole) => {
    setRoleList(rolelist?.filter((item) => item.id !== record.id));
    axios.delete(`/roles/${record.id}`);
  };
  const cancel = () => {};
  const showModal = (record: IRole) => {
    setcurrentRights(record.rights);
    setcurrentId(record.id);
    setModalOpen(true);
  };
  const handleOk = () => {
    setModalOpen(false);
    console.log(currentRights);

    for (let i in rolelist) {
      if (rolelist[i].id === currentId) {
        rolelist[i] = { ...rolelist[i], rights: currentRights.checked };
      }
    }
    setRoleList([...rolelist]);
    // axios.
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights.checked,
    });
  };
  const handleCancel = () => {
    setModalOpen(false);
  };
  return (
    <div>
      <Table
        dataSource={rolelist}
        rowKey={(item) => item.id}
        columns={columns}
      ></Table>
    </div>
  );
}
