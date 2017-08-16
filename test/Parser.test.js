/**
 * Created by roten on 8/14/17.
 */
let should = require('should');
const parser = require('../src/lib/Parser').getInstance()
describe('should check parser work correctly', function () {
    describe('check the content parser work correctly', function () {
        it('should throw an Error because parser get an empty Object as input arguments', function (done) {
            let error = null;
            try {
                parser.RawContentParser(null);
            }
            catch (e) {
                error = e;
            }

            should.exists(error, '`error` is not trowed');
            done();
        })
        it('should throw an Error , if the language code is not correct', function (done) {
            let err = null;
            try {
                let res = parser.RawContentParser({
                    'test': {}
                })
            }
            catch (e) {
                err = e;
            }
            should.exists(err, '`error` is not trowed');
            done()
        })
    })
    describe('check the target parser work correctly', function () {
        it('should throw Error because of empty targets', function () {
            let err = null;
            try {
                parser.RawTargetParser()
            }
            catch (e) {
                err = e;
            }
            should.exists(err, '`error` is not trowed');
        })
        it('should throw Error because of wrong `topKey` use in target', function () {
            let err = null;
            try {
                parser.RawTargetParser({'amin': {}});
            }
            catch (e) {
                err = e;
            }
            should.exists(err, '`error` is not trowed');
        })
        it('should throw Error becuse the wrong Verb under valid topKey', function () {
            let err = null;
            try {
                parser.RawTargetParser({user: {'test-mamad': 1}})
            }
            catch (e) {
                err = e;
            }
            should.exists(err, '`error` is not trowed');
        })
    })
})
