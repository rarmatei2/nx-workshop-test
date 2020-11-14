import { chain, Rule } from '@angular-devkit/schematics';
import { formatFiles, updateJsonInTree } from '@nrwl/workspace';
import { get } from 'lodash';

function sortKeysAtJsonPath(path: string, jsonPath: string[]): Rule {
  return updateJsonInTree(path, (json) => {
    //traverse JSON to find value we want to sort
    let parent = json;
    if (jsonPath.length > 1) {
      const pathToParent = jsonPath.slice(0, jsonPath.length - 1);
      parent = get(json, pathToParent);
    }
    const unordered = get(json, jsonPath);
    //sort the keys
    const sorted = {};
    Object.keys(unordered)
      .sort()
      .forEach((key) => {
        sorted[key] = unordered[key];
      });
    //mutate original json and return it
    const childProp = jsonPath[jsonPath.length - 1];
    parent[childProp] = sorted;
    return json;
  });
}

export default function (): Rule {
  return chain([
    sortKeysAtJsonPath('workspace.json', ['projects']),
    sortKeysAtJsonPath('nx.json', ['projects']),
    sortKeysAtJsonPath('tsconfig.base.json', ['compilerOptions', 'paths']),
    formatFiles(),
  ]);
}
