import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { Restaurant } from './restaurants/models/restaurant.model';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      synchronize: true,
      logging: true,
      entities: [Restaurant],
      retryDelay: 3500,
      retryAttempts: 5,
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
