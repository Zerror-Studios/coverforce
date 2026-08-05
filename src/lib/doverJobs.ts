// lib/doverJobs.ts

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

type DoverLocation = {
  location_type: string;
  location_option: {
    id: string;
    display_name: string;
    location_type: string;
    city: string;
    state: string;
    country: string;
  };
  name: string;
  is_primary: boolean;
};

type DoverJobGroupApiJob = {
  id: string;
  title: string;
  locations: DoverLocation[];
  workplace_type: "REMOTE" | "HYBRID" | "ONSITE" | string;
  is_published: boolean;
  is_sample: boolean;
};

type DoverJobGroupApiGroup = {
  id: string | null;
  name: string;
  jobs: DoverJobGroupApiJob[];
};

const DOVER_JOB_GROUPS_URL = `https://app.dover.com/api/v1/job-groups/d2d0e44f-528d-45f6-b05a-7011c415dec0/job-groups`;

const MORE_JOBS_LABEL = "More Jobs";

function formatLocation(job: DoverJobGroupApiJob): string {
  const locations = job.locations ?? [];

  const label = locations
    .slice()
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
    .map((loc) => loc.location_option?.display_name || loc.name)
    .filter(Boolean)
    .join(" / ");

  switch (job.workplace_type) {
    case "REMOTE":
      return label ? `Remote [${label}]` : "Remote";
    case "HYBRID":
      return label ? `Hybrid [${label}]` : "Hybrid";
    default:
      return label || "On-site";
  }
}

function mapJob(job: DoverJobGroupApiJob): JobListing {
  return {
    id: job.id,
    title: job.title,
    location: formatLocation(job),
    type: "Full Time",
    href: `https://app.dover.com/apply/coverforce/${job.id}`,
    target: "_blank",
    rel: "noopener noreferrer",
  };
}

export async function getDoverJobCategories(): Promise<JobCategory[]> {
  const response = await fetch(DOVER_JOB_GROUPS_URL, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Dover job groups fetch failed: ${response.status}`);
  }

  const groups = (await response.json()) as DoverJobGroupApiGroup[];
  const isVisible = (job: DoverJobGroupApiJob) =>
    job.is_published && !job.is_sample;

  const named = groups
    .filter((group) => group.id !== null)
    .map((group) => ({
      name: group.name,
      jobs: group.jobs.filter(isVisible).map(mapJob),
    }))
    .filter((group) => group.jobs.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const ungrouped = groups.find((group) => group.id === null);
  const ungroupedJobs = (ungrouped?.jobs ?? []).filter(isVisible).map(mapJob);

  const categories: JobCategory[] = [...named];

  if (ungroupedJobs.length > 0) {
    categories.push({ name: MORE_JOBS_LABEL, jobs: ungroupedJobs });
  }
  return categories.map((category) => ({
    ...category,
    jobs: category.jobs.sort((a, b) => a.title.localeCompare(b.title)),
  }));
}