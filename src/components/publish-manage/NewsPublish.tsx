import React from "react";
import { Table } from "antd";
import { IData } from "./usePublish";
interface IDataSource {
  dataSource: IData[];
  button: (id: number) => JSX.Element;
}
export default function NewsPublish(props: IDataSource) {
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "label",
      render: (label: string, item: IData) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{item.label}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category: IData) => {
        console.log(category);
        return <div>{category.label}</div>;
      },
    },
    {
      title: "操作",
      render: (item: IData) => {
        return <div>{props.button(item.id)}</div>;
      },
    },
  ];

  return (
    <div>
      <Table
        dataSource={props.dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
