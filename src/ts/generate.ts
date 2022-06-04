#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import inquirer from 'inquirer';

inquirer
  .prompt([
    {
      type: 'number',
      name: 'minimumChangeThreshold',
      message: `If a page's size change is below this threshold (in bytes), it will be considered unchanged'`,
      default: 0,
    },
  ])
  .then((answers) => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonContent = require(packageJsonPath);
    packageJsonContent.nuxtBundleAnalysis = {
      minimumChangeThreshold: answers.minimumChangeThreshold,
    };
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJsonContent, null, 2)
    );

    const workflowsPath = path.join(process.cwd(), '.github/workflows');
    mkdirp.sync(workflowsPath);

    const templatePath = path.join(
      __dirname,
      '../actions-template/nuxt-bundle-analysis.yml'
    );

    const destinationPath = path.join(
      workflowsPath,
      'nextjs_bundle_analysis.yml'
    );
    fs.copyFileSync(templatePath, destinationPath);
  });
