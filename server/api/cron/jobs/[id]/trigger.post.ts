// POST /api/cron/jobs/:id/trigger — 手动触发任务

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  try {
    const data = await $fetch(`${config.openclawGatewayUrl}/api/cron/jobs/${id}/trigger`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openclawToken}`,
        'Content-Type': 'application/json'
      }
    })
    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '触发任务失败'
    })
  }
})
