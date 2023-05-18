export interface EmailModuleOptions {
  apiKey: string;
  domain: string;
  from: string;
  to?: string;
  subject?: string;
  text?: string;
}
