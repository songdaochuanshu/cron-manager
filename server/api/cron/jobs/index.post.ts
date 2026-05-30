// POST /api/cron/jobs — 创建任务

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    const data = await $fetch(`${config.openclawGatewayUrl}/api/cron/jobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openclawToken}`,
        'Content-Type': 'application/json'
      },
      body: { job: body }
    })
    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '创建任务失败'
    })
  }
})
