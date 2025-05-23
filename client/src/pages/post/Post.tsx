import { useParams } from "react-router-dom";
import { SamplePostData } from "@/lib/samplePostData";
import { Separator } from "@/components/ui/separator";

import Author from "./Author";
import Comments from "./Comments";
import api from "@/lib/axiosinstance";
import { useQuery } from "@tanstack/react-query";

export default function Post() {
  const { id } = useParams<{ id: string }>();

  const {
    data: postData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await api.get(`/general/getPost/${id}`);
      return res.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!id,
  });

  // Get blocks from the content field or use sample data if not available
  const postBlocks = postData?.content?.blocks ?? SamplePostData;

  const renderBlock = (block: any) => {
    switch (block.type) {
      case "header": {
        const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
        return <Tag key={block.id}>{block.data.text}</Tag>;
      }

      case "paragraph":
        return (
          <p
            className="text-black text-start text-lg leading-relaxed mb-4"
            key={block.id}
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
        );

      case "embed":
        return (
          <div key={block.id} className="my-4 w-full px-10 flex flex-col mb-6">
            <iframe
              width={block.data.width}
              height={block.data.height}
              className="h-[550px] rounded-lg w-full"
              src={block.data.embed}
              title={block.data.caption || "Embedded content"}
              frameBorder="0"
              allowFullScreen
            />
            {block.data.caption && (
              <p className="text-center border">{block.data.caption}</p>
            )}
          </div>
        );

      case "list":
        return block.data.style === "unordered" ? (
          <ul key={block.id} className="list-disc pl-6">
            {block.data.items.map((item: any, index: number) => (
              <li key={index}>{item.content}</li>
            ))}
          </ul>
        ) : (
          <ol key={block.id} className="list-decimal pl-6">
            {block.data.items.map((item: any, index: number) => (
              <li key={index}>{item.content}</li>
            ))}
          </ol>
        );

      default:
        return null;
    }
  };

  if (isLoading) return <div className="p-4">Loading post...</div>;
  if (isError || !postBlocks) return <div className="p-4">Post not found.</div>;

  return (
    <div className="flex w-full">
      {/* Render the post content */}
      <div
        id="editorjs"
        className="p-4 box-border w-full space-y-4 editorjs flex-grow"
      >
        {postBlocks.map((block: any) => renderBlock(block))}
        <Comments post_id={postData.id} />
      </div>

      {/* Vertical Separator */}
      <div className="mx-4 hidden md:flex items-center">
        <Separator
          orientation="vertical"
          className="h-[calc(100vh-4rem)] bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-50"
        />
      </div>

      {/* Render the author area with tags */}
      <div className="md:w-1/4">
        {postData && (
          <Author
            name={postData.author_name}
            avatar={postData.author_avatar}
            email={postData.author_email}
            date={postData.created_at}
            tags={postData.tags}
          />
        )}
      </div>
    </div>
  );
}
