import { FC } from "react";

const PageNotFound: FC = (): JSX.Element => (
  <div className="bg-[url('/images/pagenotfound.avif')] text-center h-screen w-screen object-contain">
    <h2>404</h2>
    <h1> Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <button className="">GO HOME</button>
  </div>
);

export default PageNotFound;
