module.exports = {
    devices: {
        find: function (...args) {
            return {
                populate: function (...args) {
                    return {
                        exec: function (cb) {
                            cb(null);
                        }
                    }
                }
            }
        }
    }
}