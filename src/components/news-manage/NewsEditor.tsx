import React, { useState, useEffect } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
// 引入样式
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
type InsertFnType = (url: string, alt: string, href: string) => void;

interface INews {
  getContent: (value: string) => void;
}
export default function NewsEditor(props: INews) {
  const getContent = props.getContent;
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法
  // 编辑器内容
  const [html, setHtml] = useState("");

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    // onBlur: () => handleBlur(),
    MENU_CONF: {
      uploadImage: {
        server:
          "https://umopwx-uat.saas.cmsk1979.com/file/api/file-storage/ftu/upload-image",
        fieldName: "file",

        // 自定义插入图片
        customInsert(res: any, insertFn: InsertFnType) {
          const alt = res.url;
          const href = res.url;
          insertFn(res.url, alt, href);
        },
      },
    },
  };
  const handleChange = (editor: IDomEditor) => {
    setHtml(editor.getHtml());
    getContent(editor.getHtml());
  };
  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => handleChange(editor)}
          mode="default"
          style={{ height: "500px", overflowY: "hidden" }}
        />
      </div>
      <div style={{ marginTop: "15px" }}>{html}</div>
    </>
  );
}
