import { Separator } from "@/components/ui/separator";

import Hero from "./Hero";
import Main from "./Main";

function Home() {
  return (
    <div className="py-10 ">
      {/* Hero Section */}

      <Hero />

      <Separator className="my-6" />

      {/* Posts Section  */}
      <Main />
    </div>
  );
}

export default Home;
