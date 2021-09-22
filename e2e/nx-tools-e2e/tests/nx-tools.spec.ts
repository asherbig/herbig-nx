import {
  ensureNxProject,
  readJson,
  runNxCommandAsync,
} from '@nrwl/nx-plugin/testing';
describe('nx-tools e2e', () => {
  describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      ensureNxProject('@herbig-nx/nx-tools', 'dist/packages/nx-tools');
      await runNxCommandAsync(`generate @nrwl/node:application --name=food --tags type:app,scope:food`);
      await runNxCommandAsync(`generate @nrwl/node:application --name=food-ui --tags type:ui,scope:food`);
      await runNxCommandAsync(`generate @nrwl/node:application --name=food-shared --tags type:shared,type:food`);
      await runNxCommandAsync(`generate @nrwl/node:application --name=server --tags type:app,scope:server`);
      await runNxCommandAsync(`generate @nrwl/node:application --name=server-shared --tags type:shared,scope:server`);
      await runNxCommandAsync(`generate @nrwl/node:application --name=core-ui --tags type:ui,scope:core`);
      await runNxCommandAsync(`generate @nrwl/node:application --name=core-shared --tags type:shared,scope:core`);
      const nxJson = readJson('nx.json');
      console.log('============nxJson============', nxJson);
      expect(nxJson.projects['food'].tags).toEqual(['type:app', 'scope:food']);
    }, 120000);
  });
});
