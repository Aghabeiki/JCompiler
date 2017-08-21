/**
 * Created by roten on 8/14/17.
 */

let should = require('should');
const JCompiler = require('../../index')
const fs = require('fs');
const path = require('path');
const sampleInput = JSON
    .parse(fs
        .readFileSync(path
            .resolve(__dirname, '../resources', 'SampleRawRequest.json'))
        .toString())
    .notification

let jCompiler = null;
describe('JCompiler test', function () {
    describe('test constructor', function () {
        it('should work correct', function (done) {
            let error = null
            try {
                jCompiler = new JCompiler({
                    device: {
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
            done();

        })
    })
    describe('test waterlineQueryFunctionBuilder', function () {
        it('should be ok', (done) => {
            "use strict";

            jCompiler.waterlineQueryFunctionBuilder().call(this, require('../helper/waterlineMock'), (err, res) => {
                "use strict";
                done(err);
            })
        })
        it('should be ok( without any target config', (done) => {
            let targetTmp = jCompiler.target;
            jCompiler.target = {};
            jCompiler.waterlineQueryFunctionBuilder('').call(this, require('../helper/waterlineMock'), (err, res) => {
                "use strict";
                jCompiler.target = targetTmp;
                done(err);
            })


        })

    })
})
