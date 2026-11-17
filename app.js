/**
 * 케이카 AI매입시스템 (K Car AI Purchase System)
 * 차량 진단 및 실시간 정밀 시세 산정 엔진
 */

let trendChartInstance = null;

function safeCreateIcons() {
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  safeCreateIcons();
});

function fillDemoLogin() {
  const idInput = document.getElementById('loginId');
  const pwInput = document.getElementById('loginPw');
  if (idInput) idInput.value = '1111';
  if (pwInput) pwInput.value = '1111';
}

function handleLogin(event) {
  if (event) event.preventDefault();
  const id = document.getElementById('loginId')?.value.trim() || '';
  const pw = document.getElementById('loginPw')?.value.trim() || '';

  if (id === '1111' && pw === '1111') {
    // 로그인 성공
    document.getElementById('loginScreen')?.classList.add('hidden');
    document.getElementById('searchScreen')?.classList.remove('hidden');
    document.getElementById('userBadge')?.classList.remove('hidden');
    document.getElementById('userBadge')?.classList.add('flex');
    document.getElementById('resetAppBtn')?.classList.remove('hidden');
    safeCreateIcons();
  } else {
    alert('사원 번호와 비밀번호(1111)를 확인해주세요.');
  }
}

function resetToHome() {
  document.getElementById('loginScreen')?.classList.remove('hidden');
  document.getElementById('searchScreen')?.classList.add('hidden');
  document.getElementById('scanningScreen')?.classList.add('hidden');
  document.getElementById('dashboardScreen')?.classList.add('hidden');
  document.getElementById('userBadge')?.classList.add('hidden');
  document.getElementById('userBadge')?.classList.remove('flex');
  document.getElementById('resetAppBtn')?.classList.add('hidden');
  safeCreateIcons();
}

function setPlate(plateNumber) {
  document.getElementById('plateInput').value = plateNumber;
}

// ==========================================
// 2. AI 스캐닝 및 차량 조회 시뮬레이션
// ==========================================

function startAiScan() {
  const plate = document.getElementById('plateInput').value.trim();
  if (!plate) {
    alert('차량번호를 입력해주세요.');
    return;
  }

  // 화면 전환: 검색 -> 스캔 로딩
  document.getElementById('searchScreen').classList.add('hidden');
  document.getElementById('scanningScreen').classList.remove('hidden');
  safeCreateIcons();

  const statusText = document.getElementById('scanStatusText');
  const log1 = document.getElementById('log1');
  const log2 = document.getElementById('log2');
  const log3 = document.getElementById('log3');

  // 스캔 단계 시뮬레이션
  setTimeout(() => {
    statusText.innerText = `[1/4] 국토교통부 자동차등록원부 [${plate}] 원부 조회 중...`;
    log1.innerHTML = `<i data-lucide="circle-dot" class="w-3 h-3 text-cyan-400"></i><span>등록원부 조회: ${plate} (2021년식 최초등록)</span>`;
    log1.classList.remove('text-gray-500');
    log1.classList.add('text-white');
    safeCreateIcons();
  }, 600);

  setTimeout(() => {
    statusText.innerText = `[2/4] 차량 식별: 제네시스 GV70 2.5T 가솔린 AWD 스포츠 확인`;
    log2.innerHTML = `<i data-lucide="circle-dot" class="w-3 h-3 text-red-400"></i><span>엔카닷컴/케이카 유사 스펙 실시간 시세 수집 완료</span>`;
    log2.classList.remove('text-gray-500');
    log2.classList.add('text-white');
    safeCreateIcons();
  }, 1300);

  setTimeout(() => {
    statusText.innerText = `[3/4] GV70 2.5T 특화 고질병/취약부위 사전 진단 DB 로드 완료`;
    log3.innerHTML = `<i data-lucide="circle-dot" class="w-3 h-3 text-amber-400"></i><span>AI 진단 가이드 및 실시간 매입가 산정 모델 가동</span>`;
    log3.classList.remove('text-gray-500');
    log3.classList.add('text-white');
    safeCreateIcons();
  }, 2000);

  setTimeout(() => {
    statusText.innerText = '[4/4] 케이카 AI 정밀 매입 대시보드 로드 완료!';
    // 대시보드 진입
    document.getElementById('scanningScreen').classList.add('hidden');
    document.getElementById('dashboardScreen').classList.remove('hidden');
    initPriceTrendChart();
    calculatePrice();
    safeCreateIcons();
  }, 2600);
}

// ==========================================
// 3. 탭 전환 제어
// ==========================================

function switchTab(tabIndex) {
  // 탭 버튼 스타일 초기화
  const tabs = [1, 2, 3];
  tabs.forEach(num => {
    const btn = document.getElementById(`tabBtn${num}`);
    const content = document.getElementById(`tabContent${num}`);
    
    if (num === tabIndex) {
      btn.className = 'flex-1 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white shadow flex items-center justify-center gap-1.5 transition-all';
      content.classList.remove('hidden');
    } else {
      btn.className = 'flex-1 py-2.5 rounded-lg text-gray-400 hover:text-white flex items-center justify-center gap-1.5 transition-all';
      content.classList.add('hidden');
    }
  });

  if (tabIndex === 2 && trendChartInstance) {
    trendChartInstance.resize();
  }
  safeCreateIcons();
}

