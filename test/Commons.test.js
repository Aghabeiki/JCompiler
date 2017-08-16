/**
 * Created by roten on 8/14/17.
 */

let should = require('should');
const commons = require('../src/lib/Commons').getInstance()

describe('check the commons library', function () {
    describe('parser unit test', function () {
        "use strict";
        describe('getVerbsInString unit test', function () {
            "use strict";
            it('should detect splitter : ', function (done) {
                let res=commons.parser.getVerbsInString('your Flight is:{*flight_number*}')
                res.should.be.an.Array().with.lengthOf(1)
                done()
            })
            it('should detect splitter ?',function () {
                let res=commons.parser.getVerbsInString('your flight is {*flight_number*} ?{*firstname*}')
                res.should.be.an.Array().with.lengthOf(2);

            })
            it('should detect splitter ;',function () {
                let res=commons.parser.getVerbsInString('your flight is {*flight_number*} ;{*firstname*}')
                res.should.be.an.Array().with.lengthOf(2);

            })
            it('should detect splitter .',function () {
                let res=commons.parser.getVerbsInString('your flight is {*flight_number*}.')
                res.should.be.an.Array().with.lengthOf(1);

            })
            it('should detect splitter !',function () {
                let res=commons.parser.getVerbsInString('your flight is {*flight_number*} !{*firstname*}')
                res.should.be.an.Array().with.lengthOf(2);

            })
            it('should throw an Error because the verbs(var name) is not valid',function () {
                let error=null;
                try{
                    commons.parser.getVerbsInString('this is not valid {*test_Amin*}')
                }
                catch (e){
                    error=e;
                }
                should(error).be.ok()
            })
        })
    })
})
