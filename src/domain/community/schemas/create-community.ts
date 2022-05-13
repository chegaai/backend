import { z } from 'zod'

export const CommunityCreationSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1)
})

export type CommunityCreationParams = z.input<typeof CommunityCreationSchema>
