// GET /api/cron/jobs/:id — 获取单个任务

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  try {
    const data = await $fetch(`${config.openclawGatewayUrl}/api/cron/jobs/${id}`, {
      headers: {
        'Authorization': `Bearer ${config.openclawToken}`,
        'Content-Type': 'application/json'
      }
    })
    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取任务详情失败'
    })
  }
})
