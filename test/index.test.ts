import fs from 'fs';

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
});
