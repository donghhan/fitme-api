import * as Joi from 'joi';

export default () => ({
  isGlobal: true,
  envFilePath:
    process.env.NODE_ENV === 'development' ? '.development.env' : '.test.env',
  ignoreEnvFile: process.env.NODE_ENV === 'production' ? true : false,
  entities: [],
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('cookies').default('development'),
    DATABASE_PORT: Joi.number().default(5432),
    DATABASE_USERNAME: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),
  }),
});
