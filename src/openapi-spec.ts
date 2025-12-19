/**
 * OpenAPI 3.0 Specification for Bitrix24 MCP Server
 */

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Bitrix24 MCP Server',
    version: '1.0.0',
    description: 'REST API for Bitrix24 CRM operations - Companies, Contacts, Leads, Deals, and Invoices',
  },
  servers: [
    {
      url: 'https://bitrix-mcp-production.up.railway.app',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  paths: {
    '/api/company/search': {
      post: {
        summary: 'Search companies by name',
        operationId: 'searchCompanies',
        tags: ['Companies'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  query: { type: 'string', description: 'Search query' },
                  limit: { type: 'number', default: 10 },
                },
                required: ['query'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    items: { type: 'array' },
                    count: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/company/list': {
      post: {
        summary: 'List companies',
        operationId: 'listCompanies',
        tags: ['Companies'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  limit: { type: 'number', default: 50 },
                  filter: { type: 'object' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Success' },
        },
      },
    },
    '/api/company/{id}': {
      get: {
        summary: 'Get company by ID',
        operationId: 'getCompany',
        tags: ['Companies'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'number' },
          },
        ],
        responses: {
          '200': { description: 'Success' },
        },
      },
    },
    '/api/contact/search': {
      post: {
        summary: 'Search contacts',
        operationId: 'searchContacts',
        tags: ['Contacts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  query: { type: 'string' },
                  limit: { type: 'number', default: 10 },
                },
                required: ['query'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Success' },
        },
      },
    },
    '/api/contact/list': {
      post: {
        summary: 'List contacts',
        operationId: 'listContacts',
        tags: ['Contacts'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  limit: { type: 'number', default: 50 },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Success' },
        },
      },
    },
    '/api/lead/search': {
      post: {
        summary: 'Search leads',
        operationId: 'searchLeads',
        tags: ['Leads'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  query: { type: 'string' },
                  limit: { type: 'number', default: 10 },
                },
                required: ['query'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Success' },
        },
      },
    },
    '/api/deal/search': {
      post: {
        summary: 'Search deals',
        operationId: 'searchDeals',
        tags: ['Deals'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  query: { type: 'string' },
                  limit: { type: 'number', default: 10 },
                },
                required: ['query'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Success' },
        },
      },
    },
    '/api/invoice/search': {
      post: {
        summary: 'Search invoices',
        operationId: 'searchInvoices',
        tags: ['Invoices'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  query: { type: 'string' },
                  limit: { type: 'number', default: 10 },
                },
                required: ['query'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Success' },
        },
      },
    },
  },
  tags: [
    { name: 'Companies', description: 'Company operations' },
    { name: 'Contacts', description: 'Contact operations' },
    { name: 'Leads', description: 'Lead operations' },
    { name: 'Deals', description: 'Deal operations' },
    { name: 'Invoices', description: 'Invoice operations' },
  ],
};
