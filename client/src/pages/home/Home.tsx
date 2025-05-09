import { HeroCarousel } from "./sections/HeroCarousel";
import { HeroCard } from "./sections/HeroCard";
import VerticalPost from "@/components/custom/VerticalPost";
import { Separator } from "@/components/ui/separator";

import img4 from "@/assets/images/img4.jpg";
import img5 from "@/assets/images/img5.jpg";

function Home() {
  const posts = [
    {
      image: "https://img.freepik.com/free-photo/still-life-books-versus-technology_23-2150062920.jpg?uid=R73843146&ga=GA1.1.1698213981.1729228789&semt=ais_hybrid&w=740",
      title: "Opening Day Of Boating Season, Seattle WA",
      description:
        "Of course the Puget Sound is very watery, and where there is water, there are boats. Today is...",
      author: {
        name: "James",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      date: "August 18, 2024",
    },
    {
      image: "https://cdn-front.freepik.com/images/ai/image-generator/gallery/323233.webp",
      title: "How To Choose The Right Laptop For Programming",
      description:
        "Choosing the right laptop for programming can be a tough process. It’s easy to get confused...",
      author: {
        name: "Louis Hoebregts",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      },
      date: "July 25, 2024",
    },
    {
      image: "https://img.freepik.com/free-photo/girl-reading-book_23-2148571400.jpg",
      title: "Why Reading Books Is Still A Great Habit",
      description:
        "Despite the digital age, the joy of reading books remains timeless. Here's why you should...",
      author: {
        name: "Sophia",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      date: "May 3, 2024",
    },
    {
      image: "https://img.freepik.com/free-photo/working-home-concept_23-2148607864.jpg",
      title: "Remote Work: A New Norm?",
      description:
        "The pandemic changed the way we work forever. Remote work is not a trend—it's the new normal...",
      author: {
        name: "Alex Turner",
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      },
      date: "April 9, 2024",
    },
  ];

  return (
    <div className="pt-10 h-[80rem]">
      <div className="flex flex-col-reverse sm:flex-row justify-center gap-8">
        <HeroCard
          title="How to Become a Sigma Boy"
          description="Ah, the joy of the open road—it's a good feeling. But if you're new to driving, you may..."
          imageUrl={img4}
        />
        <HeroCard
          title="How to Become a Sigma Boy"
          description="Ah, the joy of the open road—it's a good feeling. But if you're new to driving, you may..."
          imageUrl={img5}
        />
        <HeroCarousel />
      </div>
      <Separator className="my-4" />
      <div>
        <h1 className="text-3xl font-bold mb-4">
          <b className="text-primary">|</b> Latest Posts
        </h1>
        <div className="flex justify-center flex-wrap gap-8">
          {posts.map((post, index) => (
            <VerticalPost key={index} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
