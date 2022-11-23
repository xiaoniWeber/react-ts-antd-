import React, { forwardRef, useState } from "react";
import { Form, FormInstance, Input, Select } from "antd";

import { IRegion } from "../UserList";
import { IRole } from "../../right-manage/Rolelist";

interface IRegionList {
  regionList: IRegion[];
  roleList: IRole[];
  isAdd: boolean;
}
const { Option } = Select;
const token = localStorage.getItem("token") as string;
const {
  region,
  role: { roleType },
} = JSON.parse(token);
const UserInfo = forwardRef<FormInstance, IRegionList>((props, ref) => {
  const regionList = props.regionList;
  const roleList = props.roleList;
  const [disableRegion, setdisableRegion] = useState(false);
  const onFinish = (values: any) => {
    console.log(values);
  };
  const onFinishFailed = () => {};
  const onRegionChange = () => {};
  const onRoleChange = (value: number) => {
    if (value === 1) {
      setdisableRegion(true);
      //清空区域的值
      console.log(ref);
      ref.current.setFieldValue("region", "");
    } else {
      setdisableRegion(false);
    }
  };
  return (
    <div>
      <Form
        ref={ref}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="区域"
          name="region"
          rules={disableRegion ? [] : [{ required: true }]}
        >
          <Select
            placeholder="选择区域"
            onChange={onRegionChange}
            disabled={disableRegion}
            allowClear
          >
            {regionList.map((item) => {
              return (
                <Option
                  disabled={
                    roleType !== 1 && item.value !== region ? true : false
                  }
                  value={item.value}
                  key={item.id}
                >
                  {item.text}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="角色" name="roleId" rules={[{ required: true }]}>
          <Select placeholder="选择角色" onChange={onRoleChange} allowClear>
            {roleList.map((item) => {
              return (
                <Option
                  value={item.id}
                  key={item.id}
                  disabled={item.roleType <= roleType ? true : false}
                >
                  {item.roleName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
});
export default UserInfo;
