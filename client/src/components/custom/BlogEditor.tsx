import { memo, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./Tool";

const BlogEditor = ({ data, onChange, editorBlock }) => {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorBlock,
        data,
        tools: EDITOR_JS_TOOLS,
        async onChange(api) {
          const savedData = await api.saver.save();
          onChange(savedData);
        },
      });
      ref.current = editor;
    }

    return () => {
      // if (ref.current && typeof ref.current.destroy === "function") {
      //   ref.current.destroy().then(() => {
      //     ref.current = null;
      //   });
      // }
    };
  }, []);

  return <div id={editorBlock} />;
};

export default memo(BlogEditor);
