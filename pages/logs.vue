<template>
  <div class="logs fade-in">
    <div class="page-header">
      <h1 class="page-title">执行日志</h1>
      <p class="page-subtitle">查看所有任务的执行记录</p>
    </div>

    <div class="card">
      <div v-if="loading" class="loading">载入中…</div>
      <div v-else-if="runs.length === 0" class="empty">暂无执行记录</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>任务</th>
            <th>时间</th>
            <th>状态</th>
            <th>耗时</th>
            <th>输出</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="run in runs" :key="run.id">
            <td>
              <NuxtLink :to="`/jobs/${run.jobId}`" class="job-link">{{ run.jobName || run.jobId }}</NuxtLink>
            </td>
            <td class="text-muted">{{ formatTime(run.startedAt) }}</td>
            <td>
              <span :class="statusClass(run.status)">{{ statusText(run.status) }}</span>
            </td>
            <td class="text-muted">{{ formatDuration(run) }}</td>
            <td class="text-muted output-cell">{{ truncate(run.output || run.error || '—', 80) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const { listJobs, getJobRuns } = useCronApi()

const loading = ref(true)
const runs = ref<any[]>([])

function formatTime(t: string) {
  return t ? dayjs(t).format('MM-DD HH:mm:ss') : '—'
}

function formatDuration(run: any) {
  if (!run.finishedAt || !run.startedAt) return '—'
  const ms = dayjs(run.finishedAt).diff(dayjs(run.startedAt))
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function statusClass(s: string) {
  return {
    'badge badge-success': s === 'success',
    'badge badge-danger': s === 'failed',
    'badge badge-warning': s === 'running',
    'badge badge-info': s === 'skipped'
  }
}

function statusText(s: string) {
  return { success: '成功', failed: '失败', running: '运行中', skipped: '跳过' }[s] || s
}

function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + '…' : str
}

onMounted(async () => {
  try {
    const jobs = await listJobs()
    const allRuns: any[] = []
    for (const job of jobs) {
      try {
        const jobRuns = await getJobRuns(job.id)
        for (const run of jobRuns) {
          allRuns.push({ ...run, jobName: job.name, jobId: job.id })
        }
      } catch {}
    }
    allRuns.sort((a, b) => dayjs(b.startedAt).valueOf() - dayjs(a.startedAt).valueOf())
    runs.value = allRuns
  } catch (e) {
    console.error('获取日志失败:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-header {
  margin-bottom: 2rem;
}
.page-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  letter-spacing: 0.2rem;
}
.page-subtitle {
  color: var(--ink-faint);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.job-link {
  color: var(--ink-deep);
  text-decoration: none;
  font-weight: 600;
}
.job-link:hover {
  color: var(--vermilion);
}

.output-cell {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loading, .empty {
  text-align: center;
  padding: 3rem;
  color: var(--ink-faint);
  font-style: italic;
}
</style>
