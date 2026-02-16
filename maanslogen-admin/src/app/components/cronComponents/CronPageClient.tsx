"use client";

import { useState, useEffect } from "react";
import { PageHeading, Card, SectionHeading, StatusDot } from "@/app/components/ui";
import { LoadingState } from "@/app/components/data";
import { getApiBaseUrl } from "@/lib/api-client";

type CronJob = {
  id: string;
  name: string;
  schedule: string;
  scheduleHuman: string;
  description: string;
  enabled: boolean;
};

type CronJobsResponse = {
  jobs: CronJob[];
};

export function CronPageClient() {
  const [jobs, setJobs] = useState<CronJob[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/admin/upload/cron-jobs`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: CronJobsResponse = await res.json();
        if (!cancelled) setJobs(data.jobs);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Kunne ikke hente cron-jobs");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div>
        <PageHeading>Planlagte jobs</PageHeading>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (jobs === null) {
    return (
      <div>
        <PageHeading>Planlagte jobs</PageHeading>
        <LoadingState text="Henter cron-jobs…" />
      </div>
    );
  }

  return (
    <div>
      <PageHeading>Planlagte jobs</PageHeading>
      <p className="text-foreground-muted mb-6">
        Oversigt over cron-jobs der kører på API’et. Tider er server-tid.
      </p>

      <SectionHeading className="mb-3">Upload &amp; cleanup</SectionHeading>
      <Card className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex flex-wrap items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0 last:mb-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <StatusDot active={job.enabled} />
              <span className="font-medium text-foreground">{job.name}</span>
            </div>
            <div className="w-full sm:w-auto text-sm text-foreground-muted">
              <span className="font-mono">{job.scheduleHuman}</span>
              <span className="mx-1">·</span>
              <span className="font-mono text-xs">{job.schedule}</span>
            </div>
            <p className="w-full text-sm text-foreground-muted">{job.description}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
