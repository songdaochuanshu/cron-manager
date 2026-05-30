<template>
  <div class="detail fade-in">
    <div class="page-header">
      <NuxtLink to="/jobs" class="back-link">← 返回列表</NuxtLink>
    </div>

    <div v-if="loading" class="loading">载入中…</div>
    <div v-else-if="!job" class="empty">任务未找到</div>
    <template v-else>
      <!-- 任务信息 -->
      <div class="card mb-3">
        <div class="detail-header">
          <div>
            <h1 class="detail-title">{{ job.name || job.id }}</h1>
            <p class="detail-id text-muted">{{ job.id }}</p>
          </div>
          <div class="detail-actions">
            <span :class="job.enabled ? 'badge badge-success' : 'badge badge-danger'">
              {{ job.enabled ? '启用' : '停用' }}
            </span>
            <button class="btn" @click="handleToggle">
              {{ job.enabled ? '⏸ 停用' : '▶️ 启用' }}
            </button>
            <button class="btn btn-primary" @click="handleTrigger" :disabled="triggering">
              {{ triggering ? '触发中…' : '▶ 手动触发' }}
            </button>
          </div>
        </div>

        <hr class="divider" />

        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">调度类型</span>
            <span class="detail-value">{{ job.schedule?.kind || '—' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">调度表达式</span>
            <span class="detail-value mono">{{ formatSchedule(job.schedule) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">会话目标</span>
            <span class="detail-value">{{ job.sessionTarget || '—' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">载荷类型</span>
            <span class="detail-value">{{ job.payload?.kind || '—' }}</span>
          </div>
        </div>

        <div v-if="job.payload?.text || job.payload?.message" class="payload-box mt-2">
          <span class="detail-label">载荷内容</span>
          <pre class="payload-content">{{ job.payload.text || job.payload.message }}</pre>
        </div>
      </div>

      <!-- 执行记录 -->
      <div class="card">
        <h2 class="card-title">执行记录</h2>
        <div v-if="runsLoading" class="loading">载入中…</div>
        <div v-else-if="runs.length === 0" class="empty">暂无执行记录</div>
        <table v-else class="table">
          <thead>
            <tr>
              <th>时间</th>
              <th>状态</th>
              <th>耗时</th>
              <th>输出</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="run in runs" :key="run.id">
              <td>{{ formatTime(run.startedAt) }}</td>
              <td>
                <span :class="statusClass(run.status)">{{ statusText(run.status) }}</span>
              </td>
              <td class="text-muted">{{ formatDuration(run) }}</td>
              <td class="text-muted output-cell">{{ truncate(run.output || run.error || '—', 60) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const route = useRoute()
const { getJob, triggerJob, updateJob, getJobRuns } = useCronApi()

const jobId = route.params.id as string
const loading = ref(true)
const job = ref<any>(null)
const runs = ref<any[]>([])
const runsLoading = ref(true)
const triggering = ref(false)

function formatSchedule(schedule: any): string {
  if (!schedule) return '—'
  if (schedule.kind === 'cron') return schedule.expr || '—'
  if (schedule.kind === 'every') return `every ${schedule.everyMs}ms`
  if (schedule.kind === 'at') return dayjs(schedule.at).format('YYYY-MM-DD HH:mm:ss')
  return '—'
}

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

async function handleToggle() {
  await updateJob(jobId, { enabled: !job.value.enabled })
  job.value.enabled = !job.value.enabled
}

async function handleTrigger() {
  triggering.value = true
  try {
    await triggerJob(jobId)
    // 刷新执行记录
    runs.value = await getJobRuns(jobId)
  } finally {
    triggering.value = false
  }
}

onMounted(async () => {
  try {
    job.value = await getJob(jobId)
  } catch (e) {
    console.error('获取任务详情失败:', e)
  } finally {
    loading.value = false
  }

  try {
    runs.value = await getJobRuns(jobId)
  } catch (e) {
    console.error('获取执行记录失败:', e)
  } finally {
    runsLoading.value = false
  }
})
</script>

<style scoped>
.back-link {
  color: var(--ink-light);
  text-decoration: none;
  font-size: 0.9rem;
}
.back-link:hover {
  color: var(--vermilion);
}
.page-header {
  margin-bottom: 1.5rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}
.detail-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 0.15rem;
}
.detail-id {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
.detail-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.detail-label {
  font-size: 0.75rem;
  color: var(--ink-faint);
  letter-spacing: 0.1rem;
  text-transform: uppercase;
}
.detail-value {
  font-size: 0.95rem;
}
.mono {
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.payload-box {
  background: var(--paper-cream);
  padding: 1rem;
  border-radius: 2px;
  border: 1px solid var(--paper-aged);
}
.payload-content {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  margin-top: 0.5rem;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--ink-medium);
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.15rem;
  margin-bottom: 1rem;
}

.output-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loading, .empty {
  text-align: center;
  padding: 2rem;
  color: var(--ink-faint);
  font-style: italic;
}
</style>
