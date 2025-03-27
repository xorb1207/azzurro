const { savedCalculations } = require('./saveCalculation.js');

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(savedCalculations),
  };
};
