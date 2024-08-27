const core = require('@actions/core');

try {
  // Get the input 'message'
  const message = core.getInput('message');
  console.log(`Message: ${message}`);
} catch (error) {
  core.setFailed(`Action failed with error: ${error.message}`);
}
