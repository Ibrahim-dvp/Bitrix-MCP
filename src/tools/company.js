/**
 * Company CRUD Tools
 */

import { companyAPI, fetchAllPages } from '../bitrix-api.js';
import { STANDARD_FIELDS } from '../constants.js';

export const companyTools = [
  {
    name: 'bitrix_company_list',
    description: 'List companies from Bitrix24 CRM. Supports pagination, filtering, and field selection.',
    inputSchema: {
      type: 'object',
      properties: {
        select: {
          type: 'array',
          items: { type: 'string' },
          description: 'Fields to select (e.g., ["ID", "TITLE", "PHONE"]). If not specified, returns all fields.'
        },
        filter: {
          type: 'object',
          description: 'Filter conditions (e.g., {"TITLE": "Acme"} or {"%TITLE": "Acme"} for partial match)'
        },
        order: {
          type: 'object',
          description: 'Sort order (e.g., {"ID": "DESC"})'
        },
        start: {
          type: 'number',
          description: 'Offset for pagination (default: 0)'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 50)'
        }
      }
    },
    handler: async (params) => {
      const { select, filter = {}, order = { ID: 'DESC' }, start = 0, limit = 50 } = params;

      const requestParams = {
        select: select || STANDARD_FIELDS.company,
        filter,
        order,
        start
      };

      const result = await companyAPI.list(requestParams);

      // Handle different response formats
      const items = Array.isArray(result) ? result : (result.items || []);
      const limitedItems = items.slice(0, limit);

      return {
        success: true,
        total: result.total || items.length,
        items: limitedItems,
        count: limitedItems.length
      };
    }
  },

  {
    name: 'bitrix_company_get',
    description: 'Get detailed information about a specific company by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Company ID'
        }
      },
      required: ['id']
    },
    handler: async (params) => {
      const company = await companyAPI.get(params.id);

      return {
        success: true,
        company
      };
    }
  },

  {
    name: 'bitrix_company_search',
    description: 'Search for companies by name. Uses partial matching on the TITLE field.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (company name)'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results (default: 10)'
        }
      },
      required: ['query']
    },
    handler: async (params) => {
      const { query, limit = 10 } = params;

      const result = await companyAPI.list({
        select: ['ID', 'TITLE', 'PHONE', 'EMAIL', 'ADDRESS', 'UF_CRM_1708520927917'],
        filter: { '%TITLE': query },
        order: { ID: 'DESC' }
      });

      const items = Array.isArray(result) ? result : (result.items || []);
      const limitedItems = items.slice(0, limit);

      return {
        success: true,
        query,
        items: limitedItems,
        count: limitedItems.length
      };
    }
  },

  {
    name: 'bitrix_company_create',
    description: 'Create a new company in Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Company name (required)'
        },
        phone: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              VALUE: { type: 'string' },
              VALUE_TYPE: { type: 'string', enum: ['WORK', 'MOBILE', 'FAX', 'HOME', 'OTHER'] }
            }
          },
          description: 'Phone numbers'
        },
        email: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              VALUE: { type: 'string' },
              VALUE_TYPE: { type: 'string', enum: ['WORK', 'HOME', 'OTHER'] }
            }
          },
          description: 'Email addresses'
        },
        address: { type: 'string', description: 'Street address' },
        address_city: { type: 'string', description: 'City' },
        address_postal_code: { type: 'string', description: 'Postal code' },
        address_province: { type: 'string', description: 'Province/State' },
        address_country: { type: 'string', description: 'Country' },
        web: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              VALUE: { type: 'string' },
              VALUE_TYPE: { type: 'string' }
            }
          },
          description: 'Website URLs'
        },
        comments: { type: 'string', description: 'Notes/comments' },
        assigned_by_id: { type: 'number', description: 'Assigned user ID' },
        vat_number: { type: 'string', description: 'VAT number' },
        tax_code: { type: 'string', description: 'Tax code (Codice Fiscale)' },
        pec: { type: 'string', description: 'PEC email' },
        sdi_code: { type: 'string', description: 'SDI code' }
      },
      required: ['title']
    },
    handler: async (params) => {
      const { title, vat_number, tax_code, pec, sdi_code, ...otherFields } = params;

      const fields = {
        TITLE: title,
        ...otherFields
      };

      // Add custom fields if provided
      if (vat_number) fields.UF_CRM_1708520927917 = vat_number;
      if (tax_code) fields.UF_CRM_1708520972166 = tax_code;
      if (pec) fields.UF_CRM_1708521855072 = pec;
      if (sdi_code) fields.UF_CRM_1708523044307 = sdi_code;

      // Convert snake_case to UPPER_CASE for Bitrix fields
      const bitrixFields = {};
      for (const [key, value] of Object.entries(fields)) {
        const upperKey = key.toUpperCase();
        bitrixFields[upperKey] = value;
      }

      const id = await companyAPI.add(bitrixFields);

      return {
        success: true,
        id,
        message: `Company created successfully with ID ${id}`
      };
    }
  },

  {
    name: 'bitrix_company_update',
    description: 'Update an existing company in Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Company ID (required)'
        },
        title: { type: 'string', description: 'Company name' },
        phone: { type: 'array', items: { type: 'object' }, description: 'Phone numbers' },
        email: { type: 'array', items: { type: 'object' }, description: 'Email addresses' },
        address: { type: 'string', description: 'Street address' },
        address_city: { type: 'string', description: 'City' },
        address_postal_code: { type: 'string', description: 'Postal code' },
        address_province: { type: 'string', description: 'Province/State' },
        address_country: { type: 'string', description: 'Country' },
        comments: { type: 'string', description: 'Notes/comments' },
        vat_number: { type: 'string', description: 'VAT number' },
        tax_code: { type: 'string', description: 'Tax code' },
        pec: { type: 'string', description: 'PEC email' },
        sdi_code: { type: 'string', description: 'SDI code' }
      },
      required: ['id']
    },
    handler: async (params) => {
      const { id, vat_number, tax_code, pec, sdi_code, ...otherFields } = params;

      const fields = { ...otherFields };

      // Add custom fields if provided
      if (vat_number) fields.UF_CRM_1708520927917 = vat_number;
      if (tax_code) fields.UF_CRM_1708520972166 = tax_code;
      if (pec) fields.UF_CRM_1708521855072 = pec;
      if (sdi_code) fields.UF_CRM_1708523044307 = sdi_code;

      // Convert snake_case to UPPER_CASE
      const bitrixFields = {};
      for (const [key, value] of Object.entries(fields)) {
        if (key !== 'id') {
          const upperKey = key.toUpperCase();
          bitrixFields[upperKey] = value;
        }
      }

      const result = await companyAPI.update(id, bitrixFields);

      return {
        success: true,
        id,
        updated: result,
        message: `Company ${id} updated successfully`
      };
    }
  },

  {
    name: 'bitrix_company_delete',
    description: 'Delete a company from Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Company ID to delete'
        }
      },
      required: ['id']
    },
    handler: async (params) => {
      const result = await companyAPI.delete(params.id);

      return {
        success: true,
        id: params.id,
        deleted: result,
        message: `Company ${params.id} deleted successfully`
      };
    }
  }
];
