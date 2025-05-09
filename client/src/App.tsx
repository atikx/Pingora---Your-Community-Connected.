import { Button } from "@/components/ui/button";
import { Route, Routes } from "react-router-dom";
import Protected from "./pages/protected/Protected";

// admin routes
import NewPost from "./pages/newPost/NewPost";
import YourPosts from "./pages/yourPosts/YourPosts";

import Home from "./pages/home/Home";

function App() {
  return (
    <div className="flex flex-col px-4 items-center justify-center">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<div>Categories</div>} />
        <Route path="/about" element={<div>About</div>} />
        <Route path="/contact" element={<div>Contact</div>} />

        {/* protected routes only for admin */}
        <Route element={<Protected />}>
          <Route path="/newPost" element={<NewPost />} />
          <Route path="/yourPosts" element={<YourPosts />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
