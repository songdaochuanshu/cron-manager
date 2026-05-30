// GET /api/cron/status — 获取调度器状态

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const data = await $fetch(`${config.openclawGatewayUrl}/api/cron/status`, {
      headers: {
        'Authorization': `Bearer ${config.openclawToken}`,
        'Content-Type': 'application/json'
      }
    })
    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取状态失败'
    })
  }
})
