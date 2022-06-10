import { z } from 'zod'

const paginationInt = (name: string, defaultValue: string) =>
  z
    .string()
    .default(defaultValue)
    .refine((value) => !isNaN(parseInt(value, 10)), {
      message: `${name} must be an integer`
    })
    .transform((value) => parseInt(value, 10))
    .refine((value) => value >= 0, {
      message: `${name} must be greater or equal to 0`
    })

export const SearchQuerySchema = z.object({
  skip: paginationInt('skip', '0'),
  take: paginationInt('take', '10')
})

export type SearchQueryParams = z.output<typeof SearchQuerySchema>
