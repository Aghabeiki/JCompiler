/**
 * Created by roten on 8/14/17.
 */

'use strict';

const should = require('should');
const {JCompiler} = require('../../index');
const fs = require('fs');
const path = require('path');
const sampleInput = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, '../resources', 'SampleRawRequest.json')).
    toString()).notification;

let jCompiler = null;

describe('JCompiler test', () => {
  describe('test constructor', () => {
    it('should work correct', done => {
      let error = null;

      try {
        jCompiler = new JCompiler({
          device: {
            mobile_number: {
              eql: '0127623452',
            },
          },
        }, sampleInput.content);
      }
 catch (e) {
        error = e;
      }
      should(error).not.be.ok();
      done();
    });
  });
  describe('loadPNS unit test', () => {
    it('should work well', done => {
      jCompiler.loadPNS(require('../helper/waterlineMock')).then(res => {
        done();
      }).catch(err => {
        done(err);
      });
    });
    it('should throw an error', done => {
      jCompiler.loadPNS(require('../helper/waterlineMock'), 'inValidPrefix').
          catch(err => {
            should.exist(err);
            done();
          });
    });
  });
});
