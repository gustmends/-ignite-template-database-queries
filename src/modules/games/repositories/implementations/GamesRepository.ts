import { Any, getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("game")
      .where("LOWER(game.title) like LOWER(:title)", {title: `%${param}%`})
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(*) AS count FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const result = await this.repository
      .createQueryBuilder("game")
      .leftJoin("game.users", "user")
      .addSelect("user")
      .where("game.id = :id", { id })
      .getOne();

      return result?.users || [];
  }
}
