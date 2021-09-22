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
  // outer array represents rows, inner represents columns
  const yTags = Object.keys(output).filter((tag) => tag.startsWith(yTagPrefix));
  const xTags = Object.keys(output).filter((tag) => tag.startsWith(xTagPrefix));
  // need to find out what the length of each column's content needs to be
  // length should be equal to the longest string in that column
  const colLengths: {[key:string]: number} = xTags.reduce((acc, tag) => {
    // length of the tag itself is compared with the project names within that tag
    acc[tag] = Math.max(tag.length, ...output[tag].map((p) => p.length));
    return acc;
  }, {});
  const leftLegendLength = Math.max(...yTags.map((tag) => tag.length));

  yTags.forEach((yTag, index) => {
    let rowText = ` ${padText(yTag, leftLegendLength, '')} |`;
    const projectsInYTag = output[yTag];
    let rowDivider = `-${padText('', leftLegendLength, '-')}-+`;
    let header = ` ${padText('', leftLegendLength, ' ')} |`;;
    xTags.forEach((xTag) => {
      const projectsInXTag = output[xTag];
      // possible improvement, put multple projects that share
      // the same grid spot on their own lines.
      const projects = projectsInXTag.filter((proj) => projectsInYTag.includes(proj));
      const projectStr = projects.join(', ');
      const colLength = colLengths[xTag];
      if (index === 0) {
        header += ` ${padText(xTag, colLength, ' ')} |`;
      }
      rowText += ` ${padText(projectStr, colLength, ' ')} |`;
      rowDivider += `-${padText('', colLength, '-')}-+`;
    });
    if (index === 0) {
      console.log(header);
      console.log(rowDivider);
    }
    console.log(rowText);
    console.log(rowDivider);
  });
}

function padText(text, totalLength, padder) {
  const numSpaces = totalLength - text.length;
  return text + padder.repeat(numSpaces);
}
