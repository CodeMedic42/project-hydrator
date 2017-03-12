const Optionator = require('optionator');
const Console = require('console');
const Promise = require('bluebird');

/*
 * The defined options which are supported when running the cli.
 */
const optionParser = Optionator({
    mutuallyExclusive: ['dehydrate', 'rehydrate'],
    options: [{
        option: 'help',
        alias: 'h',
        type: 'Boolean',
        description: 'Displays the help menu.',
        overrideRequired: true
    }, {
        option: 'dehydrate',
        alias: 'd',
        type: 'Boolean',
        required: true,
        overrideRequired: true
    }, {
        option: 'rehydrate',
        alias: 'r',
        type: 'String',
        required: true,
        overrideRequired: true
    }, {
        option: 'target',
        alias: 't',
        type: 'String',
        default: process.cwd()
    }]
});

function parseOptions(...args) {
    return Promise.try(() => {
        // Use optionator to parse the args.
        const options = optionParser.parse(...args);

        if (options.help) {
            // If help was called then show the help and then return null;
            Console.log(optionParser.generateHelp());

            return null;
        }

        return options;
    });
}

module.exports = parseOptions;
