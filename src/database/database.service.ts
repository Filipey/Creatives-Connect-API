import { Injectable } from '@nestjs/common';
import { auth, Driver, driver as neo4jDriver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4JService {
  private driver: Driver;

  constructor() {
    this.driver = neo4jDriver(
      process.env.DATABASE_URL_CONNECTION,
      auth.basic(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD),
    );
  }

  getSession(): Session {
    return this.driver.session();
  }

  close() {
    this.driver.close();
  }
}
