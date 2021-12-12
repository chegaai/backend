import { z } from 'zod'
import { ProfileCreationSchema } from './create-profile'

export const LoginSchema = ProfileCreationSchema.pick({ email: true, password: true })

export type LoginParams = z.infer<typeof LoginSchema>
