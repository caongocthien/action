const core = require('@actions/core');
const { promises: fs } = require('fs');
const path = require('path');

async function run() {
  try {
    // Read the package-lock.json file
    const packageLockPath = path.join(process.cwd(), 'package-lock.json');
    const packageLock = JSON.parse(await fs.readFile(packageLockPath, 'utf8'));

    console.log('packageLock', packageLock)
    
    // Extract dependencies
    const dependencies = packageLock.dependencies;


    if (!dependencies) {
      core.setFailed('No dependencies found in package-lock.json.');
      return;
    }

    // Iterate over dependencies and check licenses
    for (const [packageName, packageInfo] of Object.entries(dependencies)) {
      const license = packageInfo.license || 'Unknown';
      core.info(`The license for ${packageName} is ${license}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
