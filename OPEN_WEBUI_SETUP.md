# Open WebUI Configuration Guide

## Your MCP Server Details

**Railway URL:** `https://bitrix-mcp-production.up.railway.app`

**Available Endpoints:**
- Health Check: `/health`
- List Tools: `/mcp/tools`
- Execute Tool: `/mcp/tools/{tool_name}`

## Step-by-Step Setup in Open WebUI

### Method 1: Function/Tool Configuration (Recommended)

1. **Open Open WebUI** in your browser
2. Go to **Settings** (gear icon) or **Admin Panel**
3. Look for **"Functions"**, **"Tools"**, or **"External Tools"** section
4. Click **"Add Function"** or **"Add Tool"**
5. Configure as follows:

**Configuration:**
```json
{
  "name": "Bitrix24 CRM",
  "type": "http",
  "url": "https://bitrix-mcp-production.up.railway.app",
  "endpoints": {
    "list": "/mcp/tools",
    "execute": "/mcp/tools/"
  }
}
```

### Method 2: OpenAPI/MCP Integration

If Open WebUI has MCP support:

1. Go to **Settings** → **MCP Servers** or **Integrations**
2. Click **"Add MCP Server"**
3. Enter:
   - **Name:** Bitrix24 CRM
   - **URL:** `https://bitrix-mcp-production.up.railway.app`
   - **Type:** HTTP/SSE
   - **Transport:** HTTP

### Method 3: Manual API Configuration

If Open WebUI allows custom API endpoints:

```yaml
Name: Bitrix24 CRM Tools
Base URL: https://bitrix-mcp-production.up.railway.app
Authentication: None
Endpoints:
  - GET /mcp/tools (list available tools)
  - POST /mcp/tools/{tool_name} (execute tool)
```

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
