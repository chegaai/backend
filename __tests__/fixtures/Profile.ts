import { Profile } from '.prisma/client'

export const PROFILE_FIXTURE: Profile = {
  id: '2f196d36-8079-484f-85d1-295f78e2ee29',
  name: 'Vinicius',
  lastName: 'André Lucca Baptista',
  dateOfBirth: new Date('1997-03-26T00:00:00.000Z'),
  idNumber: '25.017.924-6',
  taxId: '287.498.340-37',
  userId: 'c3cdba1b-d125-4998-9295-f5508e7f52b8',
  profilePicture: null
}
