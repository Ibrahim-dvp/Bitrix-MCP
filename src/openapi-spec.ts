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
    // ==================== COMPANIES ====================
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
          '200': { description: 'Success' },
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
      delete: {
        summary: 'Delete company by ID',
        operationId: 'deleteCompany',
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
    '/api/company': {
      post: {
        summary: 'Create new company',
        operationId: 'createCompany',
        tags: ['Companies'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', description: 'Company name' },
                  company_type: { type: 'string', description: 'CUSTOMER, SUPPLIER, etc.' },
                  phone: { type: 'string' },
                  email: { type: 'string' },
                  web: { type: 'string' },
                  vat: { type: 'string', description: 'VAT number (Partita IVA)' },
                  tax_code: { type: 'string', description: 'Tax code (Codice Fiscale)' },
                  pec: { type: 'string', description: 'PEC email' },
                  sdi: { type: 'string', description: 'SDI code' },
                },
                required: ['title'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Success' },
        },
      },
      put: {
        summary: 'Update company',
        operationId: 'updateCompany',
        tags: ['Companies'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string' },
                  vat: { type: 'string' },
                },
                required: ['id'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Success' },
        },
      },
    },

    // ==================== CONTACTS ====================
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
    '/api/contact/{id}': {
      get: {
        summary: 'Get contact by ID',
        operationId: 'getContact',
        tags: ['Contacts'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'number' } },
        ],
        responses: {
          '200': { description: 'Success' },
        },
      },
      delete: {
        summary: 'Delete contact',
        operationId: 'deleteContact',
        tags: ['Contacts'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'number' } },
        ],
        responses: {
          '200': { description: 'Success' },
        },
      },
    },
    '/api/contact': {
      post: {
        summary: 'Create new contact',
        operationId: 'createContact',
        tags: ['Contacts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  last_name: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string' },
                  company_id: { type: 'number' },
                },
                required: ['name'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Success' },
        },
      },
      put: {
        summary: 'Update contact',
        operationId: 'updateContact',
        tags: ['Contacts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  last_name: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string' },
                },
                required: ['id'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Success' },
        },
      },
    },

    // ==================== LEADS ====================
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
    '/api/lead/list': {
      post: {
        summary: 'List leads',
        operationId: 'listLeads',
        tags: ['Leads'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { limit: { type: 'number', default: 50 } },
              },
            },
          },
        },
        responses: { '200': { description: 'Success' } },
      },
    },
    '/api/lead/{id}': {
      get: {
        summary: 'Get lead by ID',
        operationId: 'getLead',
        tags: ['Leads'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
        responses: { '200': { description: 'Success' } },
      },
      delete: {
        summary: 'Delete lead',
        operationId: 'deleteLead',
        tags: ['Leads'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
        responses: { '200': { description: 'Success' } },
      },
    },
    '/api/lead': {
      post: {
        summary: 'Create new lead',
        operationId: 'createLead',
        tags: ['Leads'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  name: { type: 'string' },
                  last_name: { type: 'string' },
                  company_title: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string' },
                },
                required: ['title'],
              },
            },
          },
        },
        responses: { '200': { description: 'Success' } },
      },
      put: {
        summary: 'Update lead',
        operationId: 'updateLead',
        tags: ['Leads'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  status_id: { type: 'string' },
                },
                required: ['id'],
              },
            },
          },
        },
        responses: { '200': { description: 'Success' } },
      },
    },

    // ==================== DEALS ====================
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
        responses: { '200': { description: 'Success' } },
      },
    },
    '/api/deal/list': {
      post: {
        summary: 'List deals',
        operationId: 'listDeals',
        tags: ['Deals'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { limit: { type: 'number', default: 50 } },
              },
            },
          },
        },
        responses: { '200': { description: 'Success' } },
      },
    },
    '/api/deal/{id}': {
      get: {
        summary: 'Get deal by ID',
        operationId: 'getDeal',
        tags: ['Deals'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
        responses: { '200': { description: 'Success' } },
      },
      delete: {
        summary: 'Delete deal',
        operationId: 'deleteDeal',
        tags: ['Deals'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
        responses: { '200': { description: 'Success' } },
      },
    },
    '/api/deal': {
      post: {
        summary: 'Create new deal',
        operationId: 'createDeal',
        tags: ['Deals'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  company_id: { type: 'number' },
                  contact_id: { type: 'number' },
                  opportunity: { type: 'number' },
                },
                required: ['title'],
              },
            },
          },
        },
        responses: { '200': { description: 'Success' } },
      },
      put: {
        summary: 'Update deal',
        operationId: 'updateDeal',
        tags: ['Deals'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  stage_id: { type: 'string' },
                  opportunity: { type: 'number' },
                },
                required: ['id'],
              },
            },
          },
        },
        responses: { '200': { description: 'Success' } },
      },
    },

    // ==================== INVOICES ====================
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
        responses: { '200': { description: 'Success' } },
      },
    },
    '/api/invoice/list': {
      post: {
        summary: 'List invoices',
        operationId: 'listInvoices',
        tags: ['Invoices'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { limit: { type: 'number', default: 50 } },
              },
            },
          },
        },
        responses: { '200': { description: 'Success' } },
      },
    },
    '/api/invoice/{id}': {
      get: {
        summary: 'Get invoice by ID',
        operationId: 'getInvoice',
        tags: ['Invoices'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
        responses: { '200': { description: 'Success' } },
      },
      delete: {
        summary: 'Delete invoice',
        operationId: 'deleteInvoice',
        tags: ['Invoices'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
        responses: { '200': { description: 'Success' } },
      },
    },
    '/api/invoice': {
      post: {
        summary: 'Create new invoice',
        operationId: 'createInvoice',
        tags: ['Invoices'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  company_id: { type: 'number' },
                  contact_id: { type: 'number' },
                  opportunity: { type: 'number' },
                },
                required: ['title'],
              },
            },
          },
        },
        responses: { '200': { description: 'Success' } },
      },
      put: {
        summary: 'Update invoice',
        operationId: 'updateInvoice',
        tags: ['Invoices'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  opportunity: { type: 'number' },
                },
                required: ['id'],
              },
            },
          },
        },
        responses: { '200': { description: 'Success' } },
      },
    },
    '/api/invoice/{id}/products': {
      post: {
        summary: 'Add products to invoice',
        operationId: 'addInvoiceProducts',
        tags: ['Invoices'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  products: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        product_name: { type: 'string' },
                        price: { type: 'number' },
                        quantity: { type: 'number' },
                      },
                    },
                  },
                },
                required: ['products'],
              },
            },
          },
        },
        responses: { '200': { description: 'Success' } },
      },
    },

    // ==================== FIELDS ====================
    '/api/fields/{entity}': {
      get: {
        summary: 'Get available fields for entity',
        operationId: 'getFields',
        tags: ['Fields'],
        parameters: [
          {
            name: 'entity',
            in: 'path',
            required: true,
            schema: { type: 'string', enum: ['company', 'contact', 'lead', 'deal', 'invoice'] },
          },
        ],
        responses: { '200': { description: 'Success' } },
      },
    },
  },
  tags: [
    { name: 'Companies', description: 'Company CRUD operations' },
    { name: 'Contacts', description: 'Contact CRUD operations' },
    { name: 'Leads', description: 'Lead CRUD operations' },
    { name: 'Deals', description: 'Deal CRUD operations' },
    { name: 'Invoices', description: 'Invoice CRUD operations + add products' },
    { name: 'Fields', description: 'Field discovery for entities' },
  ],
};
