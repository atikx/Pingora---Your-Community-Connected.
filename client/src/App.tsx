import { Route, Routes } from "react-router-dom";

// admin routes
import AdminProtected from "./pages/protected/AdminProtected";
import NewPost from "./pages/newPost/NewPost";
import YourPosts from "./pages/yourPosts/YourPosts";
import AddPostData from "./pages/addPostData/AddPostData";

import Home from "./pages/home/Home";
import Auth from "./pages/login/Auth";
import { Otp } from "./pages/otp/Otp";
import Post from "./pages/post/Post";
import Filter from "./pages/filter/Filter";
import Search from "./pages/search/Search";

// only after login user can access these routes
import UserProtected from "./pages/protected/UserProtected";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <div className="flex h-full flex-col px-4 items-center justify-center">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<div>Categories</div>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/otp" element={<Otp />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/filter/:category" element={<Filter />} />
        <Route path="/search/:query" element={<Search />} />

        {/* protected routes only for admin */}
        <Route element={<AdminProtected />}>
          <Route path="/newPost" element={<NewPost />} />
          <Route path="/yourPosts" element={<YourPosts />} />
          <Route path="/addPostData" element={<AddPostData />} />
        </Route>

        {/* protected routes only after login */}
        <Route element={<UserProtected />}>
          <Route path="/profile" element={<Profile defaultTab="profile" />} />
          <Route path="/settings" element={<Profile defaultTab="settings" />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
