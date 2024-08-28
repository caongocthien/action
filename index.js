const core = require('@actions/core');
const { promises: fs } = require('fs');
const path = require('path');

async function run() {
  try {
    // Read the package-lock.json file
    const packageLockPath = path.join(process.cwd(), 'package-lock.json');
    const packageLock = JSON.parse(await fs.readFile(packageLockPath, 'utf8'));

    console.log('packageLock', packageLock.packages)
    
    // Extract dependencies
    const dependencies = packageLock.packages;


    if (!dependencies) {
      core.info('No dependencies found in package-lock.json.');
      return;
    }

    const listNoneMITLicense = [];

    for (const [packageName, packageInfo] of Object.entries(dependencies)) {
      if (packageInfo.license !== 'MIT' || packageInfo.license !== 'ISC') {
          listNoneMITLicense.push(packageName)
      }
    }

    // Check have package with license not suitable
    if (listNoneMITLicense.length > 0) {
      const formattedPackages = listNoneMITLicense.map(pkg => `- ${pkg}`).join('\n');
      const message = `Dependencies without license suitable for project:\n${formattedPackages}`;
      core.setFailed(message);
    } else {
      core.info('All dependencies have suitable licenses.');
    }
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
