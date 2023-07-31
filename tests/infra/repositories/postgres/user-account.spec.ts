import { type LoadUserAccountRepository } from '@/data/contracts/repositories'

import { newDb } from 'pg-mem'
import { Column, Entity, PrimaryGeneratedColumn, getRepository } from 'typeorm'

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepository = getRepository(PgUser)
    const pgUser = await pgUserRepository.findOne({ email: params.email })

    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }
}

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'nome', nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ name: 'id_facebook', nullable: true })
    facebookId?: string
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    it('should return an account if email exists', async () => {
      const db = newDb()
      const datasource = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })
      await datasource.synchronize()

      const pgUserRepository = getRepository(PgUser)
      await pgUserRepository.save({ email: 'existing_email' })

      const sut = new PgUserAccountRepository()

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })
  })
})
