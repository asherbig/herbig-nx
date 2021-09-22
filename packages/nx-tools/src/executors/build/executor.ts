import { readJsonFile } from '@nrwl/devkit';
import { BuildExecutorSchema } from './schema';

export default async function runExecutor(options: BuildExecutorSchema) {
  console.log('Executor ran for Build', options);
  const nxJson = readJsonFile('nx.json');
  console.log('nxJson2 from executor:', nxJson);
  return {
    success: true,
  };
}
