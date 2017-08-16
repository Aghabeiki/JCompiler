/**
 * Created by roten on 8/15/17.
 */

module.exports = {
    'eql': (op1, op2) => {
        "use strict";
        return op1 === op2;
    },
    'after': (op1, op2) => {
        "use strict";
        return op1 > op2
    },
    'before': (op1, op2) => {
        "use strict";
        return op1 < op2;
    }
}