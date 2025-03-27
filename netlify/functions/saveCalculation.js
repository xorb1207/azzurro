let savedCalculations = []; // 임시 저장 (Netlify는 서버리스라 리셋될 수 있어요)

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const data = JSON.parse(event.body);

  // 간단한 유효성 검사
  if (!data || !data.formula || !data.result) {
    return {
      statusCode: 400,
      body: 'Invalid data',
    };
  }

  const newRecord = {
    id: Date.now(), // 간단한 ID
    formula: data.formula, // 예: "1000 * 1.05^3"
    result: data.result,   // 예: "1157.63"
  };

  savedCalculations.unshift(newRecord); // 최근 기록을 앞에 추가

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
