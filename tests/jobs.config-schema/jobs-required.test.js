/* eslint-disable quotes, comma-dangle */
const { shouldBeError } = require('./util');

describe('errors', () => {
  it('should NOT have fewer than 1 items', () => {
    shouldBeError({
      "jobs": []
    }, /should NOT have fewer than 1 items/);
  });

  it('should NOT have more than 20 items', () => {
    shouldBeError({
      "jobs": Array(21).fill(0).map(() => {
        return {
          "functionLocation": "/util.js",
          "functionName": "run",
          "executionConfig": {
            "time": "00:00"
          }
        };
      }),
    }, /should NOT have more than 20 items/);
  });

  it('should have required property `functionLocation`', () => {
    shouldBeError({
      "jobs": [
        {
          "functionName": "function_name",
          "executionConfig": {
            "time": "00:00"
          }
        }
      ]
    }, /should have required property 'functionLocation'/);
  });

  it('should have required property `functionName`', () => {
    shouldBeError({
      "jobs": [
        {
          "functionLocation": "/function_location.js",
          "executionConfig": {
            "time": "00:00"
          }
        }
      ]
    }, /should have required property 'functionName'/);
  });

  it('should have required property `executionConfig`', () => {
    shouldBeError({
      "jobs": [
        {
          "functionLocation": "/function_location.js",
          "functionName": "function_name",
        }
      ]
    }, /should have required property 'executionConfig'/);
  });
});
