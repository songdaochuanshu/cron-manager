// PATCH /api/cron/jobs/:id — 更新任务

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    const data = await $fetch(`${config.openclawGatewayUrl}/api/cron/jobs/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${config.openclawToken}`,
        'Content-Type': 'application/json'
      },
      body: { patch: body }
    })
    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '更新任务失败'
    })
  }
})
