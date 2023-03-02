import { Injectable } from '@nestjs/common';
import { auth, Driver, driver as neo4jDriver, Result } from 'neo4j-driver';

@Injectable()
export class Neo4JService {
  private driver: Driver;

  constructor() {
    this.driver = neo4jDriver(
      process.env.DATABASE_URL_CONNECTION,
      auth.basic(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD),
    );
  }

  getReadSession() {
    return this.driver.session();
  }

  getWriteSession() {
    return this.driver.session();
  }

  read(cypher: string): Result {
    const session = this.getReadSession();
    return session.run(cypher);
  }

  write(cypher: string): Result {
    const session = this.getWriteSession();
    return session.run(cypher);
  }

  close() {
    this.driver.close();
  }
}
