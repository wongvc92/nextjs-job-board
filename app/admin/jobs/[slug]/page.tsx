import JobPage from "@/components/JobPage";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminSideBar from "./AdminSideBar";

interface PageProps {
  params: { slug: string };
}

const page = async ({ params: { slug } }: PageProps) => {
  const job = await prisma.job.findUnique({
    where: { slug },
  });
  if (!job) notFound();

  return (
    <main className="flex m-auto my-10 max-w-5xl flex-col items-center gap-5 px-3 md:flex-row md:items-start">
      <JobPage job={job} />
      <AdminSideBar job={job} />
    </main>
  );
};

export default page;
