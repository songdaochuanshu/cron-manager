<template>
  <div class="jobs fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">任务列表</h1>
        <p class="page-subtitle">管理所有定时任务</p>
      </div>
      <button class="btn btn-primary" @click="showCreate = true">+ 新建任务</button>
    </div>

    <!-- 筛选 -->
    <div class="filters mb-2">
      <input v-model="search" class="input search-input" placeholder="搜索任务名称…" />
      <select v-model="statusFilter" class="input select-input">
        <option value="all">全部状态</option>
        <option value="active">已启用</option>
        <option value="disabled">已停用</option>
      </select>
    </div>

    <div v-if="loading" class="loading">载入中…</div>
    <div v-else-if="filteredJobs.length === 0" class="empty">
      {{ search ? '未找到匹配任务' : '暂无任务，点击右上角新建' }}
    </div>
    <div v-else class="job-list">
      <div v-for="job in filteredJobs" :key="job.id" class="job-card card">
        <div class="job-top">
          <div class="job-info">
            <NuxtLink :to="`/jobs/${job.id}`" class="job-name">{{ job.name || job.id }}</NuxtLink>
            <span :class="job.enabled ? 'badge badge-success' : 'badge badge-danger'">
              {{ job.enabled ? '启用' : '停用' }}
            </span>
          </div>
          <div class="job-actions">
            <button class="btn btn-ghost" @click="handleTrigger(job.id)" :disabled="triggering === job.id">
              ▶
            </button>
            <button class="btn btn-ghost" @click="handleToggle(job)">
              {{ job.enabled ? '⏸' : '▶️' }}
            </button>
            <NuxtLink :to="`/jobs/${job.id}`" class="btn btn-ghost">详情</NuxtLink>
          </div>
        </div>
        <div class="job-meta">
          <span class="meta-item">
            <span class="meta-label">调度:</span>
            {{ formatSchedule(job.schedule) }}
          </span>
          <span class="meta-item">
            <span class="meta-label">目标:</span>
            {{ job.sessionTarget || '—' }}
          </span>
          <span v-if="job.description" class="meta-item text-muted">{{ job.description }}</span>
        </div>
      </div>
    </div>

    <!-- 新建任务弹窗 -->
    <Teleport to="body">
      <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
        <div class="modal card">
          <h2 class="modal-title">新建定时任务</h2>
          <CreateJobForm @created="handleCreated" @cancel="showCreate = false" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const { listJobs, triggerJob, updateJob } = useCronApi()

const loading = ref(true)
const jobs = ref<any[]>([])
const search = ref('')
const statusFilter = ref('all')
const showCreate = ref(false)
const triggering = ref<string | null>(null)

const filteredJobs = computed(() => {
  let result = jobs.value
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(j => (j.name || j.id).toLowerCase().includes(q))
  }
  if (statusFilter.value === 'active') result = result.filter(j => j.enabled)
  if (statusFilter.value === 'disabled') result = result.filter(j => !j.enabled)
  return result
})

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

async function handleToggle(job: any) {
  await updateJob(job.id, { enabled: !job.enabled })
  job.enabled = !job.enabled
}

function handleCreated() {
  showCreate.value = false
  refresh()
}

async function refresh() {
  loading.value = true
  try {
    jobs.value = await listJobs()
  } catch (e) {
    console.error('获取任务列表失败:', e)
  } finally {
    loading.value = false
  }
}

onMounted(refresh)
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
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

.filters {
  display: flex;
  gap: 1rem;
}
.search-input {
  flex: 1;
  max-width: 300px;
}
.select-input {
  width: 140px;
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.job-card {
  padding: 1.25rem;
}
.job-card::before {
  top: 0.75rem;
  bottom: 0.75rem;
}
.job-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.job-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.job-name {
  color: var(--ink-deep);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
}
.job-name:hover {
  color: var(--vermilion);
}
.job-actions {
  display: flex;
  gap: 0.25rem;
}
.job-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
}
.meta-label {
  color: var(--ink-faint);
  margin-right: 0.25rem;
}

.loading, .empty {
  text-align: center;
  padding: 3rem;
  color: var(--ink-faint);
  font-style: italic;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 46, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  width: 90%;
  max-width: 560px;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: 0.15rem;
  margin-bottom: 1.5rem;
}
</style>
