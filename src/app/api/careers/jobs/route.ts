import { NextResponse } from "next/server";
import { getDoverJobs, groupJobsIntoCategories } from "@/lib/doverJobs";

export const revalidate = 3600;

export async function GET() {
  try {
    const jobs = await getDoverJobs();
    return NextResponse.json({
      jobs,
      categories: groupJobsIntoCategories(jobs),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { jobs: [], categories: [], error: "Failed to load jobs" },
      { status: 502 },
    );
  }
}
