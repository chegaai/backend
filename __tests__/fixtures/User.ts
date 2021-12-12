import { User } from '.prisma/client'

export const USER_FIXTURE: User = {
  id: 'c3cdba1b-d125-4998-9295-f5508e7f52b8',
  provider: null,
  providerId: null,
  email: 'vinicius.baptista@mabeitex.com.br',
  password: '$argon2id$v=19$m=15360,t=2,p=1$nZPpLA1m17Oxtnu7JWCKoA$IRKxtI5oa40U/PIboSFSfIEco+WqKQk1x9mWZMHkS+4',
  role: 'USER'
}
