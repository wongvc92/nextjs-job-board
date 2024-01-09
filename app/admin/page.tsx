import JobListItem from "@/components/JobListItem";
import H1 from "@/components/ui/h1";
import prisma from "@/lib/prisma";
import Link from "next/link";
import React from "react";

const AdminPage = async () => {
  const unApprovedJobs = await prisma.job.findMany({
    where: { approved: false },
  });
  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <H1 className="text-cemter">Admin Dashboard</H1>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Unapproved jobs:</h2>
        {unApprovedJobs.map((job) => (
          <Link key={job.id} href={`/admin/jobs/${job.slug}`} className="block">
            <JobListItem job={job} />
          </Link>
        ))}
        {unApprovedJobs.length === 0 && (
          <p className="text-muted-foreground">No unapproved jobs.</p>
        )}
      </section>
    </main>
  );
};

export default AdminPage;
