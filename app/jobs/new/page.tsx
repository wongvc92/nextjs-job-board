import { Metadata } from "next";
import NewJobForm from "./NewJobForm";

export const metadata: Metadata = {
  title: "Post a new job",
};

const page = () => {
  return <NewJobForm />;
};

export default page;
