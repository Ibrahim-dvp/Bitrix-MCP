/**
 * Contact CRUD Tools
 */

import { contactAPI } from '../bitrix-api.js';
import { STANDARD_FIELDS } from '../constants.js';

export const contactTools = [
  {
    name: 'bitrix_contact_list',
    description: 'List contacts from Bitrix24 CRM with filtering and pagination.',
    inputSchema: {
      type: 'object',
      properties: {
        select: {
          type: 'array',
          items: { type: 'string' },
          description: 'Fields to select'
        },
        filter: {
          type: 'object',
          description: 'Filter conditions'
        },
        order: {
          type: 'object',
          description: 'Sort order'
        },
        start: {
          type: 'number',
          description: 'Pagination offset'
        },
        limit: {
          type: 'number',
          description: 'Max results (default: 50)'
        }
      }
    },
    handler: async (params) => {
      const { select, filter = {}, order = { ID: 'DESC' }, start = 0, limit = 50 } = params;

      const result = await contactAPI.list({
        select: select || STANDARD_FIELDS.contact,
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
    name: 'bitrix_contact_get',
    description: 'Get detailed information about a specific contact by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Contact ID'
        }
      },
      required: ['id']
    },
    handler: async (params) => {
      const contact = await contactAPI.get(params.id);
      return {
        success: true,
        contact
      };
    }
  },

  {
    name: 'bitrix_contact_search',
    description: 'Search for contacts by name. Searches both first and last names.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (contact name)'
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

      const result = await contactAPI.list({
        select: ['ID', 'NAME', 'LAST_NAME', 'PHONE', 'EMAIL', 'COMPANY_ID', 'COMPANY_TITLE'],
        filter: {
          '%NAME': query,
          '%LAST_NAME': query,
          'LOGIC': 'OR'
        },
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
    name: 'bitrix_contact_create',
    description: 'Create a new contact in Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'First name (required)'
        },
        last_name: {
          type: 'string',
          description: 'Last name (required)'
        },
        second_name: { type: 'string', description: 'Middle name' },
        company_id: { type: 'number', description: 'Company ID to link to' },
        phone: {
          type: 'array',
          items: { type: 'object' },
          description: 'Phone numbers'
        },
        email: {
          type: 'array',
          items: { type: 'object' },
          description: 'Email addresses'
        },
        post: { type: 'string', description: 'Job title' },
        address: { type: 'string', description: 'Street address' },
        address_city: { type: 'string', description: 'City' },
        address_postal_code: { type: 'string', description: 'Postal code' },
        comments: { type: 'string', description: 'Notes/comments' },
        assigned_by_id: { type: 'number', description: 'Assigned user ID' }
      },
      required: ['name', 'last_name']
    },
    handler: async (params) => {
      const bitrixFields = {};
      for (const [key, value] of Object.entries(params)) {
        const upperKey = key.toUpperCase();
        bitrixFields[upperKey] = value;
      }

      const id = await contactAPI.add(bitrixFields);

      return {
        success: true,
        id,
        message: `Contact created successfully with ID ${id}`
      };
    }
  },

  {
    name: 'bitrix_contact_update',
    description: 'Update an existing contact in Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Contact ID (required)'
        },
        name: { type: 'string', description: 'First name' },
        last_name: { type: 'string', description: 'Last name' },
        second_name: { type: 'string', description: 'Middle name' },
        company_id: { type: 'number', description: 'Company ID' },
        phone: { type: 'array', items: { type: 'object' } },
        email: { type: 'array', items: { type: 'object' } },
        post: { type: 'string', description: 'Job title' },
        comments: { type: 'string', description: 'Notes/comments' }
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

      const result = await contactAPI.update(id, bitrixFields);

      return {
        success: true,
        id,
        updated: result,
        message: `Contact ${id} updated successfully`
      };
    }
  },

  {
    name: 'bitrix_contact_delete',
    description: 'Delete a contact from Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Contact ID to delete'
        }
      },
      required: ['id']
    },
    handler: async (params) => {
      const result = await contactAPI.delete(params.id);

      return {
        success: true,
        id: params.id,
        deleted: result,
        message: `Contact ${params.id} deleted successfully`
      };
    }
  }
];
