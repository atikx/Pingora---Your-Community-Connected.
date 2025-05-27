import { use, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { EditorTools } from "../../lib/EditorTools";
import "./editorStyles.css";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewPost() {
  const editorRef = useRef<EditorJS | null>(null); // Store EditorJS instance

  const saved = localStorage.getItem("postData");
  const sampleData = saved
    ? JSON.parse(saved)
    : {
        time: Date.now(),
        blocks: [],
        version: "2.31.0-rc.7",
      };

  useEffect(() => {
    const editor = new EditorJS({
      holder: "editorjs",
      data: sampleData,
      tools: EditorTools,
      placeholder: "Start writing your post...",
      onChange: async () => {
        try {
          const content = await editor.save();
          localStorage.setItem("postData", JSON.stringify(content));
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      },
    });

    editorRef.current = editor;

    return () => {
      editor.isReady
        .then(() => editor.destroy())
        .catch((e) => console.error("Editor cleanup error", e));
    };
  }, []);

  const navigate = useNavigate();

  return (
    <div className="w-full pb-20 text-center h-full">
      <div id="editorjs" className="w-full editorjs"></div>
      <Button
        variant="default"
        className="cursor-pointer"
        onClick={() => {
          navigate("/addPostData");
        }}
      >
        Continue to Next page <MoveRight />
      </Button>
    </div>
  );
}


