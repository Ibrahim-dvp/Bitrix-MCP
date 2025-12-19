/**
 * Lead CRUD Tools
 */

import { leadAPI } from '../bitrix-api.js';
import { STANDARD_FIELDS } from '../constants.js';

export const leadTools = [
  {
    name: 'bitrix_lead_list',
    description: 'List leads from Bitrix24 CRM with filtering and pagination.',
    inputSchema: {
      type: 'object',
      properties: {
        select: {
          type: 'array',
          items: { type: 'string' }
        },
        filter: {
          type: 'object',
          description: 'Filter conditions (e.g., {"STATUS_ID": "NEW"})'
        },
        order: {
          type: 'object'
        },
        start: {
          type: 'number'
        },
        limit: {
          type: 'number',
          description: 'Max results (default: 50)'
        }
      }
    },
    handler: async (params) => {
      const { select, filter = {}, order = { ID: 'DESC' }, start = 0, limit = 50 } = params;

      const result = await leadAPI.list({
        select: select || STANDARD_FIELDS.lead,
        filter,
        order,
        start
      });

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
    name: 'bitrix_lead_get',
    description: 'Get detailed information about a specific lead by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Lead ID'
        }
      },
      required: ['id']
    },
    handler: async (params) => {
      const lead = await leadAPI.get(params.id);
      return {
        success: true,
        lead
      };
    }
  },

  {
    name: 'bitrix_lead_search',
    description: 'Search for leads by title or company name.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query'
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

      const result = await leadAPI.list({
        select: ['ID', 'TITLE', 'NAME', 'LAST_NAME', 'COMPANY_TITLE', 'STATUS_ID', 'OPPORTUNITY'],
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
    name: 'bitrix_lead_create',
    description: 'Create a new lead in Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Lead title (required)'
        },
        name: { type: 'string', description: 'First name' },
        last_name: { type: 'string', description: 'Last name' },
        company_title: { type: 'string', description: 'Company name' },
        status_id: { type: 'string', description: 'Status ID (e.g., "NEW")' },
        source_id: { type: 'string', description: 'Source ID' },
        phone: { type: 'array', items: { type: 'object' } },
        email: { type: 'array', items: { type: 'object' } },
        opportunity: { type: 'number', description: 'Opportunity amount' },
        currency_id: { type: 'string', description: 'Currency (e.g., "EUR")' },
        comments: { type: 'string', description: 'Notes/comments' },
        assigned_by_id: { type: 'number', description: 'Assigned user ID' }
      },
      required: ['title']
    },
    handler: async (params) => {
      const bitrixFields = {};
      for (const [key, value] of Object.entries(params)) {
        const upperKey = key.toUpperCase();
        bitrixFields[upperKey] = value;
      }

      const id = await leadAPI.add(bitrixFields);

      return {
        success: true,
        id,
        message: `Lead created successfully with ID ${id}`
      };
    }
  },

  {
    name: 'bitrix_lead_update',
    description: 'Update an existing lead in Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Lead ID (required)'
        },
        title: { type: 'string' },
        status_id: { type: 'string', description: 'Status ID' },
        opportunity: { type: 'number', description: 'Opportunity amount' },
        comments: { type: 'string' }
      },
      required: ['id']
    },
    handler: async (params) => {
      const { id, ...fields } = params;

      const bitrixFields = {};
      for (const [key, value] of Object.entries(fields)) {
        const upperKey = key.toUpperCase();
        bitrixFields[upperKey] = value;
      }

      const result = await leadAPI.update(id, bitrixFields);

      return {
        success: true,
        id,
        updated: result,
        message: `Lead ${id} updated successfully`
      };
    }
  },

  {
    name: 'bitrix_lead_delete',
    description: 'Delete a lead from Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Lead ID to delete'
        }
      },
      required: ['id']
    },
    handler: async (params) => {
      const result = await leadAPI.delete(params.id);

      return {
        success: true,
        id: params.id,
        deleted: result,
        message: `Lead ${params.id} deleted successfully`
      };
    }
  }
];
