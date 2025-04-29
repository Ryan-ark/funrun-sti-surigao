const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Function to run scripts and capture output
function runScript(scriptPath) {
  console.log(`${colors.bright}${colors.yellow}Running: ${scriptPath}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}`);
  
  try {
    const output = execSync(`node ${scriptPath}`, { encoding: 'utf8' });
    console.log(output);
    console.log(`${colors.green}✓ Success${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Error running ${scriptPath}:${colors.reset}`);
    console.error(error.message);
    return false;
  } finally {
    console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);
  }
}

// Get all script files
const seedDir = path.join(__dirname, 'scripts', 'seed');
const viewDir = path.join(__dirname, 'scripts', 'view');

const seedScripts = fs.readdirSync(seedDir)
  .filter(file => file.startsWith('seed-') && file.endsWith('.js'))
  .map(file => path.join('scripts', 'seed', file));

const viewScripts = fs.readdirSync(viewDir)
  .filter(file => file.startsWith('view-') && file.endsWith('.js'))
  .map(file => path.join('scripts', 'view', file));

// Run all scripts
console.log(`${colors.bright}${colors.magenta}Testing Seed Scripts${colors.reset}`);
console.log(`${colors.magenta}${'='.repeat(80)}${colors.reset}\n`);
let seedResults = seedScripts.map(script => ({ script, success: runScript(script) }));

console.log(`${colors.bright}${colors.magenta}Testing View Scripts${colors.reset}`);
console.log(`${colors.magenta}${'='.repeat(80)}${colors.reset}\n`);
let viewResults = viewScripts.map(script => ({ script, success: runScript(script) }));

// Print summary
console.log(`${colors.bright}${colors.yellow}Summary:${colors.reset}`);
console.log(`${colors.yellow}${'='.repeat(80)}${colors.reset}`);

console.log(`\n${colors.bright}Seed Scripts:${colors.reset}`);
seedResults.forEach(result => {
  const status = result.success ? `${colors.green}✓ Success${colors.reset}` : `${colors.red}✗ Failed${colors.reset}`;
  console.log(`${result.script}: ${status}`);
});

console.log(`\n${colors.bright}View Scripts:${colors.reset}`);
viewResults.forEach(result => {
  const status = result.success ? `${colors.green}✓ Success${colors.reset}` : `${colors.red}✗ Failed${colors.reset}`;
  console.log(`${result.script}: ${status}`);
});

// Count successes and failures
const totalScripts = seedScripts.length + viewScripts.length;
const successfulScripts = seedResults.filter(r => r.success).length + viewResults.filter(r => r.success).length;
const failedScripts = totalScripts - successfulScripts;

console.log(`\n${colors.yellow}${'='.repeat(80)}${colors.reset}`);
console.log(`${colors.bright}Total: ${totalScripts}, Success: ${colors.green}${successfulScripts}${colors.reset}, Failed: ${colors.red}${failedScripts}${colors.reset}`); 