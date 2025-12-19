import { invoiceAPI } from '../lib/bitrix-api.js';
import type { ToolDefinition } from '../types/index.js';

const FIELDS = ['id', 'title', 'companyId', 'opportunity', 'stageId'];

export const invoiceTools: ToolDefinition[] = [
  {
    name: 'bitrix_invoice_list',
    description: 'List Smart Invoices from Bitrix24 CRM.',
    inputSchema: {
      type: 'object',
      properties: {
        select: { type: 'array', items: { type: 'string' } },
        filter: { type: 'object' },
        order: { type: 'object' },
        start: { type: 'number' },
        limit: { type: 'number' },
      },
    },
    handler: async (params) => {
      const { select, filter = {}, order = { id: 'DESC' }, start = 0, limit = 50 } = params;
      const result = await invoiceAPI.list({ select: select || FIELDS, filter, order, start });
      const items = result?.items || [];
      return {
        success: true,
        total: result.total || items.length,
        items: items.slice(0, limit),
        count: items.slice(0, limit).length,
      };
    },
  },
  {
    name: 'bitrix_invoice_get',
    description: 'Get invoice by ID with product rows.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        includeProducts: { type: 'boolean' },
      },
      required: ['id'],
    },
    handler: async (params) => {
      const { id, includeProducts = true } = params;
      const invoiceResult = await invoiceAPI.get(id);
      const invoice = invoiceResult.item;
      let products: any[] = [];
      if (includeProducts) {
        try {
          const pr = await invoiceAPI.listProducts(id);
          products = pr.productRows || [];
        } catch (e) {
          // Ignore if no products
        }
      }
      return {
        success: true,
        invoice,
        products,
        productCount: products.length,
      };
    },
  },
  {
    name: 'bitrix_invoice_search',
    description: 'Search invoices by title.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number' },
      },
      required: ['query'],
    },
    handler: async (params) => {
      const { query, limit = 10 } = params;
      const result = await invoiceAPI.list({
        select: FIELDS,
        filter: { '%title': query },
        order: { id: 'DESC' },
      });
      const items = result?.items || [];
      return {
        success: true,
        query,
        items: items.slice(0, limit),
        count: items.slice(0, limit).length,
      };
    },
  },
  {
    name: 'bitrix_invoice_create',
    description: 'Create a new Smart Invoice.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        companyId: { type: 'number' },
        opportunity: { type: 'number' },
        products: { type: 'array' },
      },
      required: ['title', 'companyId'],
    },
    handler: async (params) => {
      const { products, ...fields } = params;
      const id = await invoiceAPI.add(fields);
      if (products && products.length > 0) {
        try {
          await invoiceAPI.addProducts(id, products);
        } catch (e) {
          // Ignore product errors
        }
      }
      return {
        success: true,
        id,
        productsAdded: products?.length || 0,
        message: `Invoice created with ID ${id}`,
      };
    },
  },
  {
    name: 'bitrix_invoice_update',
    description: 'Update an invoice.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        opportunity: { type: 'number' },
      },
      required: ['id'],
    },
    handler: async (params) => {
      const { id, ...fields } = params;
      await invoiceAPI.update(id, fields);
      return {
        success: true,
        id,
        message: `Invoice ${id} updated`,
      };
    },
  },
  {
    name: 'bitrix_invoice_delete',
    description: 'Delete an invoice.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
      required: ['id'],
    },
    handler: async (params) => {
      await invoiceAPI.delete(params.id);
      return {
        success: true,
        id: params.id,
        message: `Invoice ${params.id} deleted`,
      };
    },
  },
  {
    name: 'bitrix_invoice_add_products',
    description: 'Add product rows to invoice.',
    inputSchema: {
      type: 'object',
      properties: {
        invoiceId: { type: 'number' },
        products: { type: 'array' },
      },
      required: ['invoiceId', 'products'],
    },
    handler: async (params) => {
      const { invoiceId, products } = params;
      await invoiceAPI.addProducts(invoiceId, products);
      return {
        success: true,
        invoiceId,
        productsAdded: products.length,
        message: `Added ${products.length} products to invoice ${invoiceId}`,
      };
    },
  },
];
