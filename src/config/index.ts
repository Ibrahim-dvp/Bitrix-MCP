/**
 * Configuration management
 */

import dotenv from 'dotenv';
import { BitrixConfig } from '../types/index.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['BITRIX_BASE_URL', 'BITRIX_TOKEN'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config: BitrixConfig = {
  baseUrl: process.env.BITRIX_BASE_URL!,
  token: process.env.BITRIX_TOKEN!,
  defaultPageSize: 50,
  maxPageSize: 50,
  requestTimeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

export const serverConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
};

export function getWebhookUrl(method: string): string {
  return `${config.baseUrl}/${config.token}/${method}.json`;
}

// Entity type IDs
export const ENTITY_TYPES = {
  SMART_INVOICE: 31,
  ADDRESS: 8,
} as const;

// Custom field mappings
export const BITRIX_FIELDS = {
  COMPANY_VAT: 'UF_CRM_1708520927917',
  COMPANY_TAX_CODE: 'UF_CRM_1708520972166',
  COMPANY_PEC: 'UF_CRM_1708521855072',
  COMPANY_SDI: 'UF_CRM_1708523044307',
  INVOICE_DIVISION: 'ufCrm_1718184641',
} as const;

// Division mappings
export const DIVISIONS = {
  1419: 'Atoma',
  1420: 'Harlock',
  3294: 'Azienda Solida',
} as const;
