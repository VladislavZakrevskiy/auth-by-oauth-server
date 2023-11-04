import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: false,
    title: 'Zustand-mobx-tailwind-fsd API',
    description: 'The Zustand-mobx-tailwind-fsd API description',
    version: '1.5',
    path: 'api',
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
