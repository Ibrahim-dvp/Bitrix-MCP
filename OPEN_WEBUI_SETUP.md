# Open WebUI Configuration Guide

## ✅ MCP Server Ready

**Railway URL:** `https://bitrix-mcp-production.up.railway.app`

**Protocol:** MCP Streamable HTTP v1 (Official Standard)

**MCP v1 Endpoints:**
- Initialize: `POST /mcp/v1/initialize`
- List Tools: `POST /mcp/v1/tools/list`
- Call Tool: `POST /mcp/v1/tools/call`
- SSE Stream: `GET /mcp/sse`

## Step-by-Step Setup in Open WebUI v0.6.31+

### Official MCP Integration (Recommended)

1. **Open Open WebUI** in your browser
2. Go to **Admin Settings** (or **Settings** if admin)
3. Navigate to **External Tools** section
4. Click **"+ Add Server"**
5. Configure as follows:

**Required Settings:**
- **Type:** `MCP (Streamable HTTP)` ⚠️ Important: Must select this type!
- **Server URL:** `https://bitrix-mcp-production.up.railway.app`
- **Authentication:** None (or leave empty)
- **Name:** Bitrix24 CRM (optional, for display)

6. Click **Save** or **Add**

7. Open WebUI will automatically:
   - Call `/mcp/v1/initialize` to establish connection
   - Call `/mcp/v1/tools/list` to discover all 32 tools
   - Make tools available to the AI

### Verification

After adding the server, Open WebUI should show:
- ✅ Connection: Active/Connected
- ✅ Tools Available: 32
- ✅ Status: Online

If you see errors, check:
1. Railway deployment is online (green status)
2. Server URL is exactly: `https://bitrix-mcp-production.up.railway.app`
3. Type is set to **"MCP (Streamable HTTP)"** not generic HTTP

## Testing the Integration

Once configured, you should be able to:

1. **Ask the AI to list Bitrix tools:**
   - "Show me available Bitrix24 tools"
   - "List CRM functions"

2. **Search for companies:**
   - "Search for company named Atoma in Bitrix"
   - "Find companies matching XYZ"

3. **Search for contacts:**
   - "Find contact Barbara in Bitrix CRM"
   - "Search for contacts with email @example.com"

4. **List records:**
   - "List the latest 10 companies"
   - "Show me recent invoices"

5. **Get details:**
   - "Get details for company ID 123"
   - "Show invoice 456"

## Available Tools (32 Total)

### Companies (6 tools)
- `bitrix_company_list` - List companies with filters
- `bitrix_company_get` - Get company by ID
- `bitrix_company_search` - Search companies by name
- `bitrix_company_create` - Create new company
- `bitrix_company_update` - Update company
- `bitrix_company_delete` - Delete company

### Contacts (6 tools)
- `bitrix_contact_list`
- `bitrix_contact_get`
- `bitrix_contact_search`
- `bitrix_contact_create`
- `bitrix_contact_update`
- `bitrix_contact_delete`

### Leads (6 tools)
- `bitrix_lead_list`
- `bitrix_lead_get`
- `bitrix_lead_search`
- `bitrix_lead_create`
- `bitrix_lead_update`
- `bitrix_lead_delete`

### Deals (6 tools)
- `bitrix_deal_list`
- `bitrix_deal_get`
- `bitrix_deal_search`
- `bitrix_deal_create`
- `bitrix_deal_update`
- `bitrix_deal_delete`

### Invoices (7 tools)
- `bitrix_invoice_list`
- `bitrix_invoice_get`
- `bitrix_invoice_search`
- `bitrix_invoice_create`
- `bitrix_invoice_update`
- `bitrix_invoice_delete`
- `bitrix_invoice_add_products`

### Field Discovery (1 tool)
- `bitrix_fields_get` - Discover available fields for any entity

## Troubleshooting

### If tools don't appear:

1. **Check Server Status:**
   ```bash
   curl https://bitrix-mcp-production.up.railway.app/health
   ```
   Should return: `{"status":"ok","tools":32}`

2. **Verify Tools List:**
   ```bash
   curl https://bitrix-mcp-production.up.railway.app/mcp/tools
   ```
   Should return JSON with 32 tools

3. **Check CORS Settings:**
   - Your server has `ALLOWED_ORIGINS=*` so CORS should work
   - If issues persist, check Open WebUI console for errors

### If requests fail:

1. Check Railway deployment is still online (green status)
2. Verify environment variables are still set
3. Check Railway logs for errors

## Example Prompts to Try

Once configured, try asking the AI:

- "Search for a company called Atoma in Bitrix"
- "List the 5 most recent invoices"
- "Find contact named Barbara"
- "Create a new company called Test Corp"
- "What fields are available for companies?"
- "Get details for company ID 123"
- "Show me all deals in progress"

## Notes

- All 32 tools are available immediately after configuration
- No authentication required (using webhook tokens in server)
- Supports Italian tax fields (VAT, PEC, SDI, Tax Code)
- Rate limiting handled automatically by the server
- CORS enabled for web access

---

**Server URL:** https://bitrix-mcp-production.up.railway.app

**Status:** Online and Ready
