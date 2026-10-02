# Codegen Files

Place Playwright codegen files here. When saved, they will be automatically transformed to the framework structure.

## Usage

1. Run Playwright codegen:
   ```bash
   npx playwright codegen https://your-app-url.com
   ```

2. Create a new `.js` file in this folder:
   ```
   codegen-files/feature-name.js
   ```

3. Paste the generated codegen code into the file and save.

4. Kiro hook will:
   - Automatically trigger when the file is saved
   - Transform the codegen to framework structure using Kiro AI
   - Create page objects, fixtures, tests, and test data locally
   - Allow you to review and adjust before committing

5. Review the generated files and commit when satisfied.

## Manual Transformation

If the hook doesn't trigger automatically:
1. Open Kiro chat
2. Ask: "Transform the codegen file `codegen-files/feature-name.js` into our framework structure using `codegen-transformation-prompt.md`"