// ==========================================
// 4. 시세 변동 추이 차트 (Chart.js)
// ==========================================

function initPriceTrendChart() {
  const ctx = document.getElementById('priceTrendChart');
  if (!ctx) return;

  if (trendChartInstance) {
    trendChartInstance.destroy();
  }

  trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['4월', '5월', '6월', '7월', '8월', '9월(현재)'],
      datasets: [
        {
          label: '엔카닷컴 평균시세',
          data: [4480, 4450, 4430, 4400, 4390, 4380],
          borderColor: '#FF1E40',
          backgroundColor: 'rgba(255, 30, 64, 0.1)',
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 3.5,
          pointBackgroundColor: '#FF1E40',
          fill: true
        },
        {
          label: '케이카 직영판매가',
          data: [4500, 4460, 4440, 4410, 4400, 4390],
          borderColor: '#00F0FF',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [4, 4],
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: '#00F0FF'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            color: '#9CA3AF',
            font: { size: 10, family: 'Pretendard' }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y}만원`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#9CA3AF', font: { size: 10 } }
        },
        y: {
          min: 4200,
          max: 4600,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: '#9CA3AF',
            font: { size: 10 },
            stepSize: 100,
            callback: function(val) { return val + '만'; }
          }
        }
      }
    }
  });
}

// ==========================================
// 5. 실시간 정밀 매입가격 계산 로직
// ==========================================

function calculatePrice() {
  // 1. 기준 판매가
  const basePrice = parseInt(document.getElementById('basePriceSlider').value, 10);
  document.getElementById('basePriceDisplay').innerText = basePrice.toLocaleString();

  // 2. 감가 요소 (마이너스 수리비)
  const panels = parseInt(document.getElementById('panelsSlider').value, 10);
  const panelCost = panels * 12; // 판당 12만원
  document.getElementById('panelsCount').innerText = panels;
  document.getElementById('panelsCost').innerText = `-${panelCost}만`;

  const tires = parseInt(document.getElementById('tireSlider').value, 10);
  const tireCost = tires * 18; // 짝당 18만원
  document.getElementById('tireCount').innerText = tires;
  document.getElementById('tireCost').innerText = `-${tireCost}만`;

  const wheelCost = parseInt(document.getElementById('wheelSelect').value, 10) * 6; // 개당 6만원
  const otherCost = parseInt(document.getElementById('otherCostSelect').value, 10); // 선택 기타비용

  const totalMinus = panelCost + tireCost + wheelCost + otherCost;
  document.getElementById('totalMinusDisplay').innerText = `- ${totalMinus} 만원`;

  // 3. 가산 요소 (플러스 옵션)
  let totalPlus = 0;
  if (document.getElementById('optColor').checked) totalPlus += 50; // 인기색상
  if (document.getElementById('optPackage').checked) totalPlus += 50; // 파퓰러2/스포츠
  if (document.getElementById('optOwner').checked) totalPlus += 30; // 1인신조/무사고
  document.getElementById('totalPlusDisplay').innerText = `+ ${totalPlus} 만원`;

  // 4. 케이카 마진
  const margin = parseInt(document.getElementById('marginSlider').value, 10);
  document.getElementById('marginDisplay').innerText = margin;

  // 5. 최종 제안 매입가 연산 공식: 기준가 - 감가 + 가산 - 마진
  const finalPrice = basePrice - totalMinus + totalPlus - margin;
  const minRange = finalPrice - 60;
  const maxRange = finalPrice + 50;

  // UI 바인딩
  document.getElementById('finalOfferPrice').innerText = finalPrice.toLocaleString();
  document.getElementById('priceRangeDisplay').innerText = `${minRange.toLocaleString()} ~ ${maxRange.toLocaleString()} 만원`;

  document.getElementById('calcBase').innerText = `+ ${basePrice.toLocaleString()} 만원`;
  document.getElementById('calcMinus').innerText = `- ${totalMinus.toLocaleString()} 만원`;
  document.getElementById('calcPlus').innerText = `+ ${totalPlus.toLocaleString()} 만원`;
  document.getElementById('calcMargin').innerText = `- ${margin.toLocaleString()} 만원`;
  document.getElementById('calcTotal').innerText = `${finalPrice.toLocaleString()} 만원`;

  // 모달 데이터 동기화
  document.getElementById('modalFinalPrice').innerText = finalPrice.toLocaleString();
  document.getElementById('modalBasePrice').innerText = `${basePrice.toLocaleString()} 만원`;
  document.getElementById('modalMinusPrice').innerText = `- ${totalMinus.toLocaleString()} 만원`;
  document.getElementById('modalPlusPrice').innerText = `+ ${totalPlus.toLocaleString()} 만원`;
  document.getElementById('modalMarginPrice').innerText = `- ${margin.toLocaleString()} 만원`;
}

// ==========================================
// 6. 견적서 모달 제어
// ==========================================

function openQuoteModal() {
  document.getElementById('quoteModal').classList.remove('hidden');
  safeCreateIcons();
}

function closeQuoteModal() {
  document.getElementById('quoteModal').classList.add('hidden');
}

function shareQuote() {
  alert('✨ 케이카 공식 카카오톡 알림톡으로 최종 매입 견적서가 고객님께 전송되었습니다.');
  closeQuoteModal();
}
