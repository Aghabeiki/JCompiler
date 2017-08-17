const dataModel = require('./dataModelsLoader');
const JCompiler = require('../index');

let jCompiler = new JCompiler({
    user: {
        push_token: {
            eql: 'something'
        }
    }
}, {
    "en-us": {
        "title": "this is a test message.",
        "subtitle": "this is a test with var firstname {*firstname*}",
        "message": "this is a test with var lastname {*lastname*}, firstname,{*firstname*}",
        "action": "",
        "display": true,
        "button_text": "",
        "button_url": "",
        "image_url": ""
    }
});
jCompiler.waterlineQueryFunctionBuilder()

