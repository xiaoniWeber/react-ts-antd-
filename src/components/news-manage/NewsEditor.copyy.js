import React, { useState } from "react";
import { message } from "antd";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
// 引入样式
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
  const getContent = props.getContent;
  const [editorState, seteditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (state) => {
    seteditorState(state);
  };
  const handleChange = () => {
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onEditorStateChange}
        onBlur={handleChange}
      />
      <textarea
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      />
    </div>
  );
}
