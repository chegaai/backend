import { CommunityService } from '../../../src/domain/community'
import { CommunityDoesNotExistError } from '../../../src/domain/community/errors'
import { Context, createContext } from '../../context'

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
    let communityId: string

    beforeEach(async () => {
      const community = await ctx.prisma.community.create({ data: { name: 'test', description: 'test' } })

      communityId = community.id
    })

    it('should fetch a community if it exists', async () => {
      expect.assertions(1)

      return expect(communityService.getCommunityById(communityId)).resolves.toEqual(
        expect.objectContaining({
          id: communityId,
          name: 'test',
          description: 'test',
          events: expect.any(Array),
          members: expect.any(Array)
        })
      )
    })

    it('should error if community does not exist', async () => {
      expect.assertions(1)

      return expect(communityService.getCommunityById('not-a-valid-id')).rejects.toThrow(CommunityDoesNotExistError)
    })
  })
})
