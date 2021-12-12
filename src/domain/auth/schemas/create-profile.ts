import { z } from 'zod'
import { isCPF } from 'brazilian-values'

export const ProfileCreationSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z
    .string()
    .min(1)
    .transform((value) => new Date(value)),
  idNumber: z.string().min(1),
  taxId: z.string().refine(isCPF),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine((value: string) => {
      const hasNumber = /\d/
      const hasUpperCase = /[A-Z]/
      const hasLowerCase = /[a-z]/
      const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
      return hasNumber.test(value) && hasUpperCase.test(value) && hasLowerCase.test(value) && hasSpecialCharacter.test(value)
    })
})

export type ProfileCreationParams = z.input<typeof ProfileCreationSchema>
