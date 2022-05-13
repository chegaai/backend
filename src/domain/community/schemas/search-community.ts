import { z } from 'zod'
import { SearchQuerySchema } from '../../schemas/search-query'

export const CommunitySearchParamsSchema = SearchQuerySchema.extend({
  name: z.string().optional(),
  description: z.string().optional()
})

export type CommunitySearchParams = z.input<typeof CommunitySearchParamsSchema>
