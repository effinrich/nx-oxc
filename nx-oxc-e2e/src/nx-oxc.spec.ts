import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { mkdirSync, readFileSync, rmSync } from 'fs';

const workspaceNxVersion = getWorkspaceNxVersion();

describe('nx-oxc', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();

    // The plugin has been built and published to a local registry in the jest globalSetup
    // Install the plugin built with the latest source code into the test repo
    execSync(`npm install -D @nx-oxc/nx@e2e`, {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: process.env,
    });
  });

  afterAll(() => {
    if (projectDirectory) {
      // Cleanup the test project
      rmSync(projectDirectory, {
        recursive: true,
        force: true,
      });
    }
  });


  it('should be installed', () => {
    // npm ls will fail if the package is not installed properly
    execSync('npm ls @nx-oxc/nx', {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });
});

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
function createTestProject() {
  const projectName = 'test-project';
  const projectDirectory = join(process.cwd(), 'tmp', projectName);

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  execSync(
    `npx create-nx-workspace@${workspaceNxVersion} ${projectName} --preset apps --nxCloud=skip --no-interactive`,
    {
      cwd: dirname(projectDirectory),
      stdio: 'inherit',
      env: process.env,
    }
  );
  console.log(`Created test project in "${projectDirectory}"`);

  return projectDirectory;
}

function getWorkspaceNxVersion() {
  const packageJson = JSON.parse(
    readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8')
  ) as {
    devDependencies?: { nx?: string };
    dependencies?: { nx?: string };
  };

  const nxVersion = packageJson.devDependencies?.nx ?? packageJson.dependencies?.nx;
  if (!nxVersion) {
    throw new Error('Could not determine the workspace Nx version.');
  }

  const exactVersion = nxVersion.match(/\d+\.\d+\.\d+/)?.[0];
  if (!exactVersion) {
    throw new Error(`Unsupported Nx version specifier: ${nxVersion}`);
  }

  return exactVersion;
}
