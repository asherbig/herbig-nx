import { readJsonFile } from '@nrwl/devkit';
import { TagAnalyzerExecutorSchema } from './schema';

type OutputMap = {[key:string]: string[]}

export default async function runExecutor(options: TagAnalyzerExecutorSchema) {
  const nxJson = readJsonFile('nx.json');
  const output: OutputMap = {};
  Object.keys(nxJson.projects).forEach((project) => {
    const projectTags = nxJson.projects[project].tags;
    projectTags.forEach((tag) => {
      const projectList = output[tag] || [];
      output[tag] = projectList.concat(project);
    });
  });
  console.log('projects grouped by tag:\n');
  printOutput(output, options);
  return {
    success: true,
  };
}

function printOutput(
  output: OutputMap,
  options: TagAnalyzerExecutorSchema
) {
  if (options.x && options.y) {
    printTable(output, options.x, options.y)
  } else {
    // alphabetical, helps group by like tags
    Object.keys(output).sort().forEach((tag) => {
      console.log(`${tag} (${output[tag].length} projects)`);
      output[tag].forEach((project) => {
        console.log(`  ${project}`);
      });
    });
  }
}

function printTable(output: OutputMap, xTagPrefix: string, yTagPrefix: string) {
  const yTags = Object.keys(output).filter((tag) => tag.startsWith(yTagPrefix));
  const xTags = Object.keys(output).filter((tag) => tag.startsWith(xTagPrefix));
  const tableData = {};
  yTags.forEach((yTag) => {
    const projectsInYTag = output[yTag];
    tableData[yTag] = xTags.reduce((acc, xTag) => {
      const projectsInXTag = output[xTag];
      const projects = projectsInXTag.filter((proj) => projectsInYTag.includes(proj));
      const projectStr = projects.join(', ');
      acc[xTag] = projectStr;
      return acc
    }, {});
  });
  console.table(tableData);
}
