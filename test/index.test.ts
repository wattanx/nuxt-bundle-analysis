import fs from 'fs';

const isVite = process.env.NUXT_BUNDLE_ANALYSIS_BUILDER === 'vite';
console.log(
  'process.env.NUXT_BUNDLE_ANALYSIS_BUILDER',
  process.env.NUXT_BUNDLE_ANALYSIS_BUILDER
);

describe('ts test', () => {
  it('generated __bundle_analysis.json', async () => {
    expect(
      fs.existsSync('playground/.nuxt/analyze/__bundle_analysis.json')
    ).toBeTruthy();
  });

  it('generated __bundle_analysis_comment.txt', () => {
    expect(
      fs.existsSync('playground/.nuxt/analyze/__bundle_analysis_comment.txt')
    ).toBeTruthy();
  });

  it.skipIf(isVite)('comparison results test', () => {
    const contents = fs
      .readFileSync('playground/.nuxt/analyze/__bundle_analysis_comment.txt')
      .toString();

    const splitContents = contents.split('\n');

    // decreased
    expect(splitContents.find((x) => x.includes('app'))).toContain('🟢');

    // increased
    expect(splitContents.find((x) => x.includes('pages/index'))).toContain(
      'removed'
    );

    // removed
    expect(splitContents.find((x) => x.includes('pages/test'))).toContain(
      'removed'
    );

    expect(contents).toMatchSnapshot();
  });

  it.skipIf(isVite)('Snapshot of comparison results', () => {
    const contents = fs
      .readFileSync('playground/.nuxt/analyze/__bundle_analysis_comment.txt')
      .toString();

    expect(contents).toMatchSnapshot();
  });

  it.skipIf(!isVite)('Vite comparison results test', () => {
    const contents = fs
      .readFileSync('playground/.nuxt/analyze/__bundle_analysis_comment.txt')
      .toString();

    expect(contents).toMatchSnapshot();
  });
});
