const fs = require('fs-extra');
const glob = require('glob');
const _ = require('lodash');
const Promise = require('bluebird');
const RejectionJs = require('rejection-js');
const Console = require('console');
const Path = require('path');

const OptionBuilder = require('./options');

function dehydrate(targetFolder) {
    const options = {
        nodir: true,
        cwd: targetFolder,
        dot: true
    };

    const files = glob.sync("**/*", options);

    const data = _.reduce(files, (current, file) => {
        console.log(file);
        current.push({
            filePath: file,
            contents: fs.readFileSync(file).toString()
        });

        return current;
    }, []);

    const workingFolder = Path.basename(targetFolder);
    const fileName = `${workingFolder}.dehydrated.json`
    const filePath = Path.join(targetFolder, fileName);

    fs.writeFileSync(filePath, JSON.stringify(data));
}

function rehydrate(file, targetFolder) {
    const folderName = Path.basename(file, '.dehydrated.json');
    const data = JSON.parse(fs.readFileSync(file).toString());

    _.forEach(data, (file) => {
        console.log(file.filePath);
        const path = Path.join(targetFolder, folderName, file.filePath);

        fs.ensureFileSync(path);

        fs.writeFileSync(path, file.contents);
    });
}

function execute(...args) {
    return OptionBuilder(...args).then((options) => {
        return Promise.try(() => {
            debugger;

            if (options.dehydrate) {
                dehydrate(options.target);
            } else if (options.rehydrate) {
                rehydrate(options.rehydrate, options.target);
            }
        });
    }).catch((err) => {
        const formatter = RejectionJs.ConsoleFormatter({ useColors: true });

        Console.log(formatter.format(RejectionJs.Rejection(err)));
    });
}

module.exports = execute;
