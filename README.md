# Bitrix24 MCP Server

Production-ready Model Context Protocol (MCP) server for Bitrix24 CRM with HTTP/SSE transport for **Open WebUI** compatibility.

## Features

- ✅ **32 MCP Tools** for complete CRM operations
- ✅ **HTTP/SSE Transport** (Open WebUI compatible)
- ✅ **TypeScript** for type safety
- ✅ **Railway deployment** ready
- ✅ **REST API** with Express
- ✅ **Error handling** with detailed responses
- ✅ **Rate limiting** for Bitrix24 API
- ✅ **Custom field mapping** (Italian tax system support)

## Available Tools

### Companies (6 tools)
- `bitrix_company_list` - List companies
- `bitrix_company_get` - Get company by ID
- `bitrix_company_search` - Search by name
- `bitrix_company_create` - Create company
- `bitrix_company_update` - Update company
- `bitrix_company_delete` - Delete company

### Contacts (6 tools)
- `bitrix_contact_list/get/search/create/update/delete`

### Leads (6 tools)
- `bitrix_lead_list/get/search/create/update/delete`

### Deals (6 tools)
- `bitrix_deal_list/get/search/create/update/delete`

### Invoices (7 tools)
- `bitrix_invoice_list/get/search/create/update/delete`
- `bitrix_invoice_add_products` - Add product rows

### Field Discovery (1 tool)
- `bitrix_fields_get` - Get entity field schemas

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Configuration

Create `.env` file (or copy from `.env.example`):

```env
BITRIX_BASE_URL=https://your-domain.bitrix24.com/rest/USER_ID
BITRIX_TOKEN=your_webhook_token
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=*
```

### 3. Development

```bash
npm run dev
```

### 4. Build

```bash
npm run build
```

### 5. Production

```bash
npm start
```

### 6. Test API Connectivity

```bash
npm test
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API documentation |
| `/health` | GET | Health check |
| `/mcp/tools` | GET | List all available tools |
| `/mcp/tools/:toolName` | POST | Execute a tool |
| `/mcp/sse` | GET | SSE stream for Open WebUI |

## Usage Examples

### List Tools

```bash
curl http://localhost:3000/mcp/tools
```

### Search Company

```bash
curl -X POST http://localhost:3000/mcp/tools/bitrix_company_search \
  -H "Content-Type: application/json" \
  -d '{"query": "Acme"}'
```

### Create Invoice

```bash
curl -X POST http://localhost:3000/mcp/tools/bitrix_invoice_create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "FT-2025-001",
    "companyId": 123,
    "opportunity": 1000,
    "products": [
      {"productName": "Service", "quantity": 1, "price": 1000}
    ]
  }'
```

## Open WebUI Integration

Add to Open WebUI Tools configuration:

```json
{
  "name": "Bitrix24 CRM",
  "url": "https://your-railway-url.up.railway.app",
  "type": "mcp",
  "endpoints": {
    "tools": "/mcp/tools",
    "execute": "/mcp/tools",
    "sse": "/mcp/sse"
  }
}
```

## Railway Deployment

### Option 1: Deploy from GitHub

1. Push code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Add environment variables:
   - `BITRIX_BASE_URL`
   - `BITRIX_TOKEN`
   - `PORT` (Railway provides this)
6. Deploy!

### Option 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables set BITRIX_BASE_URL=https://...
railway variables set BITRIX_TOKEN=...

# Deploy
railway up
```

Your server will be available at: `https://[your-project].up.railway.app`

## Project Structure

```
bitrix-mcp-server-railway/
├── src/
│   ├── config/           # Configuration management
│   │   └── index.ts      # Config & constants
│   ├── lib/              # Core libraries
│   │   └── bitrix-api.ts # Bitrix24 API client
│   ├── tools/            # MCP tools
│   │   ├── company.ts    # Company CRUD
│   │   ├── contact.ts    # Contact CRUD
│   │   ├── lead.ts       # Lead CRUD
│   │   ├── deal.ts       # Deal CRUD
│   │   ├── invoice.ts    # Invoice CRUD
│   │   ├── fields.ts     # Field discovery
│   │   └── index.ts      # Tool exports
│   ├── types/            # TypeScript types
│   │   └── index.ts      # Type definitions
│   ├── server.ts         # HTTP/SSE server
│   ├── index.ts          # Entry point
│   └── test.ts           # Connectivity test
├── dist/                 # Compiled JavaScript
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
├── tsconfig.json        # TypeScript config
├── package.json         # Dependencies
├── Procfile             # Railway process config
├── railway.json         # Railway deployment config
└── README.md            # This file
```

## Custom Fields

This server includes mappings for Italian tax system fields:

- `vat_number` → `UF_CRM_1708520927917` (Partita IVA)
- `tax_code` → `UF_CRM_1708520972166` (Codice Fiscale)
- `pec` → `UF_CRM_1708521855072` (PEC Email)
- `sdi_code` → `UF_CRM_1708523044307` (SDI Code)

## Error Handling

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

## Development

### TypeScript Compilation

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Type Checking

```bash
tsc --noEmit
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `BITRIX_BASE_URL` | Bitrix24 webhook URL | Yes | - |
| `BITRIX_TOKEN` | Webhook token | Yes | - |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment | No | development |
| `ALLOWED_ORIGINS` | CORS origins | No | * |

## License

MIT

## Support

For issues and feature requests, please create an issue in the GitHub repository.
