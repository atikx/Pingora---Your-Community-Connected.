import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/custom/sidebar/AppSidebar.tsx";
import { Navbar } from "./components/custom/Navbar.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "./lib/store.ts";
import { type UserInterface } from "./lib/ability.ts";

const init = async () => {
  const user: UserInterface = {
    id: "1",
    name: "Atiksh gupta",
    email: "atiksh@example.com",
    isAdmin: true,
    avatar:
      "https://thumbs.dreamstime.com/b/generative-ai-young-smiling-man-avatar-man-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-d-vector-people-279560903.jpg",
  };

  useAuthStore.getState().setUser(user);

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Toaster position="bottom-right" closeButton={true} />
        <SidebarProvider defaultOpen={false}>
          {" "}
          <AppSidebar collapsible="icon" />
          <div className="flex  flex-col w-full">
            <Navbar />
            <App />
          </div>
        </SidebarProvider>
    </BrowserRouter>
  );
};

init();
