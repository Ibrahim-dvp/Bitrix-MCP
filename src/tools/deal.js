/**
 * Deal CRUD Tools
 */

import { dealAPI } from '../bitrix-api.js';
import { STANDARD_FIELDS } from '../constants.js';

export const dealTools = [
  {
    name: 'bitrix_deal_list',
    description: 'List deals from Bitrix24 CRM with filtering and pagination.',
    inputSchema: {
      type: 'object',
      properties: {
        select: {
          type: 'array',
          items: { type: 'string' }
        },
        filter: {
          type: 'object',
          description: 'Filter conditions (e.g., {"STAGE_ID": "WON"})'
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

      const result = await dealAPI.list({
        select: select || STANDARD_FIELDS.deal,
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
    name: 'bitrix_deal_get',
    description: 'Get detailed information about a specific deal by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Deal ID'
        }
      },
      required: ['id']
    },
    handler: async (params) => {
      const deal = await dealAPI.get(params.id);
      return {
        success: true,
        deal
      };
    }
  },

  {
    name: 'bitrix_deal_search',
    description: 'Search for deals by title.',
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

      const result = await dealAPI.list({
        select: ['ID', 'TITLE', 'STAGE_ID', 'OPPORTUNITY', 'COMPANY_ID', 'CONTACT_ID'],
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
    name: 'bitrix_deal_create',
    description: 'Create a new deal in Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Deal title (required)'
        },
        stage_id: { type: 'string', description: 'Stage ID (e.g., "NEW")' },
        company_id: { type: 'number', description: 'Company ID' },
        contact_id: { type: 'number', description: 'Contact ID' },
        opportunity: { type: 'number', description: 'Deal amount' },
        currency_id: { type: 'string', description: 'Currency (e.g., "EUR")' },
        begindate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        closedate: { type: 'string', description: 'Close date (YYYY-MM-DD)' },
        probability: { type: 'number', description: 'Probability (0-100)' },
        comments: { type: 'string', description: 'Notes/comments' },
        assigned_by_id: { type: 'number', description: 'Assigned user ID' },
        category_id: { type: 'number', description: 'Category/Pipeline ID' }
      },
      required: ['title']
    },
    handler: async (params) => {
      const bitrixFields = {};
      for (const [key, value] of Object.entries(params)) {
        const upperKey = key.toUpperCase();
        bitrixFields[upperKey] = value;
      }

      const id = await dealAPI.add(bitrixFields);

      return {
        success: true,
        id,
        message: `Deal created successfully with ID ${id}`
      };
    }
  },

  {
    name: 'bitrix_deal_update',
    description: 'Update an existing deal in Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Deal ID (required)'
        },
        title: { type: 'string' },
        stage_id: { type: 'string', description: 'Stage ID' },
        opportunity: { type: 'number', description: 'Deal amount' },
        closedate: { type: 'string', description: 'Close date' },
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

      const result = await dealAPI.update(id, bitrixFields);

      return {
        success: true,
        id,
        updated: result,
        message: `Deal ${id} updated successfully`
      };
    }
  },

  {
    name: 'bitrix_deal_delete',
    description: 'Delete a deal from Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Deal ID to delete'
        }
      },
      required: ['id']
    },
    handler: async (params) => {
      const result = await dealAPI.delete(params.id);

      return {
        success: true,
        id: params.id,
        deleted: result,
        message: `Deal ${params.id} deleted successfully`
      };
    }
  }
];
