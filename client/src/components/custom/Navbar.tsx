"use client";

import React, { useRef, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Menu } from "lucide-react";
import LoadingBar from "react-top-loading-bar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarTrigger } from "../ui/sidebar";

// Define types for LoadingBar ref
interface LoadingBarRef {
  continuousStart: (startingValue?: number, refreshRate?: number) => void;
  staticStart: (startingValue?: number) => void;
  complete: () => void;
  increase: (value: number) => void;
}

import { useAuthStore } from "@/lib/store";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const loadingBarRef = useRef<LoadingBarRef | null>(null);
  const [search, setSearch] = useState("");
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // Array for categories
  const categories = [
    { name: "Technology" },
    { name: "Business" },
    { name: "Sports" },
    { name: "Entertainment" },
    { name: "Science" },
    { name: "Health" },
    { name: "Current Affairs" },
  ];

  // Trigger loading bar on route changes
  useEffect(() => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();

      // Complete the loading after a short delay
      const timer = setTimeout(() => {
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleSearch = () => {
    if (search !== "") {
      navigate(`/search/${search}`);
    } else {
      toast.info("Please enter a search term");
    }
  };

  return (
    <>
      <LoadingBar
        // color="black"
        className="text-primary"
        ref={loadingBarRef}
        height={3}
        shadow={true}
      />
      <nav className="sticky top-0 z-50 w-full">
        <div className="w-full">
          <div className="flex h-16 px-4 pr-8 items-center justify-between bg-white/80 backdrop-blur-xs backdrop-filter border-b border-gray-200/20">
            <div className="flex gap-12">
              {user && <SidebarTrigger className="cursor-pointer" />}

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">PINGORA</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-white/10">
                      Categories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white/80 backdrop-blur-md backdrop-filter rounded-lg border border-gray-200/20">
                      <div className="grid gap-3 p-4 w-[200px]">
                        {categories.map((category, index) => (
                          <NavLink
                            key={index}
                            to={`/filter/${category.name}`}
                            className={({ isActive }) =>
                              isActive
                                ? "px-4 py-2 bg-white/30 rounded-md text-primary font-medium"
                                : "px-4 py-2 hover:bg-white/30 rounded-md"
                            }
                          >
                            {category.name}
                          </NavLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-white/10 px-4 py-2 rounded-md text-primary font-medium"
                          : "bg-transparent hover:bg-white/10 px-4 py-2 rounded-md"
                      }
                    >
                      Home
                    </NavLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavLink
                      to="https://github.com/atikx"
                      target="_blank"
                      className="bg-transparent hover:bg-white/10 px-4 py-2 rounded-md"
                    >
                      About Me
                    </NavLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Search and User Section */}
            <div className="flex items-center gap-4">
              {/* Search Box */}
              <div className="relative flex gap-4 md:flex items-center">
                <Input
                  type="search"
                  placeholder="Search Anything"
                  className="w-[250px] rounded-full bg-white/50 backdrop-blur-sm border-gray-200/20 pl-10 pr-4 "
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
                <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                <Button onClick={handleSearch} className="cursor-pointer">
                  Search
                </Button>
              </div>

              {/* User Profile */}

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-gray-200/20">
                      <AvatarImage
                        src={
                          user?.avatar ||
                          "https://thumbs.dreamstime.com/b/generative-ai-young-smiling-man-avatar-man-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-d-vector-people-279560903.jpg"
                        }
                        alt="User"
                      />
                      <AvatarFallback>BZ</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-flex font-medium">
                      {user?.name.split(" ")[0] || "Guest"}
                    </span>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Handle login logic here
                    navigate("/auth");
                  }}
                >
                  Log in
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-white/80 backdrop-blur-lg backdrop-filter p-6 w-[280px] sm:w-[300px] rounded-l-xl shadow-xl"
                >
                  <div className="space-y-6">
                    <div className="text-xl font-semibold text-primary border-b pb-2">
                      Menu
                    </div>

                    <div>
                      <div className="text-md font-medium text-gray-900 mb-2">
                        Categories
                      </div>
                      <div className="space-y-2 pl-2">
                        {categories.map((category, index) => (
                          <NavLink
                            key={index}
                            to={category.href}
                            className={({ isActive }) =>
                              isActive
                                ? "block text-primary font-semibold"
                                : "block text-gray-800 hover:text-primary"
                            }
                            onClick={() => setIsOpen(false)}
                          >
                            {category.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <NavLink
                        to="/pages"
                        className={({ isActive }) =>
                          isActive
                            ? "block text-primary font-semibold"
                            : "block text-gray-900 hover:text-primary"
                        }
                        onClick={() => setIsOpen(false)}
                      >
                        Pages
                      </NavLink>
                      <NavLink
                        to="https://github.com/atikx"
                        className="block text-gray-900 hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        About Me
                      </NavLink>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
