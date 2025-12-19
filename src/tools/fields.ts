import { companyAPI, contactAPI, leadAPI, dealAPI, invoiceAPI } from '../lib/bitrix-api.js';
import type { ToolDefinition } from '../types/index.js';

export const fieldsTools: ToolDefinition[] = [
  {
    name: 'bitrix_fields_get',
    description: 'Get field schema for a Bitrix24 entity type.',
    inputSchema: {
      type: 'object',
      properties: {
        entityType: {
          type: 'string',
          enum: ['company', 'contact', 'lead', 'deal', 'invoice'],
        },
      },
      required: ['entityType'],
    },
    handler: async (params) => {
      const { entityType } = params;
      let fields: any;
      switch (entityType) {
        case 'company':
          fields = await companyAPI.fields();
          break;
        case 'contact':
          fields = await contactAPI.fields();
          break;
        case 'lead':
          fields = await leadAPI.fields();
          break;
        case 'deal':
          fields = await dealAPI.fields();
          break;
        case 'invoice':
          const r = await invoiceAPI.fields();
          fields = r.fields;
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
      const customFields: Record<string, any> = {};
      const standardFields: Record<string, any> = {};
      for (const [key, value] of Object.entries(fields)) {
        if (key.startsWith('UF_') || key.startsWith('ufCrm_')) {
          customFields[key] = value;
        } else {
          standardFields[key] = value;
        }
      }
      return {
        success: true,
        entityType,
        totalFields: Object.keys(fields).length,
        standardFieldsCount: Object.keys(standardFields).length,
        customFieldsCount: Object.keys(customFields).length,
        standardFields,
        customFields,
      };
    },
  },
];
