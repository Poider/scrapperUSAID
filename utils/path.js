const path = require('path');

const workingdir = path.dirname(__filename)

exports.pathMaker = function (...files) {

    return path.join(workingdir, ...files)
}

