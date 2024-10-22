import mongoose from 'mongoose';

export class Database {
  static url = <string>process.env.DB_HOST;
  static options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4, // Use IPv4, skip trying IPv6
  };
  static connect(): void {
    mongoose
      .connect(this.url, this.options)
      .then(() => console.info(`Database connected ${this.url}`));
  }
}
