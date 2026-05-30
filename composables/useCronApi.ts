// Cron API composable — 与 OpenClaw Gateway 交互

export interface CronJob {
  id: string
  name: string
  schedule: {
    kind: 'at' | 'every' | 'cron'
    at?: string
    everyMs?: number
    expr?: string
    tz?: string
  }
  payload: {
    kind: 'systemEvent' | 'agentTurn'
    text?: string
    message?: string
  }
  sessionTarget: string
  enabled: boolean
  description?: string
  lastRun?: string
  nextRun?: string
  createdAt?: string
}

export interface CronRun {
  id: string
  jobId: string
  startedAt: string
  finishedAt?: string
  status: 'running' | 'success' | 'failed' | 'skipped'
  output?: string
  error?: string
}

export function useCronApi() {
  const baseURL = '/api/cron'

  async function listJobs(): Promise<CronJob[]> {
    const data = await $fetch<{ jobs: CronJob[] }>(`${baseURL}/jobs`)
    return data.jobs || []
  }

  async function getJob(jobId: string): Promise<CronJob> {
    return await $fetch<CronJob>(`${baseURL}/jobs/${jobId}`)
  }

  async function createJob(job: Partial<CronJob>): Promise<CronJob> {
    return await $fetch<CronJob>(`${baseURL}/jobs`, {
      method: 'POST',
      body: job
    })
  }

  async function updateJob(jobId: string, patch: Partial<CronJob>): Promise<CronJob> {
    return await $fetch<CronJob>(`${baseURL}/jobs/${jobId}`, {
      method: 'PATCH',
      body: patch
    })
  }

  async function deleteJob(jobId: string): Promise<void> {
    await $fetch(`${baseURL}/jobs/${jobId}`, { method: 'DELETE' })
  }

  async function triggerJob(jobId: string): Promise<void> {
    await $fetch(`${baseURL}/jobs/${jobId}/trigger`, { method: 'POST' })
  }

  async function getJobRuns(jobId: string): Promise<CronRun[]> {
    const data = await $fetch<{ runs: CronRun[] }>(`${baseURL}/jobs/${jobId}/runs`)
    return data.runs || []
  }

  async function getStatus(): Promise<{ enabled: boolean; jobCount: number }> {
    return await $fetch(`${baseURL}/status`)
  }

  return {
    listJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    triggerJob,
    getJobRuns,
    getStatus
  }
}
