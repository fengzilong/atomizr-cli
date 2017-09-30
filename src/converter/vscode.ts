import * as parseJson from 'parse-json';
import { addTrailingTabstops, removeTrailingTabstops } from '../util';

const read = (input, options) => {
    let data, output;

    // Validate CSON
    try {
        data = parseJson(input);
    } catch (error) {
        throw error;
    }

    // Conversion
    output = {
        scope: options.scope,
        completions: []
    };

    for (let key in data) {
        let val = data[key];
        if (val.prefix != null) {
            let body, trigger, description;

            // Create tab-separated description
            body = removeTrailingTabstops(val.body);
            trigger = val.prefix;
            if (key !== val.prefix) {
                description = key;
            } else {
                description = null;
            }
            if (description != null) {
                output.completions.push({
                    trigger: trigger,
                    contents: body,
                    description: description
                });
            } else {
                output.completions.push({
                    trigger: trigger,
                    contents: body
                });
            }
        }
    }

    // Minimum requirements
    if (output.completions.length === 0) {
        return console.error('This doesn\'t seem to be a valid Visual Studio Code snippet file. Aborting.');
    }
    return output;
};

const write = (input) => {
    let data, ref, output;

    data = {};
    ref = input.completions;
    for (let j = 0, len = ref.length; j < len; j++) {
        let body, description;

        let i = ref[j];
        if (i.description) {
            description = i.description;
        } else {
            description = i.trigger;
        }
        body = addTrailingTabstops(i.contents);
        data[description] = {
            prefix: i.trigger,
            body: body
        };
    }

    try {
        output = JSON.stringify(data, null, 4);
    } catch (error) {
        throw error;
    }

    return output;
};

export { read, write };
