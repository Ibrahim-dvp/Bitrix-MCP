/**
 * Bitrix24 REST API Client
 */

import fetch from 'node-fetch';
import { config, getWebhookUrl, ENTITY_TYPES } from '../config/index.js';
import type { BitrixListParams, BitrixResponse } from '../types/index.js';

export class BitrixAPIError extends Error {
  constructor(
    message: string,
    public details: Record<string, any> = {}
  ) {
    super(message);
    this.name = 'BitrixAPIError';
  }
}

/**
 * Call Bitrix24 REST API method
 */
export async function callBitrixAPI<T = any>(
  method: string,
  params: Record<string, any> = {}
): Promise<T> {
  const url = getWebhookUrl(method);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = (await response.json()) as BitrixResponse<T>;

    if (data.error) {
      throw new BitrixAPIError(data.error_description || data.error, {
        code: data.error,
        method,
        params,
      });
    }

    return data.result as T;
  } catch (error) {
    if (error instanceof BitrixAPIError) {
      throw error;
    }

    throw new BitrixAPIError(`Network error calling ${method}: ${(error as Error).message}`, {
      originalError: error,
      method,
      params,
    });
  }
}

/**
 * Handle paginated list requests
 */
export async function fetchAllPages<T = any>(
  method: string,
  params: BitrixListParams = {},
  limit = 0
): Promise<T[]> {
  const allResults: T[] = [];
  let start = 0;
  let hasMore = true;

  while (hasMore) {
    const pageParams = {
      ...params,
      start,
    };

    const result = await callBitrixAPI<any>(method, pageParams);

    let items: T[] = [];
    if (Array.isArray(result)) {
      items = result;
      hasMore = items.length === config.defaultPageSize;
    } else if (result.items) {
      items = result.items;
      hasMore = result.next !== undefined;
    } else {
      items = [result];
      hasMore = false;
    }

    allResults.push(...items);

    if (limit > 0 && allResults.length >= limit) {
      return allResults.slice(0, limit);
    }

    if (!hasMore) {
      break;
    }

    start += config.defaultPageSize;

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  return allResults;
}

/**
 * Company API
 */
export const companyAPI = {
  list: (params: BitrixListParams = {}) => callBitrixAPI('crm.company.list', params),
  get: (id: number) => callBitrixAPI('crm.company.get', { id }),
  add: (fields: Record<string, any>) => callBitrixAPI('crm.company.add', { fields }),
  update: (id: number, fields: Record<string, any>) =>
    callBitrixAPI('crm.company.update', { id, fields }),
  delete: (id: number) => callBitrixAPI('crm.company.delete', { id }),
  fields: () => callBitrixAPI('crm.company.fields'),
};

/**
 * Contact API
 */
export const contactAPI = {
  list: (params: BitrixListParams = {}) => callBitrixAPI('crm.contact.list', params),
  get: (id: number) => callBitrixAPI('crm.contact.get', { id }),
  add: (fields: Record<string, any>) => callBitrixAPI('crm.contact.add', { fields }),
  update: (id: number, fields: Record<string, any>) =>
    callBitrixAPI('crm.contact.update', { id, fields }),
  delete: (id: number) => callBitrixAPI('crm.contact.delete', { id }),
  fields: () => callBitrixAPI('crm.contact.fields'),
};

/**
 * Lead API
 */
export const leadAPI = {
  list: (params: BitrixListParams = {}) => callBitrixAPI('crm.lead.list', params),
  get: (id: number) => callBitrixAPI('crm.lead.get', { id }),
  add: (fields: Record<string, any>) => callBitrixAPI('crm.lead.add', { fields }),
  update: (id: number, fields: Record<string, any>) =>
    callBitrixAPI('crm.lead.update', { id, fields }),
  delete: (id: number) => callBitrixAPI('crm.lead.delete', { id }),
  fields: () => callBitrixAPI('crm.lead.fields'),
};

/**
 * Deal API
 */
export const dealAPI = {
  list: (params: BitrixListParams = {}) => callBitrixAPI('crm.deal.list', params),
  get: (id: number) => callBitrixAPI('crm.deal.get', { id }),
  add: (fields: Record<string, any>) => callBitrixAPI('crm.deal.add', { fields }),
  update: (id: number, fields: Record<string, any>) =>
    callBitrixAPI('crm.deal.update', { id, fields }),
  delete: (id: number) => callBitrixAPI('crm.deal.delete', { id }),
  fields: () => callBitrixAPI('crm.deal.fields'),
};

/**
 * Invoice (Smart Invoice) API
 */
export const invoiceAPI = {
  list: (params: BitrixListParams = {}) =>
    callBitrixAPI('crm.item.list', {
      entityTypeId: ENTITY_TYPES.SMART_INVOICE,
      ...params,
    }),
  get: (id: number) =>
    callBitrixAPI('crm.item.get', {
      entityTypeId: ENTITY_TYPES.SMART_INVOICE,
      id,
    }),
  add: (fields: Record<string, any>) =>
    callBitrixAPI('crm.item.add', {
      entityTypeId: ENTITY_TYPES.SMART_INVOICE,
      fields,
    }),
  update: (id: number, fields: Record<string, any>) =>
    callBitrixAPI('crm.item.update', {
      entityTypeId: ENTITY_TYPES.SMART_INVOICE,
      id,
      fields,
    }),
  delete: (id: number) =>
    callBitrixAPI('crm.item.delete', {
      entityTypeId: ENTITY_TYPES.SMART_INVOICE,
      id,
    }),
  fields: () =>
    callBitrixAPI('crm.item.fields', {
      entityTypeId: ENTITY_TYPES.SMART_INVOICE,
    }),
  listProducts: (invoiceId: number) =>
    callBitrixAPI('crm.item.productrow.list', {
      filter: {
        '=ownerId': invoiceId,
        '=ownerType': 'SI',
      },
    }),
  addProducts: (invoiceId: number, rows: any[]) =>
    callBitrixAPI('crm.item.productrow.set', {
      ownerId: invoiceId,
      ownerType: 'SI',
      productRows: rows,
    }),
};
