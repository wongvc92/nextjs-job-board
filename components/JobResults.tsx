import React from "react";
import JobListItem from "./JobListItem";
import prisma from "@/lib/prisma";
import { JobFilterValues } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

type JobResultsProps = {
  filterValues: JobFilterValues;
  page?: number;
};

const JobResults = async ({
  filterValues,
  page = 1, //set default value=1
}: JobResultsProps) => {
  const { q, type, location, remote } = filterValues;
  const jobsPerPage = 6;
  const skip = (page - 1) * jobsPerPage; //pass to prisma

  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.JobWhereInput = searchString
    ? {
        OR: [
          { title: { search: searchString } },
          { companyName: { search: searchString } },
          { type: { search: searchString } },
          { locationType: { search: searchString } },
          { location: { search: searchString } },
        ],
      }
    : {};

  const where: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      type ? { type } : {},
      location ? { location } : {},
      remote ? { locationType: "Remote" } : {},
      { approved: true },
    ],
  };
  const jobsPromise = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: jobsPerPage, //how many results we want to return
    skip, //how many results we want to skip before we get to the page
  });

  const countPromise = prisma.job.count({ where });

  //execute server action at the same time to prevent waterfall
  const [jobs, totalResults] = await Promise.all([jobsPromise, countPromise]);

  return (
    <div className="space-y-4 grow">
      {/* pass data from server comp as props */}
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.slug}`} className="block">
          <JobListItem job={job} />
        </Link>
      ))}
      {jobs.length === 0 && (
        <p className="m-auto text-center">
          No jobs found. Try adjusting your search filter.
        </p>
      )}
      {jobs.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalResults / jobsPerPage)}
          filterValues={filterValues}
        />
      )}
    </div>
  );
};

export default JobResults;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  filterValues: JobFilterValues;
}

const Pagination = ({
  currentPage,
  totalPages,
  filterValues: { q, type, location, remote },
}: PaginationProps) => {
  function generatePageLink(page: number) {
    const searchParams = new URLSearchParams({
      ...(q && { q }),
      ...(type && { type }),
      ...(location && { location }),
      ...(remote && { remote: "true" }),
      page: page.toString(),
    });
    return `/?${searchParams.toString()}`;
  }
  return (
    <div className="flex justify-between">
      <Link
        href={generatePageLink(currentPage - 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage <= 1 && "invisible"
        )}
      >
        <ArrowLeft size={16} />
        Previous page
      </Link>
      <span className="font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={generatePageLink(currentPage + 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage >= totalPages && "invisible"
        )}
      >
        Next page
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};
