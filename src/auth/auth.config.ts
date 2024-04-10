import { AppInfo } from 'supertokens-node/types';

export const ConfigInjectionToken = 'TOKEN_CONFIG';

export type AuthModuleConfig = {
  appInfo: AppInfo;
  connectionURI: string;
  apiKey?: string;
};
