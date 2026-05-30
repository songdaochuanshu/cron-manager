// GET /api/cron/jobs — 获取任务列表

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  try {
    const data = await $fetch(`${config.openclawGatewayUrl}/api/cron/jobs`, {
      headers: {
        'Authorization': `Bearer ${config.openclawToken}`,
        'Content-Type': 'application/json'
      },
      query: {
        includeDisabled: query.includeDisabled === 'true'
      }
    })
    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取任务列表失败'
    })
  }
})
