/**
 * Created by roten on 8/14/17.
 */
'use strict';

const should = require('should');
const parser = require('../../src/lib/Parser').getInstance();

describe('should check parser work correctly', () => {
  describe('rawContentParser unit test', () => {
    it(
        'should throw an Error because parser get an empty Object as input arguments',
        done => {
          let error = null;

          try {
            parser.rawContentParser(null);
          }
 catch (e) {
            error = e;
          }

          should.exists(error, '`error` is not trowed');
          done();
        });
    it('should throw an Error , if the language code is not correct',
        done => {
          let err = null;

          try {
            parser.rawContentParser({
              'test': {},
            });
            done(new Error('not thrown an error.'));
          }
 catch (e) {
            err = e;
          }
          should.exists(err, '`error` is not trowed');
          done();
        });
  });

  describe('rawTargetParser unit test', () => {
    it('should throw Error because of empty targets', () => {
      let err = null;

      try {
        parser.rawTargetParser();
      }
 catch (e) {
        err = e;
      }
      should.exists(err, '`error` is not trowed');
    });
    it('should throw Error because of wrong `topKey` use in target',
        () => {
          let err = null;

          try {
            parser.rawTargetParser({'amin': {}});
          }
 catch (e) {
            err = e;
          }
          should.exists(err, '`error` is not trowed');
        });
    it('should throw Error becuse the wrong Verb under valid topKey',
        () => {
          let err = null;

          try {
            parser.rawTargetParser({user: {'test-mamad': 1}});
          }
 catch (e) {
            err = e;
          }
          should.exists(err, '`error` is not trowed');
        });
    it('should throw an error', () => {
      let err = null;

      try {
        parser.rawTargetParser({
          user: {
            'failed test': 'okay',
          },
        });
      }
 catch (e) {
        err = e;
      }
      should.exists(err, '`error` is not trowed');
    });
    it('should throw an error', () => {
      let err = null;

      try {
        parser.rawTargetParser({
          device: {
            'failed test': 'okay',
          },
        });
      }
 catch (e) {
        err = e;
      }
      should.exists(err, '`error` is not trowed');
    });
  });
});

