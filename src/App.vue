<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- 메인 화면 -->
    <div class="main-container">
      <!-- 헤더 -->
      <header class="main-header">
        <div class="header-content">
          <div class="logo">
            <i class="bi bi-calculator me-2"></i>
            <span>급여명세서 해설기</span>
          </div>
          <div class="header-actions">
            <button 
              class="btn btn-primary"
              @click="showCalculator = true"
            >
              <i class="bi bi-play-fill me-2"></i>
              시작하기
            </button>
          </div>
        </div>
      </header>

      <!-- 히어로 섹션 -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">급여명세서 해설기</h1>
          <p class="hero-subtitle">
            복잡한 급여명세서를 쉽게 이해할 수 있도록 각 항목별 상세한 설명을 제공합니다.<br>
            2025년 최신 세법 기준으로 정확한 정보를 안내해드립니다.
          </p>
        </div>
      </section>

      <!-- 특징 카드 섹션 -->
      <section class="features-section">
        <div class="features-container">
          <!-- 카드 1 -->
          <div class="feature-card">
            <div class="card-image">
              <div class="icon-placeholder">
                <i class="bi bi-shield-check"></i>
              </div>
            </div>
            <div class="card-content">
              <h3>안전한 개인정보 보호</h3>
              <p>입력하신 급여 정보는 서버로 전송되지 않고 브라우저에서만 처리되어 개인정보가 안전하게 보호됩니다.</p>
              <button class="btn btn-link" @click="showFeatureDetail('privacy')">자세히 보기 →</button>
            </div>
          </div>

          <!-- 카드 2 -->
          <div class="feature-card">
            <div class="card-image">
              <div class="icon-placeholder">
                <i class="bi bi-book"></i>
              </div>
            </div>
            <div class="card-content">
              <h3>상세한 항목별 설명</h3>
              <p>4대보험, 소득세 등 각 공제 항목이 어떤 기준으로 계산되는지 이해하기 쉽게 설명해드립니다.</p>
              <button class="btn btn-link" @click="showFeatureDetail('explanation')">자세히 보기 →</button>
            </div>
          </div>

          <!-- 카드 3 -->
          <div class="feature-card">
            <div class="card-image">
              <div class="icon-placeholder">
                <i class="bi bi-graph-up"></i>
              </div>
            </div>
            <div class="card-content">
              <h3>절세 팁 제공</h3>
              <p>비과세 한도, 연말정산 절세 방법 등 실질적으로 도움이 되는 정보를 함께 제공합니다.</p>
              <button class="btn btn-link" @click="showFeatureDetail('taxSaving')">자세히 보기 →</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 푸터 -->
      <footer class="main-footer">
        <div class="footer-content">
          <p>© 2025 급여명세서 해설기 | 2025년 1월 세법 기준</p>
          <div class="footer-links">
            <a href="https://www.nts.go.kr" target="_blank">국세청</a>
            <span class="divider">|</span>
            <a href="https://www.4insure.or.kr" target="_blank">4대보험</a>
          </div>
        </div>
      </footer>
    </div>

    <!-- 기능 상세 설명 모달 -->
    <div 
      v-if="showFeatureModal" 
      class="modal fade show d-block"
      tabindex="-1"
      @click.self="closeFeatureModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i :class="featureDetails[selectedFeature].icon" class="me-2"></i>
              {{ featureDetails[selectedFeature].title }}
            </h5>
            <button type="button" class="btn-close" @click="closeFeatureModal"></button>
          </div>
          <div class="modal-body">
            <!-- 개인정보 보호 -->
            <div v-if="selectedFeature === 'privacy'">
              <h6 class="mb-3">🔒 완벽한 개인정보 보호</h6>
              <p>급여명세서 해설기는 여러분의 개인정보를 최우선으로 보호합니다.</p>
              
              <div class="feature-detail-section">
                <h6>주요 보안 특징</h6>
                <ul>
                  <li><strong>로컬 처리</strong>: 모든 계산과 분석이 브라우저에서만 이루어집니다</li>
                  <li><strong>서버 미전송</strong>: 입력한 급여 정보는 인터넷으로 전송되지 않습니다</li>
                  <li><strong>데이터 미저장</strong>: 새로고침하면 모든 입력 데이터가 사라집니다</li>
                  <li><strong>쿠키 미사용</strong>: 어떠한 추적 쿠키도 사용하지 않습니다</li>
                </ul>
              </div>
              
              <div class="feature-detail-section">
                <h6>기술적 구현</h6>
                <p>이 서비스는 Vue.js를 사용한 클라이언트 사이드 애플리케이션으로, 모든 로직이 JavaScript로 브라우저에서 실행됩니다. 
                백엔드 서버가 없으며, API 호출도 하지 않습니다.</p>
              </div>
              
              <div class="alert alert-success mt-3">
                <i class="bi bi-check-circle me-2"></i>
                <strong>안심하세요!</strong> 여러분의 급여 정보는 여러분의 컴퓨터를 벗어나지 않습니다.
              </div>
            </div>

            <!-- 상세한 설명 -->
            <div v-if="selectedFeature === 'explanation'">
              <h6 class="mb-3">📚 각 항목별 상세 설명</h6>
              <p>급여명세서의 모든 항목을 쉽고 자세하게 설명해드립니다.</p>
              
              <div class="feature-detail-section">
                <h6>4대 보험 설명</h6>
                <div class="explanation-grid">
                  <div class="explanation-item">
                    <strong>국민연금</strong>
                    <p>노후 준비를 위한 공적연금으로 월 소득의 4.5%를 납부합니다.</p>
                  </div>
                  <div class="explanation-item">
                    <strong>건강보험</strong>
                    <p>의료비 보장을 위해 보수월액의 3.545%를 납부합니다.</p>
                  </div>
                  <div class="explanation-item">
                    <strong>장기요양보험</strong>
                    <p>노인 장기요양을 위해 건강보험료의 12.27%를 추가 납부합니다.</p>
                  </div>
                  <div class="explanation-item">
                    <strong>고용보험</strong>
                    <p>실업급여 등을 위해 월 급여의 0.9%를 납부합니다.</p>
                  </div>
                </div>
              </div>
              
              <div class="feature-detail-section">
                <h6>세금 설명</h6>
                <ul>
                  <li><strong>근로소득세</strong>: 소득 구간별 6~45%의 누진세율 적용</li>
                  <li><strong>지방소득세</strong>: 근로소득세의 10%를 지방자치단체에 납부</li>
                </ul>
              </div>
              
              <div class="feature-detail-section">
                <h6>제공 정보</h6>
                <ul>
                  <li>각 항목의 법적 근거와 계산 방법</li>
                  <li>관련 기관 홈페이지 링크</li>
                  <li>자주 묻는 질문과 답변</li>
                  <li>실시간 계산 검증</li>
                </ul>
              </div>
            </div>

            <!-- 절세 팁 -->
            <div v-if="selectedFeature === 'taxSaving'">
              <h6 class="mb-3">💰 실용적인 절세 팁</h6>
              <p>합법적으로 세금을 줄일 수 있는 다양한 방법을 안내해드립니다.</p>
              
              <div class="feature-detail-section">
                <h6>비과세 항목 활용</h6>
                <div class="tax-tip-card">
                  <h6>🍽️ 식대</h6>
                  <p>월 20만원까지 비과세. 급여 구조 조정으로 세금 절감 가능</p>
                  <small class="text-success">연간 최대 36만원 절세</small>
                </div>
                <div class="tax-tip-card">
                  <h6>🚗 차량유지비</h6>
                  <p>업무용 자가운전 시 월 20만원까지 비과세</p>
                  <small class="text-success">연간 최대 36만원 절세</small>
                </div>
              </div>
              
              <div class="feature-detail-section">
                <h6>연말정산 전략</h6>
                <ul>
                  <li><strong>신용카드</strong>: 총급여의 25% 초과 사용분 소득공제</li>
                  <li><strong>연금저축</strong>: 연 600만원까지 세액공제 13.2~16.5%</li>
                  <li><strong>월세</strong>: 연 750만원까지 세액공제 10~12%</li>
                  <li><strong>의료비</strong>: 총급여의 3% 초과분 세액공제 15%</li>
                </ul>
              </div>
              
              <div class="feature-detail-section">
                <h6>소득별 맞춤 전략</h6>
                <div class="income-strategy">
                  <div class="strategy-item">
                    <strong>연봉 3천만원 이하</strong>
                    <p>근로소득세액공제 최대 활용, 신용카드 > 체크카드</p>
                  </div>
                  <div class="strategy-item">
                    <strong>연봉 3~5천만원</strong>
                    <p>연금저축 + IRP 활용, 월세 세액공제</p>
                  </div>
                  <div class="strategy-item">
                    <strong>연봉 5천만원 이상</strong>
                    <p>연금저축 한도 최대 활용, 기부금 공제</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeFeatureModal">닫기</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showFeatureModal" class="modal-backdrop fade show"></div>
    <div 
      v-if="showCalculator" 
      class="calculator-modal"
      @click.self="closeCalculator"
    >
      <div class="calculator-container">
        <!-- 헤더 -->
        <div class="calculator-header">
          <h4 class="mb-0">
            <i class="bi bi-calculator me-2"></i>
            급여명세서 해설기
          </h4>
          <button 
            type="button" 
            class="btn-close"
            @click="closeCalculator"
          ></button>
        </div>
        
        <!-- 바디 (3단 레이아웃) -->
        <div class="calculator-body">
          <!-- 왼쪽: 입력 폼 (40%) -->
          <div class="calc-section calc-input">
            <SalaryForm
              :initial-data="formData"
              @update="handleFormUpdate"
              @field-focus="handleFieldFocus"
              @help-click="handleHelpClick"
              @analyze="handleAnalyze"
              @export="handleExport"
            />
          </div>
          
          <!-- 가운데: 요약 정보 (20%) -->
          <div class="calc-section calc-summary">
            <div class="summary-card">
              <h5 class="mb-4">
                <i class="bi bi-receipt me-2"></i>
                급여 요약
              </h5>
              
              <div class="summary-item mb-4">
                <label>지급액계</label>
                <div class="amount text-success">
                  <i class="bi bi-plus-circle me-1"></i>
                  {{ formatCurrency(summary.totalIncome) }}원
                </div>
              </div>
              
              <div class="summary-item mb-4">
                <label>공제액계</label>
                <div class="amount text-danger">
                  <i class="bi bi-dash-circle me-1"></i>
                  {{ formatCurrency(summary.totalDeduction) }}원
                </div>
              </div>
              
              <hr>
              
              <div class="summary-item mb-4">
                <label class="fw-bold">실수령액</label>
                <div class="amount text-primary fw-bold fs-4">
                  <i class="bi bi-wallet2 me-1"></i>
                  {{ formatCurrency(summary.netPay) }}원
                </div>
              </div>
              
              <!-- 비과세 정보 -->
              <div v-if="summary.taxFreeBenefit > 0" class="tax-free-info">
                <small class="text-muted d-block mb-2">비과세 혜택</small>
                <div class="d-flex justify-content-between">
                  <span>식대</span>
                  <span>{{ formatCurrency(Math.min(formData.mealAllowance, 200000)) }}원</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span>차량비</span>
                  <span>{{ formatCurrency(Math.min(formData.carAllowance, 200000)) }}원</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 오른쪽: 설명 영역 (40%) -->
          <div class="calc-section calc-explanation">
            <ResultReport
              :selected-field="selectedField"
              :form-data="formData"
            />
          </div>
        </div>
        
        <!-- 푸터 -->
        <div class="calculator-footer">
          <small class="text-muted">
            2025년 세법 기준 | 
            <a href="https://www.nts.go.kr" target="_blank">국세청</a> | 
            <a href="https://www.4insure.or.kr" target="_blank">4대보험</a>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import SalaryForm from '@/components/form/SalaryForm.vue'
