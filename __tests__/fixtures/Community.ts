import { Community } from '@prisma/client'

export const COMMUNITY_FIXTURE: Community = {
  id: 'cec2ef65-9cd6-4c34-9b1c-44734ee85c08',
  name: 'Community',
  description: 'Test Community'
}

export const COMMUNITIES = [
  {
    id: '370352c8-c2d6-4381-b091-b7d6c0917120',
    name: 'Name 1',
    description: 'Description 1'
  },
  {
    id: '5e4b1ff5-2c38-48d4-a496-70d1c8a2cbea',
    name: 'Name 2',
    description: 'Description 2'
  },
  {
    id: '4e363b8e-7e87-4048-a148-9c3ccb9ed2d1',
    name: 'Name 3',
    description: 'Description 3'
  }
]
