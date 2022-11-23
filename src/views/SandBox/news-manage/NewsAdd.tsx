import React, { useEffect, useState, useRef } from "react";
import {
  PageHeader,
  Steps,
  Button,
  Form,
  Input,
  Select,
  message,
  notification,
} from "antd";
import style from "./News.module.css";
import axios from "axios";
import NewsEditor from "../../../components/news-manage/NewsEditor";
import { useNavigate } from "react-router-dom";
const { Step } = Steps;
const { Option } = Select;
interface ICate {
  id: number;
  label: string;
  value: string;
}
export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState<ICate[]>([]);
  const [sendData, setSendData] = useState("");
  const [formInfo, setformInfo] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token") as string;
  const User = JSON.parse(token);
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        ?.validateFields()
        .then((res) => {
          console.log(res);
          setformInfo(res);
          setCurrent(current + 1);
        })
        .catch((error: Error) => {
          console.log(error);
        });
    } else {
      console.log(sendData);
      if (sendData === "" || sendData.trim() === "<p></p>") {
        message.error("新闻内容不能为空");
      } else {
        setCurrent(current + 1);
      }
    }
  };
  const handlePrevious = () => {
    setCurrent(current - 1);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const NewsForm = useRef(null);

  useEffect(() => {
    axios.get("/categories").then((res) => {
      // console.log(res.data)
      setCategoryList(res.data);
    });
  }, []);
  const items = [
    { title: "基本信息", description: "新闻标题，新闻分类" },
    { title: "新闻内容", description: "新闻主体内容" },
    { title: "新闻提交", description: "保存草稿或者提交审核" },
  ];
  const getContent = (data: string) => {
    // 新闻的内容
    console.log(data);
    setSendData(data);
  };
  const handleSave = (auditState: number) => {
    axios
      .post("/news", {
        ...formInfo,
        content: sendData,
        region: User.region ? User.region : "全球",
        author: User.username,
        roleId: User.roleId,
        auditState: auditState,
        publishState: 0,
        createTime: Date.now(),
        star: 0,
        view: 0,
        // "publishTime": 0
      })
      .then((res) => {
        navigate(
          auditState === 0 ? "/news-manage/draft" : "/audit-manage/list"
        );

        notification.info({
          message: `通知`,
          description: `您可以到${
            auditState === 0 ? "草稿箱" : "审核列表"
          }中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />

      <Steps current={current} items={items}></Steps>

      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? "" : style.active}>
          <Form {...layout} name="basic" ref={NewsForm}>
            <Form.Item
              label="新闻标题"
              name="label"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Select>
                {categoryList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className={current === 1 ? "" : style.active}>
          <NewsEditor getContent={getContent}></NewsEditor>
        </div>
        <div className={current === 2 ? "" : style.active}></div>
      </div>
      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
      </div>
    </div>
  );
}
