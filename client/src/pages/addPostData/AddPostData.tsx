import { useEffect, useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import VerticalPost from "@/components/custom/VerticalPost";
import { useAuthStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import api from "@/lib/axiosinstance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Update interface to match VerticalPost component props
interface PostProps {
  title: string;
  description: string;
  image: string;
  created_at: string;
  author_name: string;
  author_avatar: string;
}

export default function AddPostData(): JSX.Element {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  
  // Add state for controlling the confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  // Define the mutation function
  const uploadPost = async (formData: FormData) => {
    const response = await api.post("/admin/addPost", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  // Use the useMutation hook
  const mutation = useMutation({
    mutationFn: uploadPost,
    onSuccess: (data) => {
      console.log("Server response:", data);
      localStorage.removeItem("postData");
      toast.success("Post uploaded successfully!");
      navigate("/yourPosts");
      // Invalidate and refetch queries that might be affected
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error uploading post:", error);
      toast.error("Failed to upload post. Please try again.");
    },
  });

  useEffect(() => {
    const postData = localStorage.getItem("postData");
    if (!postData) {
      toast.error("Please create a post first");
      setShouldRedirect(true);
    }
  }, []);

  // Handle drag-and-drop image upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setBannerFile(file); // Store the actual file
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setBannerPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // Handle adding tags
  const handleAddTag = (): void => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Handle tag input keydown (add tag on Enter)
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle removing a tag
  const removeTag = (tagToRemove: string): void => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Modified to open confirmation dialog instead of uploading directly
  const handleConfirmUpload = (): void => {
    if (!bannerFile) {
      toast.error("Please upload a banner image");
      return;
    }
    
    if (!title) {
      toast.error("Please enter a post title");
      return;
    }
    
    if (!description) {
      toast.error("Please enter a post description");
      return;
    }
    
    // Show confirmation dialog
    setShowConfirmDialog(true);
  };
  
  // Actual upload function that will be called after confirmation
  const handleUploadPost = (): void => {
    // Get content from localStorage
    const content = localStorage.getItem("postData") || "";

    // Create FormData object
    const formData = new FormData();

    // Append the image file if available
    if (bannerFile) {
      formData.append("image", bannerFile);
    }

    // Append other form data
    formData.append("title", title || "Untitled Post");
    formData.append("description", description || "");
    formData.append("content", content);
    formData.append("category", category || "Uncategorized");

    // Append tags as JSON string
    formData.append("tags", JSON.stringify(tags.length > 0 ? tags : []));

    // Log the FormData entries for debugging
    console.log("Form data entries:");
    for (let [key, value] of formData.entries()) {
      console.log(
        `${key}: ${value instanceof File ? `File: ${value.name}` : value}`
      );
    }

    // Execute the mutation
    mutation.mutate(formData);
  };

  if (shouldRedirect) {
    return <Navigate to="/newPost" replace />;
  }

  // Updated preview post to match the VerticalPost component props
  const previewPost: PostProps = {
    image: bannerPreview || "https://cdn-front.freepik.com/images/ai/image-generator/gallery/323233.webp",
    title: title || "Post title will appear here",
    description: description || "Post description will appear here",
    created_at: new Date().toISOString(),
    author_name: user?.name || "Unknown",
    author_avatar: user?.avatar || "https://i.pravatar.cc/100",
  };

  // Sample categories
  const categories: string[] = [
    "Technology",
    "Business",
    "Sports",
    "Entertainment",
    "Science",
    "Health",
    "Current Affairs",
  ];

  return (
    <div className="flex flex-col gap-8 p-8 w-full bg-white rounded-lg">
      <div className="flex gap-8">
        {/* Input Section */}
        <div className="w-1/2 space-y-6">
          <div>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner Preview"
                  className="mx-auto rounded-md h-32 object-cover mb-2"
                />
              ) : (
                <div>
                  <span className="text-gray-500">
                    Drag & drop an image here, or{" "}
                    <span className="text-blue-600 underline">
                      click to select
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              placeholder="Enter your post title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a short description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
            />
          </div>

          {/* Category Selection */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags Input */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTagInput(e.target.value)
                }
                onKeyDown={handleTagKeyDown}
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                Add
              </Button>
            </div>

            {/* Tags Display */}
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex cursor-pointer items-center gap-1"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="flex items-stretch">
          <div className="w-px bg-gray-200 h-full mx-4" />
        </div>

        {/* Preview Section - Updated to use the new VerticalPost component */}
        <div className="w-1/2 flex items-start justify-center">
          <div className="w-full max-w-md">
            <VerticalPost post={previewPost} />

            {/* Display category and tags separately since they're not part of the VerticalPost component */}
            <div className="mt-4 space-y-2">
              <div>
                <span className="font-medium">Category: </span>
                <Badge variant="outline">{category || "Uncategorized"}</Badge>
              </div>
              <div>
                <span className="font-medium">Tags: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">No tags</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Button with Spinner */}
      <div className="flex justify-end mt-6">
        <Button
          onClick={handleConfirmUpload}
          disabled={mutation.isLoading}
          className="px-8 flex items-center gap-2"
        >
          {mutation.isLoading ? (
            <>
              <ClipLoader size={16} color="#ffffff" />
              <span>Uploading...</span>
            </>
          ) : (
            "Upload Post"
          )}
        </Button>
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Post Upload</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish this post? This action will make your content visible to all users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUploadPost}>
              {mutation.isLoading ? (
                <div className="flex items-center gap-2">
                  <ClipLoader size={16} color="#ffffff" />
                  <span>Publishing...</span>
                </div>
              ) : (
                "Publish Post"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
