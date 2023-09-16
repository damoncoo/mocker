const { program } = require('commander');
const yaml = require('yaml');
const fs = require('fs');
const { mockServerClient } = require('mockserver-client');
const rules = require('./rules');

program.option('-r, --rules <path>', 'rules file path', 'rules.yaml').parse(process.argv);

function parseYaml(filePath) {
  if (!filePath) {
    throw new Error('Please provide config file');
  }
  return yaml.parse(fs.readFileSync(filePath, 'utf8'));
}

async function callCreateExpectations(expectations) {
  const result = await mockServerClient('localhost', process.env.PORT || 1080).mockAnyResponse(expectations);
  console.log(result);
  console.log('expectation created');
}

async function main() {
  const options = program.opts();
  const rulesFilePath = options.rules;
  const config = parseYaml(rulesFilePath);
  const expectations = rules.convertToMockServerExpectation(config);
  await callCreateExpectations(expectations);
}

main();
