import { memo } from "react";

const Home = memo(() => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
});

Home.displayName = "Home";
const Page = () => {
  return <Home />;
};
export default Page;
