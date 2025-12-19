/**
 * MCP Streamable HTTP Server for Open WebUI
 * Implements official MCP protocol v1
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { serverConfig } from './config/index.js';
import { allTools } from './tools/index.js';
import { BitrixAPIError } from './lib/bitrix-api.js';
import { openApiSpec } from './openapi-spec.js';

const app = express();

// Middleware
app.use(cors({
  origin: serverConfig.allowedOrigins.includes('*') ? '*' : serverConfig.allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'bitrix-mcp-server',
    version: '1.0.0',
    protocol: 'MCP Streamable HTTP',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// MCP PROTOCOL V1 ENDPOINTS (Official Standard)
// ============================================================================

// MCP v1: Initialize
app.post('/mcp/v1/initialize', (req: Request, res: Response) => {
  res.json({
    jsonrpc: '2.0',
    id: req.body.id || 1,
    result: {
      protocolVersion: '2024-11-05',
      serverInfo: {
        name: 'bitrix-mcp-server',
        version: '1.0.0',
      },
      capabilities: {
        tools: {
          listChanged: false,
        },
      },
    },
  });
});

// MCP v1: List Tools
app.post('/mcp/v1/tools/list', (req: Request, res: Response) => {
  const tools = allTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));

  res.json({
    jsonrpc: '2.0',
    id: req.body.id || 1,
    result: {
      tools,
    },
  });
});

// MCP v1: Call Tool
app.post('/mcp/v1/tools/call', async (req: Request, res: Response) => {
  const { name: toolName, arguments: args } = req.body.params || {};
  const requestId = req.body.id || 1;

  try {
    const tool = allTools.find((t) => t.name === toolName);

    if (!tool) {
      return res.json({
        jsonrpc: '2.0',
        id: requestId,
        error: {
          code: -32602,
          message: `Tool not found: ${toolName}`,
        },
      });
    }

    const result = await tool.handler(args || {});

    return res.json({
      jsonrpc: '2.0',
      id: requestId,
      result: {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      },
    });
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);

    let errorMessage = (error as Error).message;
    let errorDetails = {};

    if (error instanceof BitrixAPIError) {
      errorDetails = error.details;
    }

    return res.json({
      jsonrpc: '2.0',
      id: requestId,
      error: {
        code: -32603,
        message: errorMessage,
        data: errorDetails,
      },
    });
  }
});

// ============================================================================
// OPENAPI ENDPOINTS (For Open WebUI OpenAPI integration)
// ============================================================================

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// OpenAPI JSON spec
app.get('/openapi.json', (_req: Request, res: Response) => {
  res.json(openApiSpec);
});

// REST API endpoints that map to MCP tools
app.post('/api/company/search', async (req: Request, res: Response) => {
  const tool = allTools.find((t) => t.name === 'bitrix_company_search');
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  try {
    const result = await tool.handler(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/company/list', async (req: Request, res: Response) => {
  const tool = allTools.find((t) => t.name === 'bitrix_company_list');
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  try {
    const result = await tool.handler(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/company/:id', async (req: Request, res: Response) => {
  const tool = allTools.find((t) => t.name === 'bitrix_company_get');
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  try {
    const result = await tool.handler({ id: parseInt(req.params.id) });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/contact/search', async (req: Request, res: Response) => {
  const tool = allTools.find((t) => t.name === 'bitrix_contact_search');
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  try {
    const result = await tool.handler(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/contact/list', async (req: Request, res: Response) => {
  const tool = allTools.find((t) => t.name === 'bitrix_contact_list');
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  try {
    const result = await tool.handler(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/lead/search', async (req: Request, res: Response) => {
  const tool = allTools.find((t) => t.name === 'bitrix_lead_search');
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  try {
    const result = await tool.handler(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/deal/search', async (req: Request, res: Response) => {
  const tool = allTools.find((t) => t.name === 'bitrix_deal_search');
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  try {
    const result = await tool.handler(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/invoice/search', async (req: Request, res: Response) => {
  const tool = allTools.find((t) => t.name === 'bitrix_invoice_search');
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  try {
    const result = await tool.handler(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// ============================================================================
// LEGACY ENDPOINTS (For backwards compatibility with test-api.http)
// ============================================================================

// MCP: List tools
app.get('/mcp/tools', (_req: Request, res: Response) => {
  const tools = allTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));

  res.json({
    tools,
    count: tools.length,
  });
});

// MCP: Execute tool
app.post('/mcp/tools/:toolName', async (req: Request, res: Response) => {
  const { toolName } = req.params;
  const args = req.body || {};

  try {
    // Find the tool
    const tool = allTools.find((t) => t.name === toolName);

    if (!tool) {
      return res.status(404).json({
        success: false,
        error: `Tool not found: ${toolName}`,
      });
    }

    // Execute the tool
    const result = await tool.handler(args);

    // Return the result
    return res.json(result);
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);

    let errorResponse = {
      success: false,
      error: (error as Error).message,
      details: {} as any,
    };

    if (error instanceof BitrixAPIError) {
      errorResponse.details = error.details;
    }

    return res.status(500).json(errorResponse);
  }
});

// SSE endpoint for streaming (Open WebUI compatibility)
app.get('/mcp/sse', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() })}\n\n`);
  }, 30000);

  // Cleanup on close
  req.on('close', () => {
    clearInterval(keepAlive);
    res.end();
  });
});

// Root endpoint - API documentation
app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'Bitrix24 MCP Server',
    version: '1.0.0',
    protocol: 'MCP Streamable HTTP',
    description: 'Model Context Protocol server for Bitrix24 CRM - Open WebUI compatible',
    endpoints: {
      mcp_v1: {
        initialize: 'POST /mcp/v1/initialize - Initialize MCP connection',
        listTools: 'POST /mcp/v1/tools/list - List available tools',
        callTool: 'POST /mcp/v1/tools/call - Execute a tool',
      },
      legacy: {
        health: 'GET /health - Health check',
        tools: 'GET /mcp/tools - List tools (legacy)',
        execute: 'POST /mcp/tools/:toolName - Execute tool (legacy)',
        sse: 'GET /mcp/sse - SSE stream',
      },
    },
    toolsCount: allTools.length,
    documentation: 'https://github.com/Ibrahim-dvp/Bitrix-MCP',
  });
});

export function startServer(): void {
  const port = serverConfig.port;

  app.listen(port, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║   Bitrix24 MCP Server - Running                  ║
║   Protocol: MCP Streamable HTTP v1               ║
╚═══════════════════════════════════════════════════╝

Server:         http://localhost:${port}
Health:         http://localhost:${port}/health

MCP v1 Endpoints (Official):
  Initialize:   POST /mcp/v1/initialize
  List Tools:   POST /mcp/v1/tools/list
  Call Tool:    POST /mcp/v1/tools/call
  SSE Stream:   GET  /mcp/sse

Environment:    ${serverConfig.nodeEnv}
Tools:          ${allTools.length} available

Ready for Open WebUI integration!
    `);
  });
}

export default app;
