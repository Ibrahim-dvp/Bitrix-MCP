/**
 * Field Discovery Tools
 * Get field schemas for different entity types
 */

import { companyAPI, contactAPI, leadAPI, dealAPI, invoiceAPI } from '../bitrix-api.js';

export const fieldsTools = [
  {
    name: 'bitrix_fields_get',
    description: 'Get field schema for a Bitrix24 entity type. Returns all available fields including custom fields (UF_*).',
    inputSchema: {
      type: 'object',
      properties: {
        entityType: {
          type: 'string',
          enum: ['company', 'contact', 'lead', 'deal', 'invoice'],
          description: 'Entity type to get fields for'
        }
      },
      required: ['entityType']
    },
    handler: async (params) => {
      const { entityType } = params;

      let fields;
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
          const result = await invoiceAPI.fields();
          fields = result.fields;
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }

      // Extract custom fields
      const customFields = {};
      const standardFields = {};

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
        customFields
      };
    }
  }
];
