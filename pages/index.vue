<template>
  <div class="dashboard fade-in">
    <!-- 页标题 · 题跋 -->
    <div class="page-header">
      <h1 class="page-title">总览</h1>
      <p class="page-subtitle">一览众山小，任务尽在掌握</p>
    </div>

    <!-- 统计卡片 · 四君子 -->
    <div class="grid grid-4 mb-3">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-body">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">任务总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon text-celadon">✅</div>
        <div class="stat-body">
          <div class="stat-value text-celadon">{{ stats.active }}</div>
          <div class="stat-label">运行中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon text-vermilion">⏸️</div>
        <div class="stat-body">
          <div class="stat-value text-vermilion">{{ stats.disabled }}</div>
          <div class="stat-label">已停用</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏰</div>
        <div class="stat-body">
          <div class="stat-value">{{ stats.recentRuns }}</div>
          <div class="stat-label">今日执行</div>
        </div>
      </div>
    </div>

    <!-- 最近任务 · 行书 -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">最近任务</h2>
        <NuxtLink to="/jobs" class="btn btn-ghost">查看全部 →</NuxtLink>
      </div>
      <div v-if="loading" class="loading">载入中…</div>
      <div v-else-if="recentJobs.length === 0" class="empty">暂无任务</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>名称</th>
            <th>调度</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in recentJobs" :key="job.id">
            <td>
              <NuxtLink :to="`/jobs/${job.id}`" class="job-name">{{ job.name || job.id }}</NuxtLink>
            </td>
            <td class="text-muted">{{ formatSchedule(job.schedule) }}</td>
            <td>
              <span :class="job.enabled ? 'badge badge-success' : 'badge badge-danger'">
                {{ job.enabled ? '启用' : '停用' }}
              </span>
            </td>
            <td>
              <button class="btn btn-ghost" @click="handleTrigger(job.id)" :disabled="triggering === job.id">
                {{ triggering === job.id ? '触发中…' : '▶ 触发' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const { listJobs, triggerJob, getStatus } = useCronApi()

const loading = ref(true)
const jobs = ref<any[]>([])
const triggering = ref<string | null>(null)

const stats = computed(() => ({
  total: jobs.value.length,
  active: jobs.value.filter(j => j.enabled).length,
  disabled: jobs.value.filter(j => !j.enabled).length,
  recentRuns: 0 // TODO: 从 API 获取
}))

const recentJobs = computed(() => jobs.value.slice(0, 8))

function formatSchedule(schedule: any): string {
  if (!schedule) return '—'
  if (schedule.kind === 'cron') return schedule.expr || '—'
  if (schedule.kind === 'every') {
    const ms = schedule.everyMs
    if (!ms) return '—'
    if (ms >= 3600000) return `每 ${ms / 3600000} 小时`
    if (ms >= 60000) return `每 ${ms / 60000} 分钟`
    return `每 ${ms / 1000} 秒`
  }
  if (schedule.kind === 'at') return dayjs(schedule.at).format('MM-DD HH:mm')
  return '—'
}

async function handleTrigger(jobId: string) {
  triggering.value = jobId
  try {
    await triggerJob(jobId)
  } finally {
    triggering.value = null
  }
}

onMounted(async () => {
  try {
    jobs.value = await listJobs()
  } catch (e) {
    console.error('获取任务列表失败:', e)
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
  color: var(--ink-deep);
  letter-spacing: 0.2rem;
}
.page-subtitle {
  color: var(--ink-faint);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.stat-card {
  background: var(--paper-white);
  border: 1px solid var(--paper-aged);
  border-radius: 4px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: box-shadow 0.2s;
}
.stat-card:hover {
  box-shadow: 0 2px 12px rgba(26, 26, 46, 0.06);
}
.stat-icon {
  font-size: 1.8rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--paper-cream);
  border-radius: 4px;
}
.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  font-family: var(--font-display);
  line-height: 1;
}
.stat-label {
  font-size: 0.8rem;
  color: var(--ink-faint);
  margin-top: 0.2rem;
  letter-spacing: 0.05rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.card-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.15rem;
}

.job-name {
  color: var(--ink-deep);
  text-decoration: none;
  font-weight: 600;
}
.job-name:hover {
  color: var(--vermilion);
}

.loading, .empty {
  text-align: center;
  padding: 2rem;
  color: var(--ink-faint);
  font-style: italic;
}
</style>
