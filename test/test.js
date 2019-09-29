import * as rollup from 'rollup';

describe('Test Package-replacemenr', () => {
  /**
   * Helper which wraps the rollup builing process and outputs the finished code as string
   */
  async function build(rollupConfig) {
    const bundle = await rollup.rollup(rollupConfig);
    const {
      output: [{ code }],
    } = await bundle.generate({
      format: 'esm',
    });

    return code;
  }

  test('basic example', async () => {
    const rollupConfig = require('./basic/rollup.config').default;
    const compiledCode = await build(rollupConfig);

    expect(compiledCode).toEqual(
      expect.stringContaining(
        `import { patch, h } from 'https://unpkg.com/superfine@^6.0.1?type=module';`
      )
    );
  });

  test('react and babel plugin', async () => {
    const rollupConfig = require('./babel-react/rollup.config').default;
    const compiledCode = await build(rollupConfig);

    expect(compiledCode).toEqual(
      expect.stringContaining(
        `import { createElement } from 'https://unpkg.com/react@^16.10.1?type=module';`
      )
    );
  });
});
