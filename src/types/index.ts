/**
 * Type definitions for Bitrix24 MCP Server
 */

export interface BitrixConfig {
  baseUrl: string;
  token: string;
  defaultPageSize: number;
  maxPageSize: number;
  requestTimeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface BitrixEntity {
  company: 'crm.company';
  contact: 'crm.contact';
  lead: 'crm.lead';
  deal: 'crm.deal';
  invoice: 'crm.item';
}

export type EntityType = 'company' | 'contact' | 'lead' | 'deal' | 'invoice';

export interface BitrixListParams {
  select?: string[];
  filter?: Record<string, any>;
  order?: Record<string, 'ASC' | 'DESC'>;
  start?: number;
}

export interface BitrixResponse<T = any> {
  result?: T;
  total?: number;
  next?: number;
  error?: string;
  error_description?: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  handler: (params: any) => Promise<any>;
}

export interface MCPToolResponse {
  success: boolean;
  [key: string]: any;
}

// Bitrix field types
export interface BitrixCompanyFields {
  ID?: string;
  TITLE?: string;
  PHONE?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  EMAIL?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  ADDRESS?: string;
  ADDRESS_CITY?: string;
  ADDRESS_POSTAL_CODE?: string;
  ADDRESS_PROVINCE?: string;
  ADDRESS_COUNTRY?: string;
  UF_CRM_1708520927917?: string; // VAT
  UF_CRM_1708520972166?: string; // Tax Code
  UF_CRM_1708521855072?: string; // PEC
  UF_CRM_1708523044307?: string; // SDI
  [key: string]: any;
}

export interface BitrixContactFields {
  ID?: string;
  NAME?: string;
  LAST_NAME?: string;
  COMPANY_ID?: string;
  PHONE?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  EMAIL?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  [key: string]: any;
}

export interface BitrixLeadFields {
  ID?: string;
  TITLE?: string;
  NAME?: string;
  LAST_NAME?: string;
  STATUS_ID?: string;
  OPPORTUNITY?: string;
  [key: string]: any;
}

export interface BitrixDealFields {
  ID?: string;
  TITLE?: string;
  STAGE_ID?: string;
  COMPANY_ID?: string;
  CONTACT_ID?: string;
  OPPORTUNITY?: string;
  CURRENCY_ID?: string;
  [key: string]: any;
}

export interface BitrixInvoiceFields {
  id?: number;
  title?: string;
  companyId?: number;
  contactId?: number;
  opportunity?: number;
  currencyId?: string;
  stageId?: string;
  mycompanyId?: number;
  [key: string]: any;
}

export interface ProductRow {
  productName: string;
  quantity: number;
  price: number;
  taxRate?: number;
  taxIncluded?: string;
}
