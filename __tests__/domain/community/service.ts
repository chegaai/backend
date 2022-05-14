import { CommunityService } from '../../../src/domain/community'
import { CommunityDoesNotExistError } from '../../../src/domain/community/errors'
import { Context, createContext } from '../../context'
import { COMMUNITIES, COMMUNITY_FIXTURE } from '../../fixtures/Community'

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
    beforeEach(async () => {
      await ctx.prisma.community.create({ data: COMMUNITY_FIXTURE })
    })

    it('should fetch a community if it exists', async () => {
      expect.assertions(1)

      return expect(
        communityService.getCommunityById(COMMUNITY_FIXTURE.id)
      ).resolves.toEqual(
        expect.objectContaining({
          id: COMMUNITY_FIXTURE.id,
          name: COMMUNITY_FIXTURE.name,
          description: COMMUNITY_FIXTURE.description,
          events: expect.any(Array),
          members: expect.any(Array)
        })
      )
    })

    it('should error if community does not exist', async () => {
      expect.assertions(1)

      return expect(
        communityService.getCommunityById('not-a-valid-id')
      ).rejects.toThrow(CommunityDoesNotExistError)
    })
  })

  describe('searching communities', () => {
    beforeEach(async () => {
      await ctx.prisma.community.createMany({
        data: COMMUNITIES
      })
    })

    it('should return all communities if no query is provided', async () => {
      expect.assertions(1)

      return expect(communityService.searchCommunities({})).resolves.toEqual(
        expect.arrayContaining(COMMUNITIES)
      )
    })

    it('should allow to search by name', async () => {
      expect.assertions(1)

      return expect(
        communityService.searchCommunities({ name: 'name 1' })
      ).resolves.toEqual([expect.objectContaining(COMMUNITIES[0])])
    })

    it('should allow to search by description', async () => {
      expect.assertions(1)

      return expect(
        communityService.searchCommunities({ description: 'description 1' })
      ).resolves.toEqual([expect.objectContaining(COMMUNITIES[0])])
    })

    it('should take page and skip into consideration', async () => {
      expect.assertions(1)

      return expect(
        communityService.searchCommunities({
          skip: '1',
          take: '1'
        })
      ).resolves.toEqual(
        expect.arrayContaining([expect.objectContaining(COMMUNITIES[1])])
      )
    })
  })
})
