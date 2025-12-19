/**
 * Export all tools
 */

import { companyTools } from './company.js';
import { contactTools } from './contact.js';
import { leadTools } from './lead.js';
import { dealTools } from './deal.js';
import { invoiceTools } from './invoice.js';
import { fieldsTools } from './fields.js';
import type { ToolDefinition } from '../types/index.js';

export const allTools: ToolDefinition[] = [
  ...companyTools,
  ...contactTools,
  ...leadTools,
  ...dealTools,
  ...invoiceTools,
  ...fieldsTools,
];

export { companyTools, contactTools, leadTools, dealTools, invoiceTools, fieldsTools };
