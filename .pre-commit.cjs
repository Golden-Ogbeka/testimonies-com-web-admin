/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');

try {
  const staged = execSync('git diff --cached --name-only --diff-filter=ACMR').toString().trim().split('\n').filter(Boolean);

  const formattable = staged.filter((f) => /\.(ts|tsx|js|jsx|json|css|md|mjs)$/.test(f));

  if (formattable.length > 0) {
    execSync(`npx prettier --write ${formattable.map((f) => `"${f}"`).join(' ')}`, { stdio: 'inherit', shell: true });
    execSync(`git add ${formattable.map((f) => `"${f}"`).join(' ')}`, { stdio: 'inherit', shell: true });
  }

  const lintable = staged.filter((f) => /\.(ts|tsx|js|jsx|mjs)$/.test(f));

  if (lintable.length > 0) {
    execSync(`npx eslint ${lintable.join(' ')}`, { stdio: 'inherit', shell: true });
  }

  const tsFiles = staged.filter((f) => /\.(ts|tsx)$/.test(f));

  if (tsFiles.length > 0) {
    execSync('npx tsc --noEmit', { stdio: 'inherit', shell: true });
  }
} catch {
  process.exit(1);
}
