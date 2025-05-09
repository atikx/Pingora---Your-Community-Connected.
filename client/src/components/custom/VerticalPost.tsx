const VerticalPost = ({ post }: any) => {
  return (
    <div
      className={`backdrop-blur-md p-2 cursor-pointer hover:scale-105 transition duration-500 bg-white/10 border border-white/20 rounded-2xl shadow-xl w-80 overflow-hidden`}
    >
      <div className="rounded-sm overflow-hidden">
        <img
          src={post.image}
          alt="Post cover"
          className="w-full rounded-sm h-48 object-cover"
        />
        <div className="pt-4">
          <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
          <p className="text-sm  mb-4">{post.description}</p>
          <div className="flex items-center justify-between py-2 px-3 rounded-sm bg-[#f5f5f5] backdrop-blur-lg ">
            <div className="flex items-center gap-2 ">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-sm"
              />
              <div>
                <p className="text-sm font-medium">{post.author.name}</p>
                <p className="text-xs ">{post.date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalPost;
