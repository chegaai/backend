import { Context, createContext } from '../../context'
import { CommunityService } from '../../../src/domain/communities'

describe('community service', () => {
  let ctx: Context
  let communityService: CommunityService

  beforeAll(() => {
    ctx = createContext()
    communityService = new CommunityService(ctx)
  })

  afterEach(async () => {
    await ctx.prisma.community.deleteMany()
  })

  describe('creating a community', () => {
    const CREATE_FIXTURE = {
      name: 'My community',
      description: 'My description'
    }

    it('should create a community', async () => {
      expect.assertions(1)

      return expect(
        communityService.createCommunity(CREATE_FIXTURE)
      ).resolves.toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: CREATE_FIXTURE.name,
          description: CREATE_FIXTURE.description
        })
      )
    })
  })

  describe('fetching a community', () => {
    beforeAll(async () => {})
  })
})
