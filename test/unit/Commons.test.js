/**
 * Created by roten on 8/14/17.
 */

'use strict';

const should = require('should');
const commons = require('../../src/lib/Commons').getInstance();

describe('check the commons library', () => {
  describe('parser unit test', () => {
    describe('getVerbsInString unit test', () => {
      it('should detect splitter : ', done => {
        const res = commons.parser.getVerbsInString(
            'your Flight is:{*flight_number*}');

        res.should.be.an.Array().with.lengthOf(1);
        done();
      });
      it('should detect splitter ?', () => {
        const res = commons.parser.getVerbsInString(
            'your flight is {*flight_number*} ?{*firstname*}');

        res.should.be.an.Array().with.lengthOf(2);
      });
      it('should detect splitter ;', () => {
        const res = commons.parser.getVerbsInString(
            'your flight is {*flight_number*} ;{*firstname*}');

        res.should.be.an.Array().with.lengthOf(2);
      });
      it('should detect splitter .', () => {
        const res = commons.parser.getVerbsInString(
            'your flight is {*flight_number*}.');

        res.should.be.an.Array().with.lengthOf(1);
      });
      it('should detect splitter !', () => {
        const res = commons.parser.getVerbsInString(
            'your flight is {*flight_number*} !{*firstname*}');

        res.should.be.an.Array().with.lengthOf(2);
      });
      it('should throw an Error because the verbs(var name) is not valid',
          () => {
            let error = null;

            try {
              commons.parser.getVerbsInString(
                  'this is not valid {*test_Amin*}');
            }
 catch (e) {
              error = e;
            }
            should(error).be.ok();
          });
    });
    describe('paramValidator unit test', () => {
      it('should be pass', () => {
        commons.validator.paramValidator({'inList': []});
      });
      it('should be pass', () => {
        commons.validator.paramValidator({'eql': 'test'});
      });
      it('should be pass', () => {
        commons.validator.paramValidator({'exList': []});
      });
    });
    describe('validRules unit test', () => {
      it('should be okay', () => {
        commons.validator.validRules({'eql': 'test'}, ['eql']);
      });
    });
  });
});
