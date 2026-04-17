import { ConfigSchema, type Config } from '@/types/config';
import rawConfig from './config.json';

export const config: Config = ConfigSchema.parse(rawConfig);
