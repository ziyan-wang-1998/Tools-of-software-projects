const randomBytes = require('crypto').randomBytes;

exports.generate = function() {
    return toHexString(randomBytes(3));
}

function toHexString(buffer) {
    return buffer.toString('hex');
}