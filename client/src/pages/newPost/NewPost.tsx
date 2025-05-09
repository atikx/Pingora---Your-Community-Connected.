import { useState } from 'react';
import BlogEditor from '@/components/custom/BlogEditor';

const INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "header",
      data: {
        text: "This is a tutorial of Editor js",
        level: 1
      }
    }
  ]
}

function App() {
  const [data, setData] = useState(INITIAL_DATA)
  return (
    <div className="editor">
      <BlogEditor data={data} onChange={setData} editorBlock="editorjs-container" />
      <button onClick={() => console.log(data)}>Save Data</button>
    </div>
  );
}

export default App;


