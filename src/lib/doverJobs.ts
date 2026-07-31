export type DoverApiJob = {
  id: string;
  title: string;
  absolute_url: string;
  location?: { name?: string };
  remote?: "only" | "yes" | "no" | string;
  first_published?: string;
};

export type JobListing = {
  id: string;
  title: string;
  location: string;
  type: string;
  href: string;
  target?: "_blank";
  rel?: string;
};

export type JobCategory = {
  name: string;
  jobs: JobListing[];
};

const DOVER_JOBS_URL =
  "https://app.dover.com/feed/v1/boards/coverforce/jobs";

function formatLocation(job: DoverApiJob): string {
  const name = job.location?.name?.trim() ?? "";

  if (job.remote === "only") {
    return name ? `Remote [${name}]` : "Remote";
  }

  if (job.remote === "yes") {
    return name ? `Hybrid [${name}]` : "Hybrid";
  }

  return name || "On-site";
}

function mapDoverJob(job: DoverApiJob): JobListing {
  return {
    id: job.id,
    title: job.title,
    location: formatLocation(job),
    type: "Full Time",
    href: job.absolute_url,
    target: "_blank",
    rel: "noopener noreferrer",
  };
}

function isEngineeringRole(title: string) {
  return /engineer/i.test(title);
}

export function groupJobsIntoCategories(jobs: JobListing[]): JobCategory[] {
  const engineering = jobs.filter((job) => isEngineeringRole(job.title));
  const other = jobs.filter((job) => !isEngineeringRole(job.title));

  const categories: JobCategory[] = [];

  if (engineering.length) {
    categories.push({ name: "Engineering Roles", jobs: engineering });
  }

  if (other.length) {
    categories.push({
      name: categories.length ? "More Jobs" : "Open Positions",
      jobs: other,
    });
  }

  return categories;
}

export async function getDoverJobs(): Promise<JobListing[]> {
  const response = await fetch(DOVER_JOBS_URL, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Dover jobs fetch failed: ${response.status}`);
  }

  const data = (await response.json()) as { jobs?: DoverApiJob[] };
  const jobs = Array.isArray(data.jobs) ? data.jobs : [];

  return jobs
    .map(mapDoverJob)
    .sort((a, b) => a.title.localeCompare(b.title));
}
