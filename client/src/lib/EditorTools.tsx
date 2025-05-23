import Header from "@editorjs/header";
import List from "@editorjs/list";
import InlineCode from "@editorjs/inline-code";
import Embed from "@editorjs/embed";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import Image from "@editorjs/image";

export const EditorTools = {
  list: {
    class : List,
    inlineToolbar: true,
  },
  header: {
    class: Header,
    inlineToolbar: true,
  },
  inlineCode: InlineCode,
  embed: Embed,
  marker: Marker,
  quote: Quote,
  image: Image,
};
