/**
 * Smart Invoice CRUD Tools
 * Smart Invoices use entityTypeId: 31
 */

import { invoiceAPI } from '../bitrix-api.js';
import { STANDARD_FIELDS } from '../constants.js';

export const invoiceTools = [
  {
    name: 'bitrix_invoice_list',
    description: 'List Smart Invoices (entityTypeId: 31) from Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        select: {
          type: 'array',
          items: { type: 'string' }
        },
        filter: {
          type: 'object',
          description: 'Filter conditions (e.g., {"companyId": 123})'
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
      const { select, filter = {}, order = { id: 'DESC' }, start = 0, limit = 50 } = params;

      const result = await invoiceAPI.list({
        select: select || STANDARD_FIELDS.invoice,
        filter,
        order,
        start
      });

      const items = result?.items || [];
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
    name: 'bitrix_invoice_get',
    description: 'Get detailed information about a specific invoice by ID, including product rows.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Invoice ID'
        },
        includeProducts: {
          type: 'boolean',
          description: 'Include product rows (default: true)'
        }
      },
      required: ['id']
    },
    handler: async (params) => {
      const { id, includeProducts = true } = params;

      // Get invoice details
      const invoiceResult = await invoiceAPI.get(id);
      const invoice = invoiceResult.item;

      // Get product rows if requested
      let products = [];
      if (includeProducts) {
        try {
          const productsResult = await invoiceAPI.listProducts(id);
          products = productsResult.productRows || [];
        } catch (error) {
          // Product rows might not exist, that's ok
          products = [];
        }
      }

      return {
        success: true,
        invoice,
        products,
        productCount: products.length
      };
    }
  },

  {
    name: 'bitrix_invoice_search',
    description: 'Search for invoices by title or invoice number.',
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

      const result = await invoiceAPI.list({
        select: ['id', 'title', 'companyId', 'opportunity', 'stageId', 'begindate'],
        filter: { '%title': query },
        order: { id: 'DESC' }
      });

      const items = result?.items || [];
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
    name: 'bitrix_invoice_create',
    description: 'Create a new Smart Invoice in Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Invoice title/number (required)'
        },
        companyId: {
          type: 'number',
          description: 'Company ID (required)'
        },
        contactId: {
          type: 'number',
          description: 'Contact ID'
        },
        opportunity: {
          type: 'number',
          description: 'Invoice amount'
        },
        currencyId: {
          type: 'string',
          description: 'Currency (e.g., "EUR")'
        },
        begindate: {
          type: 'string',
          description: 'Invoice date (YYYY-MM-DD)'
        },
        closedate: {
          type: 'string',
          description: 'Due date (YYYY-MM-DD)'
        },
        stageId: {
          type: 'string',
          description: 'Stage ID'
        },
        mycompanyId: {
          type: 'number',
          description: 'Division ID (1419=Atoma, 1420=Harlock)'
        },
        assignedById: {
          type: 'number',
          description: 'Assigned user ID'
        },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productName: { type: 'string' },
              quantity: { type: 'number' },
              price: { type: 'number' },
              taxRate: { type: 'number' },
              taxIncluded: { type: 'string' }
            }
          },
          description: 'Product rows to add'
        }
      },
      required: ['title', 'companyId']
    },
    handler: async (params) => {
      const { products, ...invoiceFields } = params;

      // Create invoice
      const id = await invoiceAPI.add(invoiceFields);

      // Add product rows if provided
      if (products && products.length > 0) {
        try {
          await invoiceAPI.addProducts(id, products);
        } catch (error) {
          return {
            success: true,
            id,
            message: `Invoice created with ID ${id}, but failed to add products: ${error.message}`,
            warning: 'Products not added'
          };
        }
      }

      return {
        success: true,
        id,
        productsAdded: products?.length || 0,
        message: `Invoice created successfully with ID ${id}`
      };
    }
  },

  {
    name: 'bitrix_invoice_update',
    description: 'Update an existing Smart Invoice in Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Invoice ID (required)'
        },
        title: { type: 'string' },
        opportunity: { type: 'number' },
        stageId: { type: 'string' },
        closedate: { type: 'string' },
        assignedById: { type: 'number' }
      },
      required: ['id']
    },
    handler: async (params) => {
      const { id, ...fields } = params;

      const result = await invoiceAPI.update(id, fields);

      return {
        success: true,
        id,
        updated: result,
        message: `Invoice ${id} updated successfully`
      };
    }
  },

  {
    name: 'bitrix_invoice_delete',
    description: 'Delete a Smart Invoice from Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Invoice ID to delete'
        }
      },
      required: ['id']
    },
    handler: async (params) => {
      const result = await invoiceAPI.delete(params.id);

      return {
        success: true,
        id: params.id,
        deleted: result,
        message: `Invoice ${params.id} deleted successfully`
      };
    }
  },

  {
    name: 'bitrix_invoice_add_products',
    description: 'Add or replace product rows for an invoice.',
    inputSchema: {
      type: 'object',
      properties: {
        invoiceId: {
          type: 'number',
          description: 'Invoice ID (required)'
        },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productName: {
                type: 'string',
                description: 'Product name (required)'
              },
              quantity: {
                type: 'number',
                description: 'Quantity (required)'
              },
              price: {
                type: 'number',
                description: 'Unit price (required)'
              },
              taxRate: {
                type: 'number',
                description: 'Tax rate percentage (e.g., 22 for 22%)'
              },
              taxIncluded: {
                type: 'string',
                description: 'Tax included (Y or N)'
              }
            },
            required: ['productName', 'quantity', 'price']
          },
          description: 'Product rows to add'
        }
      },
      required: ['invoiceId', 'products']
    },
    handler: async (params) => {
      const { invoiceId, products } = params;

      await invoiceAPI.addProducts(invoiceId, products);

      return {
        success: true,
        invoiceId,
        productsAdded: products.length,
        message: `Added ${products.length} product(s) to invoice ${invoiceId}`
      };
    }
  }
];
