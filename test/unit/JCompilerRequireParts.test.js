'use strict';

const should = require('should');


describe('check the module interface is ready for use.',()=>{
  it('should check the JCompiler default instruction.',()=>{
    const JCompiler = require('../../index');
    should(JCompiler).be.ok();
  });
  it('should read require in deep mode.',()=>{
    const {JCompiler,ValidVerbs,operands,getVerbsInString,isRuleValidator} = require('../../index');
    should(JCompiler).be.ok();
    should(ValidVerbs).be.ok();
    should(operands).be.ok();
    should(getVerbsInString).be.ok();
    should(isRuleValidator).be.ok();
  })
})
