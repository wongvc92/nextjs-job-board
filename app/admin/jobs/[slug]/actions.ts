"use server";

import { isAdmin } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { redirect } from "next/navigation";

type FormState = { error?: string } | undefined;

export const approveSubmission = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  try {
    //test error
    // throw Error("bazinga!");
    const jobId = parseInt(formData.get("jobId") as string);

    const user = await currentUser();

    if (!user || !isAdmin(user)) {
      throw new Error("Not authorized");
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { approved: true },
    });

    revalidatePath("/"); //clear client site cache
  } catch (error) {
    let message = "unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
};

export const deleteJob = async (prevState: FormState, formData: FormData) => {
  try {
    const jobId = parseInt(formData.get("jobId") as string);

    const user = await currentUser();

    if (!user || !isAdmin(user)) {
      throw new Error("Not authorized");
    }
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (job?.companyLogoUrl) {
      await del(job.companyLogoUrl);
    }
    await prisma.job.delete({
      where: { id: jobId },
    });

    revalidatePath("/");
  } catch (error) {
    let message = "unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
  redirect("/admin");
};
