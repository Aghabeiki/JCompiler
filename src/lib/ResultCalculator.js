'use strict';

/**
 *
 */
class ResultCalculator {
  /**
   *
   * @param {String} resultsMode
   */
  constructor(resultsMode) {
    switch (resultsMode) {
      case 'count':
        this._results=0;
        this._privateCalcculator=new Function('conditionResult', 'value', 'if(conditionResult) this._results++; ');
        break;
    }
  }

  /**
   *
   * @param {Boolean} conditionResult
   * @param {T} value
   */
  collectConditionResults(conditionResult, value) {
    this._privateCalcculator.call(this, conditionResult, value);
  }

  /**
   *
   * @return {T}
   */
  get Results() {
    return this._results;
  }
}

module.exports=ResultCalculator;
