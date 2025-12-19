/**
 * Company CRUD Tools
 */

import { companyAPI } from '../lib/bitrix-api.js';
import { BITRIX_FIELDS } from '../config/index.js';
import type { ToolDefinition } from '../types/index.js';

const STANDARD_COMPANY_FIELDS = [
  'ID',
  'TITLE',
  'PHONE',
  'EMAIL',
  'ADDRESS',
  'ADDRESS_CITY',
  'ADDRESS_POSTAL_CODE',
  'ADDRESS_PROVINCE',
  'ADDRESS_COUNTRY',
  'ASSIGNED_BY_ID',
  'DATE_CREATE',
  'DATE_MODIFY',
  BITRIX_FIELDS.COMPANY_VAT,
  BITRIX_FIELDS.COMPANY_TAX_CODE,
  BITRIX_FIELDS.COMPANY_PEC,
  BITRIX_FIELDS.COMPANY_SDI,
];

export const companyTools: ToolDefinition[] = [
  {
    name: 'bitrix_company_list',
    description:
      'List companies from Bitrix24 CRM. Supports pagination, filtering, and field selection.',
    inputSchema: {
      type: 'object',
      properties: {
        select: {
          type: 'array',
          items: { type: 'string' },
          description: 'Fields to select. If not specified, returns standard fields.',
        },
        filter: {
          type: 'object',
          description:
            'Filter conditions (e.g., {"TITLE": "Acme"} or {"%TITLE": "Acme"} for partial match)',
        },
        order: {
          type: 'object',
          description: 'Sort order (e.g., {"ID": "DESC"})',
        },
        start: {
          type: 'number',
          description: 'Offset for pagination (default: 0)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 50)',
        },
      },
    },
    handler: async (params) => {
      const { select, filter = {}, order = { ID: 'DESC' }, start = 0, limit = 50 } = params;

      const result = await companyAPI.list({
        select: select || STANDARD_COMPANY_FIELDS,
        filter,
        order,
        start,
      });

      const items = Array.isArray(result) ? result : result.items || [];
      const limitedItems = items.slice(0, limit);

      return {
        success: true,
        total: result.total || items.length,
        items: limitedItems,
        count: limitedItems.length,
      };
    },
  },

  {
    name: 'bitrix_company_get',
    description: 'Get detailed information about a specific company by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Company ID',
        },
      },
      required: ['id'],
    },
    handler: async (params) => {
      const company = await companyAPI.get(params.id);
      return {
        success: true,
        company,
      };
    },
  },

  {
    name: 'bitrix_company_search',
    description: 'Search for companies by name. Uses partial matching on the TITLE field.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (company name)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 10)',
        },
      },
      required: ['query'],
    },
    handler: async (params) => {
      const { query, limit = 10 } = params;

      const result = await companyAPI.list({
        select: STANDARD_COMPANY_FIELDS,
        filter: { '%TITLE': query },
        order: { ID: 'DESC' },
      });

      const items = Array.isArray(result) ? result : result.items || [];
      const limitedItems = items.slice(0, limit);

      return {
        success: true,
        query,
        items: limitedItems,
        count: limitedItems.length,
      };
    },
  },

  {
    name: 'bitrix_company_create',
    description: 'Create a new company in Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Company name (required)',
        },
        phone: {
          type: 'array',
          items: { type: 'object' },
          description: 'Phone numbers',
        },
        email: {
          type: 'array',
          items: { type: 'object' },
          description: 'Email addresses',
        },
        address: { type: 'string' },
        address_city: { type: 'string' },
        address_postal_code: { type: 'string' },
        address_province: { type: 'string' },
        address_country: { type: 'string' },
        vat_number: { type: 'string' },
        tax_code: { type: 'string' },
        pec: { type: 'string' },
        sdi_code: { type: 'string' },
        assigned_by_id: { type: 'number' },
        comments: { type: 'string' },
      },
      required: ['title'],
    },
    handler: async (params) => {
      const { title, vat_number, tax_code, pec, sdi_code, ...otherFields } = params;

      const fields: Record<string, any> = {
        TITLE: title,
      };

      // Map custom fields
      if (vat_number) fields[BITRIX_FIELDS.COMPANY_VAT] = vat_number;
      if (tax_code) fields[BITRIX_FIELDS.COMPANY_TAX_CODE] = tax_code;
      if (pec) fields[BITRIX_FIELDS.COMPANY_PEC] = pec;
      if (sdi_code) fields[BITRIX_FIELDS.COMPANY_SDI] = sdi_code;

      // Map other fields to uppercase
      for (const [key, value] of Object.entries(otherFields)) {
        fields[key.toUpperCase()] = value;
      }

      const id = await companyAPI.add(fields);

      return {
        success: true,
        id,
        message: `Company created successfully with ID ${id}`,
      };
    },
  },

  {
    name: 'bitrix_company_update',
    description: 'Update an existing company in Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Company ID (required)' },
        title: { type: 'string' },
        vat_number: { type: 'string' },
        tax_code: { type: 'string' },
        pec: { type: 'string' },
        sdi_code: { type: 'string' },
        phone: { type: 'array' },
        email: { type: 'array' },
        address: { type: 'string' },
        address_city: { type: 'string' },
        comments: { type: 'string' },
      },
      required: ['id'],
    },
    handler: async (params) => {
      const { id, vat_number, tax_code, pec, sdi_code, ...otherFields } = params;

      const fields: Record<string, any> = {};

      if (vat_number) fields[BITRIX_FIELDS.COMPANY_VAT] = vat_number;
      if (tax_code) fields[BITRIX_FIELDS.COMPANY_TAX_CODE] = tax_code;
      if (pec) fields[BITRIX_FIELDS.COMPANY_PEC] = pec;
      if (sdi_code) fields[BITRIX_FIELDS.COMPANY_SDI] = sdi_code;

      for (const [key, value] of Object.entries(otherFields)) {
        if (key !== 'id') {
          fields[key.toUpperCase()] = value;
        }
      }

      const result = await companyAPI.update(id, fields);

      return {
        success: true,
        id,
        updated: result,
        message: `Company ${id} updated successfully`,
      };
    },
  },

  {
    name: 'bitrix_company_delete',
    description: 'Delete a company from Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Company ID to delete',
        },
      },
      required: ['id'],
    },
    handler: async (params) => {
      const result = await companyAPI.delete(params.id);

      return {
        success: true,
        id: params.id,
        deleted: result,
        message: `Company ${params.id} deleted successfully`,
      };
    },
  },
];