import ResultReport from '@/components/report/ResultReport.vue'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'App',
  
  components: {
    SalaryForm,
    ResultReport
  },
  
  setup() {
    // UI 상태
    const showCalculator = ref(false)
    const selectedField = ref(null)
    const showFeatureModal = ref(false)
    const selectedFeature = ref(null)
    
    // 기능 상세 정보
    const featureDetails = {
      privacy: {
        title: '안전한 개인정보 보호',
        icon: 'bi-shield-check'
      },
      explanation: {
        title: '상세한 항목별 설명',
        icon: 'bi-book'
      },
      taxSaving: {
        title: '절세 팁 제공',
        icon: 'bi-graph-up'
      }
    }
    
    // 폼 데이터
    const formData = reactive({
      // 지급 항목
      basicSalary: 0,
      overtimePay: 0,
      bonus: 0,
      mealAllowance: 0,
      transportAllowance: 0,
      carAllowance: 0,
      otherAllowance: 0,
      
      // 공제 항목
      nationalPension: 0,
      healthInsurance: 0,
      longTermCare: 0,
      employmentInsurance: 0,
      incomeTax: 0,
      localIncomeTax: 0,
      advancePayment: 0,
      loanRepayment: 0,
      otherDeduction: 0
    })
    
    // 요약 정보
    const summary = reactive({
      totalIncome: 0,
      totalDeduction: 0,
      netPay: 0,
      taxFreeBenefit: 0
    })
    
    // 기능 상세 보기
    const showFeatureDetail = (feature) => {
      selectedFeature.value = feature
      showFeatureModal.value = true
    }
    
    // 기능 모달 닫기
    const closeFeatureModal = () => {
      showFeatureModal.value = false
      selectedFeature.value = null
    }
    
    // 계산기 닫기
    const closeCalculator = () => {
      if (confirm('입력한 정보가 모두 사라집니다. 정말 닫으시겠습니까?')) {
        showCalculator.value = false
        selectedField.value = null
      }
    }
    
    // 폼 업데이트 처리
    const handleFormUpdate = (data) => {
      Object.assign(summary, data.summary)
    }
    
    // 필드 포커스 처리
    const handleFieldFocus = (fieldId) => {
      selectedField.value = fieldId
    }
    
    // 도움말 클릭 처리
    const handleHelpClick = (fieldId) => {
      selectedField.value = fieldId
    }
    
    // 급여 분석
    const handleAnalyze = (data) => {
      alert('급여 분석 기능은 준비 중입니다.')
    }
    
    // 내보내기
    const handleExport = (data) => {
      const content = `급여명세서 요약\n\n` +
        `지급액계: ${formatCurrency(data.summary.totalIncome)}원\n` +
        `공제액계: ${formatCurrency(data.summary.totalDeduction)}원\n` +
        `실수령액: ${formatCurrency(data.summary.netPay)}원\n`
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '급여명세서_요약.txt'
      a.click()
      URL.revokeObjectURL(url)
    }
    
    return {
      showCalculator,
      selectedField,
      showFeatureModal,
      selectedFeature,
      featureDetails,
      formData,
      summary,
      formatCurrency,
      showFeatureDetail,
      closeFeatureModal,
      closeCalculator,
      handleFormUpdate,
      handleFieldFocus,
      handleHelpClick,
      handleAnalyze,
      handleExport
    }
  }
}
</script>

