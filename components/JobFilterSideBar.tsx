import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Select from "./ui/select";
import prisma from "@/lib/prisma";
import { jobTypes } from "@/lib/job-types";
import { Button } from "./ui/button";
import { JobFilterValues, jobFilterSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";

type Props = {};

async function filterJobs(formData: FormData) {
  "use server";
  //text fake error from error.tsx. click filter jobs button.
  //   throw new Error("bazinga!");

  //   test to type inside q input and see the logged in terminal
  //   console.log(formData.get("q"));

  //   turns form values into javascript object then pass to zod
  const values = Object.fromEntries(formData.entries());

  //compare values with the jobFilterSchema.
  //if correct with show proper types. if not match will throw error
  const validatedFields = jobFilterSchema.parse(values);

  const { q, type, location, remote } = validatedFields;

  //combine all destructured data and convert to URL
  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });
  redirect(`/?${searchParams.toString()}`);
}

type JobFilterSidebarProps = {
  defaultValues: JobFilterValues;
};

const JobFilterSideBar = async ({ defaultValues }: JobFilterSidebarProps) => {
  const distinctLocations = (await prisma.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean)
    )) as string[];

  return (
    <aside className="mid:w-[250px] p-4 sticky top-0 h-fit bg-background border rounded-lg">
      {/* add key={JSON.stringify(defaultValues)} to reset all value */}
      <form action={filterJobs} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, company, etc."
              defaultValue={defaultValues.q}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              name="type"
              defaultValue={defaultValues.type || ""}
            >
              <option value="">All type</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select
              id="location"
              name="location"
              defaultValue={defaultValues.location || ""}
            >
              <option value="">All location</option>
              {distinctLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-black"
              defaultChecked={defaultValues.remote}
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>
          <FormSubmitButton className="w-full">Filter jobs</FormSubmitButton>
        </div>
      </form>
    </aside>
  );
};

export default JobFilterSideBar;
