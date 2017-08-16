/**
 * Created by roten on 8/14/17.
 */

let should = require('should');
const JCompiler = require('../src/JCompiler')
const fs = require('fs');
const path = require('path');
const sampleInput = JSON
    .parse(fs
        .readFileSync(path
            .resolve(__dirname, 'resources', 'SampleRawRequest.json'))
        .toString())
    .notification

describe('JCompiler test', function () {
    describe('test constructor', function () {
        it('should work correct', function (done) {
            let error = null
            let jCompiler
            try {
                jCompiler = new JCompiler({
                    user: {
                        push_token: {
                            eql: 'something'
                        }
                    }
                }, sampleInput.content);
                //todo two next lines will be removed
                jCompiler.target
                jCompiler.content


            }
            catch (e) {
                error = e;

            }
            should(error).not.be.ok();

            jCompiler.waterlineQueryFunctionBuilder().call(this, (err) => {
                "use strict";
                error = error || err;
                should(error).not.be.ok();
                done()
            })

        })
    })
})
