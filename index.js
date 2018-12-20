//const replace = require('replace-in-file');
const yargs = require('yargs');
const readline = require('readline');
const fs = require('fs');

let [SELECTED_ENVIRONMENT, PATH] = yargs.argv._;

//console.log('PATH: ', PATH);
//console.log('SELECTED_ENVIRONMENT: ', SELECTED_ENVIRONMENT);
let CURRENT_ENVIRONMENT;


//console.log('PATH: ', PATH);
//console.log('yargs.argv: ', yargs.argv);

function getCurrentEnvironment() {
  return new Promise((resolve, reject) => {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(`${PATH}/js/background.js`),
    });
    lineReader.on('line', (line) => {
      if (line.includes('const ENVIRONMENT = ')) {
        const result = /[^=]*$/.exec(line)[0];
        resolve(result.replace(/['";']+/g, ''));
      }
    });
  });
}

async function replaceEnvironment() {
  const FILE_LIST = ['frame.js', 'js/background.js', 'js/shapp.js'];
  FILE_LIST.forEach((file) => {
    console.log('file: ', file);
    let localPath = PATH;
    let options;
    switch (file) {
      case 'frame.js':
        localPath = `${PATH}${file}`;
        options = {
          from: `let crossPlatformURL = ENVIRONMENT.${CURRENT_ENVIRONMENT}`,
          to: `let crossPlatformURL = ENVIRONMENT.${SELECTED_ENVIRONMENT}`,
        };
        break;
      case 'js/background.js':
        localPath = `${PATH}${file}`;
        options = {
          from: `const ENVIRONMENT = "${CURRENT_ENVIRONMENT}";`,
          to: `const ENVIRONMENT = "${SELECTED_ENVIRONMENT}";`,
        };
        break;
      case 'js/shapp.js':
        localPath = `${PATH}${file}`;
        options = {
          from: `const ENVIRONMENT = '${CURRENT_ENVIRONMENT}';`,
          to: `const ENVIRONMENT = '${SELECTED_ENVIRONMENT}';`,
        };
        break;
      default:
        break;
    }
  
    console.log('PATH-3: ', localPath);
    console.log('options: ', options);
    console.log("==============================================");

    let x =  await changeEnvironment();
    console.log('x: ', x);
  });
}

async function main() {
  CURRENT_ENVIRONMENT = (await getCurrentEnvironment()).trim();
  console.log('CURRENT_ENVIRONMENT: ', CURRENT_ENVIRONMENT);
  replaceEnvironment();

  // fs.readFile('/home/ikigai27/Documents/current_extension/2.0.x/chrome-gmail-plugin-v2_test/frame.js', 'utf8', function (err,data) {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   var result = data.replace(/const ENVIRONMENT = "COM"/g, 'const ENVIRONMENT = "DOER"');

  //   fs.writeFile('/home/ikigai27/Documents/current_extension/2.0.x/chrome-gmail-plugin-v2_test/frame.js', result, 'utf8', function (err) {
  //      if (err) return console.log(err);
  //   });
  // });
}

main();

function changeEnvironment() {
  return new Promise((resolve, reject) => {
    return fs.readFile(localPath, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      let result = data.replace(/options.from/, `${options.to}`);
      console.log('result: ', result);
      resolve(result);
      // fs.writeFile(localPath, result, 'utf8',(err) => {
      //    if (err) return console.log(err);
      // });
    });
  });
}


// console.log('SELECTED_ENVIRONMENT: ', SELECTED_ENVIRONMENT);
// const options = {
//   files: [
//     '/home/ikigai27/Documents/current_extension/2.0.x/chrome-gmail-plugin-v2_test/js/background.js',
//   ],
//   from: `ENVIRONMENT = "${CURRENT_ENVIRONMENT}"`,
//   to: `ENVIRONMENT."${SELECTED_ENVIRONMENT}"`,
// };

// console.log('options: ', options);
// try {
//   const changes = replace.sync(options);
// console.log('changes: ', changes);
//   console.log('Modified files:', changes.join(', '));
// } catch (error) {
//   console.error('Error occurred:', error);
// }