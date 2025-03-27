// 사칙연산 계산기
function calculate(operator) {
  const num1 = parseFloat(document.getElementById('num1').value);
  const num2 = parseFloat(document.getElementById('num2').value);
  let result;

  // 유효성 검사: 숫자가 입력되지 않았을 때 에러 토스트 띄우기
  if (isNaN(num1) || isNaN(num2)) {
    showToast('숫자를 입력해주세요!', 'error'); //에러 메시지 토스트
    result = '숫자를 입력해주세요!';
  } else {
    switch (operator) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/':
        if (num2 === 0) {
          showToast('0으로 나눌 수 없습니다!', 'error'); //0으로 나누는 에러
          return;
        }
        result = (num1 / num2).toFixed(2);
        break;
      default:
        result = '잘못된 연산자입니다';
        showToast(result, 'error'); //잘못된 연산자
        return;
    }
  }

  document.getElementById('result').textContent = '결과: ' + result;
  showToast('계산이 완료되었습니다!'); //정상적으로 계산 완료
}

// 탭 전환 기능
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', function () {
    const targetId = this.getAttribute('data-target');

    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    this.classList.add('active');
    document.getElementById(targetId).classList.add('active');
  });
});

// 대출 이자 계산기
function calculateLoan() {
  const principal = parseFloat(document.getElementById('loanAmount').value);
  const annualRate = parseFloat(document.getElementById('interestRate').value);
  const months = parseInt(document.getElementById('loanTerm').value);
  const type = document.getElementById('repaymentType').value;

  if (isNaN(principal) || isNaN(annualRate) || isNaN(months)) {
    document.getElementById('loanResult').innerHTML = '정확한 값을 입력해주세요.';
    return;
  }

  const monthlyRate = annualRate / 12 / 100;
  let resultText = '';

  if (type === 'equal') {
    const monthlyPayment = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    resultText = `
      월 상환금: ${monthlyPayment.toLocaleString('ko-KR', { maximumFractionDigits: 0 })} 원<br/>
      총 상환금: ${totalPayment.toLocaleString('ko-KR', { maximumFractionDigits: 0 })} 원<br/>
      총 이자: ${totalInterest.toLocaleString('ko-KR', { maximumFractionDigits: 0 })} 원
    `;
  } else if (type === 'lumpSum') {
    const monthlyInterest = principal * monthlyRate;
    const totalInterest = monthlyInterest * months;
    const totalRepayment = principal + totalInterest;

    resultText = `
      매달 이자: ${monthlyInterest.toLocaleString('ko-KR', { maximumFractionDigits: 0 })} 원<br/>
      총 이자: ${totalInterest.toLocaleString('ko-KR', { maximumFractionDigits: 0 })} 원<br/>
      만기 상환금: ${totalRepayment.toLocaleString('ko-KR', { maximumFractionDigits: 0 })} 원
    `;
  }

  document.getElementById('loanResult').innerHTML = resultText;
}

// 모바일 대응 툴팁 토글 함수
function toggleTooltip(el) {
  // 데스크탑에서는 무시
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // 클릭 시 열고, 다시 클릭 시 닫기
  const allTooltips = document.querySelectorAll('.tooltip-container');
  allTooltips.forEach(tip => {
    if (tip !== el) tip.classList.remove('active');
  });

  el.classList.toggle('active');
}

// 바깥 누르면 툴팁 닫기
document.addEventListener('click', (e) => {
  const isTooltip = e.target.closest('.tooltip-container');
  if (!isTooltip) {
    document.querySelectorAll('.tooltip-container').forEach(tip => tip.classList.remove('active'));
  }
});

// 토스트 팝업을 화면에 보여주는 함수
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  
  // 스타일에 따라 에러/성공 색상 변경
  if (type === 'error') {
    toast.style.backgroundColor = '#808080';  // gray 에러
  } else {
    toast.style.backgroundColor = '#808080';  // gray 성공
  }

  toast.classList.add('show'); // 토스트 보이기
  
  // 3초 후에 토스트 숨기기
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500); // 2.5초 후에 사라짐
}

// 백엔드 - 기록저장 fuctions
function saveCalculation(formula, result) {
  fetch('/.netlify/functions/saveCalculation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ formula, result }),
  }).then((res) => res.json())
    .then((data) => {
      if (data.success) {
        loadCalculationHistory(); // 저장 후 다시 불러오기
      }
    });
}

function loadCalculationHistory() {
  fetch('/.netlify/functions/getCalculations')
    .then((res) => res.json())
    .then((history) => {
      const container = document.getElementById('history');
      container.innerHTML = '';
      history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerText = `${item.formula} = ${item.result}`;
        div.onclick = () => fillBackToCalculator(item);
        container.appendChild(div);
      });
    });
}

function fillBackToCalculator(item) {
  // 계산기에 다시 입력하는 로직 (수정 가능)
  document.getElementById('formulaInput').value = item.formula;
}
