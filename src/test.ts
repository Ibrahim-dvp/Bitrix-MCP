/**
 * Test Bitrix24 API connectivity
 */

import { companyAPI, contactAPI, leadAPI, dealAPI, invoiceAPI } from './lib/bitrix-api.js';

console.log('╔═══════════════════════════════════════════════════╗');
console.log('║   Bitrix24 MCP Server - Connectivity Test        ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

async function testConnection() {
  try {
    console.log('1️⃣ Testing company API...');
    const companies = await companyAPI.list({ select: ['ID', 'TITLE'], order: { ID: 'DESC' }, start: 0 });
    console.log(`   ✅ Companies: ${companies.total || companies.length} found\n`);

    console.log('2️⃣ Testing contact API...');
    const contacts = await contactAPI.list({ select: ['ID', 'NAME'], order: { ID: 'DESC' }, start: 0 });
    console.log(`   ✅ Contacts: ${contacts.total || contacts.length} found\n`);

    console.log('3️⃣ Testing lead API...');
    const leads = await leadAPI.list({ select: ['ID', 'TITLE'], order: { ID: 'DESC' }, start: 0 });
    console.log(`   ✅ Leads: ${leads.total || leads.length} found\n`);

    console.log('4️⃣ Testing deal API...');
    const deals = await dealAPI.list({ select: ['ID', 'TITLE'], order: { ID: 'DESC' }, start: 0 });
    console.log(`   ✅ Deals: ${deals.total || deals.length} found\n`);

    console.log('5️⃣ Testing invoice API...');
    const invoices = await invoiceAPI.list({ select: ['id', 'title'], order: { id: 'DESC' }, start: 0 });
    console.log(`   ✅ Invoices: ${invoices?.items?.length || 0} found\n`);

    console.log('6️⃣ Testing field discovery...');
    const fields = await companyAPI.fields();
    const customCount = Object.keys(fields).filter((k) => k.startsWith('UF_')).length;
    console.log(`   ✅ Fields: ${Object.keys(fields).length} total (${customCount} custom)\n`);

    console.log('═══════════════════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('Server is ready to deploy!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED\n');
    console.error('Error:', (error as Error).message);
    console.error('\nCheck your environment variables in .env file');
    process.exit(1);
  }
}

testConnection();
