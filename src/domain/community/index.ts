import { PrismaClient } from '@prisma/client'
import { Context } from '../../context'
import { CommunityDoesNotExistError } from './errors'
import {
  CommunityCreationParams,
  CommunityCreationSchema
} from './schemas/create-community'
import {
  CommunitySearchParams,
  CommunitySearchParamsSchema
} from './schemas/search-community'

export class CommunityService {
  readonly #prisma: PrismaClient

  constructor(ctx: Context) {
    this.#prisma = ctx.prisma
  }

  async createCommunity(rawData: CommunityCreationParams) {
    const data = CommunityCreationSchema.parse(rawData)

    const { name, description } = data

    return this.#prisma.community.create({
      data: {
        name,
        description
      }
    })
  }

  async getCommunityById(id: string) {
    const community = await this.#prisma.community.findUnique({
      where: { id },
      include: { events: true, members: true }
    })

    if (!community) throw new CommunityDoesNotExistError(id)

    return community
  }

  async searchCommunities(rawParams: CommunitySearchParams) {
    const { name, description, skip, take } =
      CommunitySearchParamsSchema.parse(rawParams)

    const where = {
      where: {
        OR: [
          ...(name ? [{ name: { contains: name } }] : []),
          ...(description ? [{ description: { contains: description } }] : [])
        ]
      }
    }

    return this.#prisma.community.findMany({
      ...(name || description ? where : {}),
      skip,
      take,
      orderBy: { name: 'asc' }
    })
  }
}
