import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; // Import Badge from shadcn

interface AuthorProps {
  name: string;
  avatar: string;
  email: string;
  date: string;
  tags?: string[]; // Add tags prop
}

export default function Author({
  name,
  email,
  avatar,
  date,
  tags = [],
}: AuthorProps) {

  return (
    <div className="mr-6 mt-6 sticky top-6 space-y-6">
      <Card className="backdrop-blur-md w-72 bg-white/10 border border-white/20 rounded-2xl shadow-xl overflow-hidden transition duration-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center">Author</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-20 h-20 rounded-xl border-2 border-white/30">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="w-full py-2 px-3 rounded-xl bg-[#f5f5f5] backdrop-blur-lg">
            <div className="flex items-center justify-center gap-1">
              <span className="text-xs font-medium">Published on : </span>
              <span className="text-xs font-medium">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Tags section */}

          {tags && tags.length > 0 && (
            <div className="mt-4 w-full">
              <h4 className="text-sm font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
