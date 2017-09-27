/**
 * Created by roten on 8/15/17.
 */

module.exports = {
    JCompiler: require('./src/JCompiler'),
    ValidVerbs: require('./src/lib/ValidVerbs'),
    operands: require("./src/lib/operands"),
    getVerbsInString: require('./src/lib/Commons').getInstance().parser.getVerbsInString,
    isRuleValidator: function (rules) {
        "use strict";
        let res = null;
        try {
            let targets=require('./src/lib/Parser').getInstance().RawTargetParser(rules);
            Object.keys(targets).forEach(topKey=>{
                "use strict";
                Object.keys(targets[topKey]).forEach(verb=>{

                    Object.keys(targets[topKey][verb]['value']).forEach(operands=>{
                        if(targets[topKey][verb]['keyTarget']['acceptableOperand'].indexOf(operands)==-1){
                            throw new Error('The operand '+operands+' is not valid ')
                        }
                    })

                })
            })

        }
        catch (e) {
            res = e;
        }
        return res;
    }
}

