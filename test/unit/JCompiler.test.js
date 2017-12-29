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
                        mobile_number: {
                            eql: '0127623452'
                        }
                    }
                }, sampleInput.content);
            }
            catch (e) {
                error = e;

            }
            should(error).not.be.ok();
            done();

        })
    })
    describe('loadPNS unit test', function () {
        it('should work well', function (done) {
            jCompiler.loadPNS(require('../helper/waterlineMock'))
                .then(res => {
                    "use strict";
                    done();
                })
                .catch(err => {
                    "use strict";
                    done(err);
                })

        })
        it('should throw an error', function (done) {
            jCompiler.loadPNS(require('../helper/waterlineMock'), 'inValidPrefix')
                .catch(err => {
                    "use strict";
                    should.exist(err);
                    done();
                })

        })
    })
})
