const core = require('@actions/core');
const { promises: fs } = require('fs');
const path = require('path');

async function run() {
  try {
    // Read the package-lock.json file
    const packageLockPath = path.join(process.cwd(), 'package-lock.json');
    const packageLock = JSON.parse(await fs.readFile(packageLockPath, 'utf8'));

    const allowLicenses = core.getInput('licenses').replace(/ /g,'').toUpperCase().split(',');
    
    // Extract dependencies
    const packages = packageLock.packages;


    if (!dependencies) {
      core.info('No dependencies found in package-lock.json.');
      return;
    }

    const dependencies = packages[""].dependencies ? Object.keys(packages[""].dependencies) : [];
    const devDependencies = packages[""].devDependencies ? Object.keys(packages[""].devDependencies) : [];
    const allDependencies = [...dependencies, ...devDependencies];
    const mapPreFixListPackageName = allDependencies.map(dep => `node_modules/${dep}`)

    
    
    const filteredDependencies = {};
    
    for (const key in packages) {
        if (mapPreFixListPackageName.includes(key)) {
            console.log('key', key)
            filteredDependencies[key] = packages[key]
        }
    }

    const listNoneLicense = [];
    for (const [packageName, packageInfo] of Object.entries(filteredDependencies)) {
        console.log('packageInfo', packageInfo)
        console.log('packageInfo.license', packageInfo.license)
      if (!allowLicenses.includes(packageInfo.license)) {

          listNoneLicense.push(packageName)
      }
    }

    // Check have package with license not suitable
    if (listNoneLicense.length > 0) {
      const formattedPackages = listNoneLicense.map(pkg => `- ${pkg}`).join('\n');
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
