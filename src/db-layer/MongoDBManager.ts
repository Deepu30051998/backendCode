import mongoose from 'mongoose';
import { logger } from '../logs';

export class MongoDBManager {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.url);
      logger.info('MongoDB connected successfully');
    } catch (err) {
      logger.error('MongoDB connection failed', err);
      process.exit(1);
    }
  }
}
