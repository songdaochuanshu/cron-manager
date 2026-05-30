<template>
  <form @submit.prevent="handleSubmit" class="form">
    <div class="form-group">
      <label class="form-label">任务名称</label>
      <input v-model="form.name" class="input" placeholder="例：每日邮件汇报" required />
    </div>

    <div class="form-group">
      <label class="form-label">调度类型</label>
      <select v-model="form.scheduleKind" class="input">
        <option value="cron">Cron 表达式</option>
        <option value="every">固定间隔</option>
        <option value="at">指定时间</option>
      </select>
    </div>

    <div v-if="form.scheduleKind === 'cron'" class="form-group">
      <label class="form-label">Cron 表达式</label>
      <input v-model="form.cronExpr" class="input" placeholder="0 9 * * *" />
      <p class="form-hint">例：0 9 * * * = 每天9点</p>
    </div>

    <div v-if="form.scheduleKind === 'every'" class="form-group">
      <label class="form-label">间隔（分钟）</label>
      <input v-model.number="form.everyMinutes" type="number" class="input" min="1" placeholder="30" />
    </div>

    <div v-if="form.scheduleKind === 'at'" class="form-group">
      <label class="form-label">执行时间</label>
      <input v-model="form.atTime" type="datetime-local" class="input" />
    </div>

    <div class="form-group">
      <label class="form-label">时区</label>
      <input v-model="form.tz" class="input" placeholder="Asia/Shanghai" />
    </div>

    <div class="form-group">
      <label class="form-label">任务类型</label>
      <select v-model="form.payloadKind" class="input">
        <option value="systemEvent">系统事件</option>
        <option value="agentTurn">Agent 对话</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">{{ form.payloadKind === 'systemEvent' ? '事件文本' : '对话消息' }}</label>
      <textarea v-model="form.payloadText" class="input textarea" :placeholder="form.payloadKind === 'systemEvent' ? '系统事件内容…' : 'Agent 提示词…'" rows="3" required />
    </div>

    <div class="form-group">
      <label class="form-label">会话目标</label>
      <select v-model="form.sessionTarget" class="input">
        <option value="main">主会话</option>
        <option value="isolated">隔离会话</option>
        <option value="current">当前会话</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">描述（可选）</label>
      <input v-model="form.description" class="input" placeholder="任务说明…" />
    </div>

    <div class="form-actions">
      <button type="button" class="btn" @click="$emit('cancel')">取消</button>
      <button type="submit" class="btn btn-primary" :disabled="submitting">
        {{ submitting ? '创建中…' : '创建任务' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits(['created', 'cancel'])
const { createJob } = useCronApi()

const submitting = ref(false)

const form = reactive({
  name: '',
  scheduleKind: 'cron',
  cronExpr: '0 9 * * *',
  everyMinutes: 30,
  atTime: '',
  tz: 'Asia/Shanghai',
  payloadKind: 'systemEvent',
  payloadText: '',
  sessionTarget: 'main',
  description: ''
})

async function handleSubmit() {
  submitting.value = true
  try {
    const schedule: any = { kind: form.scheduleKind }
    if (form.scheduleKind === 'cron') {
      schedule.expr = form.cronExpr
      schedule.tz = form.tz
    } else if (form.scheduleKind === 'every') {
      schedule.everyMs = form.everyMinutes * 60 * 1000
    } else if (form.scheduleKind === 'at') {
      schedule.at = new Date(form.atTime).toISOString()
    }

    const payload: any = { kind: form.payloadKind }
    if (form.payloadKind === 'systemEvent') {
      payload.text = form.payloadText
    } else {
      payload.message = form.payloadText
    }

    await createJob({
      name: form.name,
      schedule,
      payload,
      sessionTarget: form.sessionTarget,
      description: form.description || undefined
    })

    emit('created')
  } catch (e: any) {
    alert('创建失败: ' + (e.message || '未知错误'))
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-label {
  font-size: 0.8rem;
  color: var(--ink-light);
  letter-spacing: 0.08rem;
  font-weight: 600;
}
.form-hint {
  font-size: 0.75rem;
  color: var(--ink-faint);
  margin-top: 0.15rem;
}
.textarea {
  resize: vertical;
  min-height: 80px;
  font-family: var(--font-serif);
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