<style>
/* 전역 스타일 초기화 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  /*overflow: hidden;*/
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  -webkit-text-size-adjust: 100%; 
  text-size-adjust: 100%;
}

#app {
  /*height: 100vh;*/
  background: #f8f9fa;
}

/* 메인 컨테이너 */
.main-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
}

/* 헤더 */
.main-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  display: flex;
  align-items: center;
}

.header-nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #6c757d;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #0d6efd;
}

/* 메인 컨테이너 */
.main-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

/* 헤더 */
.main-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  display: flex;
  align-items: center;
}

.header-actions .btn-primary {
  background: #0d6efd;
  border: none;
  padding: 0.5rem 1.5rem;
  font-size: 0.95rem;
}

/* 히어로 섹션 */
.hero-section {
  background: white;
  padding: 3rem 0;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  line-height: 1.7;
}

/* 특징 카드 섹션 */
.features-section {
  flex: 1;
  padding: 4rem 0;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

/* 카드 스타일 */
.feature-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.card-image {
  height: 200px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.icon-placeholder {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.icon-placeholder i {
  font-size: 2rem;
  color: #0d6efd;
}

.card-content {
  padding: 2rem;
}

.card-content h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #212529;
}

.card-content p {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.btn-link {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* 반응형 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .features-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .card-image {
    height: 150px;
  }
  
  .icon-placeholder {
    width: 60px;
    height: 60px;
  }
  
  .icon-placeholder i {
    font-size: 1.5rem;
  }
}

/* 푸터 */
.main-footer {
  background: #212529;
  color: white;
  padding: 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-content p {
  margin-bottom: 0.5rem;
  color: #adb5bd;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.footer-links a {
  color: #adb5bd;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: white;
}

.divider {
  color: #6c757d;
}

/* 계산기 모달 */
.calculator-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.calculator-container {
  width: 100%;
  max-width: 1600px;
  height: calc(100vh - 2rem);
  max-height: 900px;
  background: white;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

/* 계산기 헤더 */
.calculator-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

/* 계산기 바디 - 3단 레이아웃 */
.calculator-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.calc-section {
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
}

.calc-input {
  flex: 0 0 40%;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
}

.calc-summary {
  flex: 0 0 20%;
  background: white;
  border-right: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calc-explanation {
  flex: 0 0 40%;
  background: white;
}

/* 요약 카드 */
.summary-card {
  width: 100%;
  max-width: 250px;
}

.summary-item {
  margin-bottom: 1.5rem;
}

.summary-item label {
  display: block;
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.summary-item .amount {
  font-size: 1.25rem;
  font-weight: 500;
}

.tax-free-info {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

/* 계산기 푸터 */
.calculator-footer {
  padding: 0.75rem 1.5rem;
  border-top: 1px solid #dee2e6;
  text-align: center;
  flex-shrink: 0;
}

/* 스크롤바 스타일 */
.calc-section::-webkit-scrollbar {
  width: 6px;
}

.calc-section::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.calc-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

/* 반응형 - 태블릿 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .hero-section,
  .features-section {
    flex: 1 1 auto;
    padding: 3rem 2rem;
  }
  
  .hero-content {
    text-align: center;
  }
  
  .features-content {
    max-width: 600px;
    margin: 0 auto;
  }
}

/* 반응형 - 모바일 */
@media (max-width: 768px) {
  .header-nav {
    display: none;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-section,
  .features-section {
    padding: 2rem 1.5rem;
  }
  
  .feature-icon {
    width: 50px;
    height: 50px;
  }
  
  .feature-text h3 {
    font-size: 1.1rem;
  }
  
  .feature-text p {
    font-size: 0.9rem;
  }
  
  /* 계산기 모달 반응형 */
  .calculator-body {
    flex-direction: column;
  }
  
  .calc-section {
    flex: 1 1 auto;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #dee2e6;
  }
  
  .calc-summary {
    order: -1;
    flex: 0 0 auto;
    padding: 1rem;
  }
  
  .summary-card {
    max-width: none;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .summary-item {
    flex: 1;
    margin-bottom: 0;
  }
}

/* 기능 상세 모달 스타일 */
.modal.show {
  background: rgba(0, 0, 0, 0.5);
}

.feature-detail-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.feature-detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.feature-detail-section h6 {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1rem;
}

.explanation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.explanation-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
}

.explanation-item strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #212529;
}

.explanation-item p {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
}

.tax-tip-card {
  background: #e7f3ff;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.tax-tip-card h6 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.tax-tip-card p {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.tax-tip-card small {
  font-weight: 600;
}

.income-strategy {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.strategy-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  border-left: 4px solid #0d6efd;
}

.strategy-item strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #0d6efd;
}

.strategy-item p {
  margin: 0;
  font-size: 0.875rem;
  color: #495057;
}

/* 모달 반응형 */
@media (max-width: 768px) {
  .modal-dialog {
    margin: 0.5rem;
  }
  
  .explanation-grid {
    grid-template-columns: 1fr;
  }
}
</style>