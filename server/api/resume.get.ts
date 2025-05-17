import type { CandidateProfile } from "~/lib/types"

export default defineEventHandler(async (event) => {
  try {
    const data: CandidateProfile = await $fetch('https://dev.jobcart.ru/wp-json/test/v2/app')
    return data
  } catch (error) {
    return sendError(event, createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch external data',
      data: error
    }))
  }
})
