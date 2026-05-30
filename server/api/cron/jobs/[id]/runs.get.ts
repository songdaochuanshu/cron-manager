// GET /api/cron/jobs/:id/runs — 获取任务执行记录

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  try {
    const data = await $fetch(`${config.openclawGatewayUrl}/api/cron/jobs/${id}/runs`, {
      headers: {
        'Authorization': `Bearer ${config.openclawToken}`,
        'Content-Type': 'application/json'
      }
    })
    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取执行记录失败'
    })
  }
})
