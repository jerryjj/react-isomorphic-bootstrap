"use strict";

import fs from "fs";
import path from "path";
import util from "util";

let typeOf = exports.typeOf = (input) => {
    return ({}).toString.call(input).slice(8, -1).toLowerCase();
};

exports.randomString = (len = 8) => {
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    let randomStr = "";
    let cc = 0;
    while (cc < len) {
        cc++;
        var rnum = Math.floor(Math.random() * chars.length);
        randomStr += chars.substring(rnum, rnum + 1);
    }
    return randomStr;
};

let clone = exports.clone = (input) => {
    let output = input,
    type = typeOf(input),
    index, size;

    if (type === "array") {
        output = [];
        size = input.length;
        for (index = 0; index < size; ++index) {
            output[index] = clone(input[index]);
        }
    } else if (type === "object") {
        output = {};
        for (index in input) {
            output[index] = clone(input[index]);
        }
    }

    return output;
};

exports.merge = (...argv) => {
    let recursive = (base, extend) => {
        if (typeOf(base) !== "object") {
            return extend;
        }

        for (let key in extend) {
            if (typeOf(base[key]) === "object" && typeOf(extend[key]) === "object") {
                base[key] = recursive(base[key], extend[key]);
            } else {
                base[key] = extend[key];
            }
        }
        return base;
    };

    let result = argv[0],
    size = argv.length;

    if (typeOf(result) !== "object") {
        result = {};
    }

    for (let index = 0; index < size; ++index) {
        let item = argv[index],
        type = typeOf(item);

        if (type !== "object") {
            continue;
        }

        for (var key in item) {
            let sitem = clone(item[key]);
            result[key] = recursive(result[key], sitem);
        }
    }

    return result;
};

let walkDirSync = exports.walkDirSync = (dir, opts={}) => {
    if (opts.ext) {
        if (!util.isArray(opts.ext)) {
            opts.ext = [opts.ext];
        }
    }

    let results = [];
    fs.readdirSync(dir).forEach((file) => {
        let file = path.join(dir, file);
        let stat = fs.statSync(file);
        if (stat.isDirectory()) {
            results = results.concat(walkDirSync(file, opts));
        } else {
            if (opts.ext && !(opts.ext.indexOf(path.extname(file)) !== -1)) {
                return;
            }
            results.push(file);
        }

    });
    return results;
};
