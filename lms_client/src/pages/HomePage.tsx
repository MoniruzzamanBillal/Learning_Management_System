import { useGetUser } from "@/utils/sharedFunction";

const HomePage = () => {
  const user = useGetUser();

  console.log(user);

  return (
    <div className="HomePageContainer">
      <h1> HomePage</h1>
      <h1> HomePage</h1>
      <h1> HomePage</h1>
      <h1> HomePage</h1>
      <h1> HomePage</h1>
    </div>
  );
};

export default HomePage;
