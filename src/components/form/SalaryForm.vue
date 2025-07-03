<!-- src/components/form/SalaryForm.vue -->
<template>
  <div class="salary-form">
    <!-- 폼 헤더 -->
    <div class="form-header d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">
        <i class="bi bi-pencil-square me-2 text-primary"></i>
        급여 정보 입력
      </h5>
      <button 
        type="button" 
        class="btn btn-sm btn-outline-secondary"
        @click="handleReset"
      >
        <i class="bi bi-arrow-clockwise me-1"></i>
        초기화
      </button>
    </div>

    <!-- 알림 메시지 -->
    <div v-if="showTaxFreeAlert" class="alert alert-info alert-dismissible fade show" role="alert">
      <i class="bi bi-info-circle me-2"></i>
      <strong>비과세 혜택 안내</strong><br>
      식대는 월 20만원, 차량유지비는 월 20만원까지 비과세 혜택을 받을 수 있습니다.
      <button type="button" class="btn-close" @click="showTaxFreeAlert = false"></button>
    </div>

    <!-- 폼 바디 -->
    <form @submit.prevent="handleSubmit" class="salary-form-body">
      <!-- 지급 항목 섹션 -->
      <IncomeSection
        :form-data="formData"
        :errors="errors"
        :warnings="warnings"
        @update="handleFieldUpdate"
        @field-focus="handleFieldFocus"
        @help-click="handleHelpClick"
      />

      <hr class="my-4" />

      <!-- 공제 항목 섹션 -->
      <DeductionSection
        :form-data="formData"
        :errors="errors"
        :warnings="warnings"
        :infos="infos"
        @update="handleFieldUpdate"
        @field-focus="handleFieldFocus"
        @help-click="handleHelpClick"
      />

      <!-- 요약 정보 -->
      <div class="summary-section mt-4">
        <div class="card bg-light">
          <div class="card-body">
            <div class="row text-center">
              <div class="col-4">
                <div class="summary-item">
                  <small class="text-success d-block mb-1">
                    <i class="bi bi-plus-circle me-1"></i>
                    지급액계
                  </small>
                  <h4 class="mb-0">{{ formatCurrency(summary.totalIncome) }}원</h4>
                </div>
              </div>
              <div class="col-4 border-start border-end">
                <div class="summary-item">
                  <small class="text-danger d-block mb-1">
                    <i class="bi bi-dash-circle me-1"></i>
                    공제액계
                  </small>
                  <h4 class="mb-0">{{ formatCurrency(summary.totalDeduction) }}원</h4>
                </div>
              </div>
              <div class="col-4">
                <div class="summary-item">
                  <small class="text-primary d-block mb-1">
                    <i class="bi bi-wallet2 me-1"></i>
                    실수령액
                  </small>
                  <h4 class="mb-0 text-primary">
                    {{ formatCurrency(summary.netPay) }}원
                  </h4>
                </div>
              </div>
            </div>

            <!-- 추가 정보 -->
            <div v-if="summary.taxFreeBenefit > 0" class="text-center mt-3 pt-3 border-top">
              <small class="text-muted">
                <i class="bi bi-check-circle text-success me-1"></i>
                비과세 혜택: {{ formatCurrency(summary.taxFreeBenefit) }}원
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- 액션 버튼 -->
      <div class="form-actions mt-4 d-flex justify-content-between">
        <button 
          type="button" 
          class="btn btn-outline-primary"
          @click="handleExport"
        >
          <i class="bi bi-download me-1"></i>
          내보내기
        </button>
        <button 
          type="button" 
          class="btn btn-primary"
          @click="handleAnalyze"
        >
          <i class="bi bi-graph-up me-1"></i>
          급여 분석
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import IncomeSection from './IncomeSection.vue'
import DeductionSection from './DeductionSection.vue'
import { formatCurrency } from '@/utils/formatters'
import { validateForm } from '@/utils/validators'
import { getSectionFieldIds } from '@/config/formSchema'

export default {
  name: 'SalaryForm',
  
  components: {
    IncomeSection,
    DeductionSection
  },
  
  props: {
    initialData: {
      type: Object,
      default: () => ({})
    }
  },
  
  emits: ['update', 'field-focus', 'help-click', 'submit', 'analyze', 'export'],
  
  setup(props, { emit }) {
    // 폼 데이터
    const formData = ref({
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
      otherDeduction: 0,
      
      ...props.initialData
    })
    
    // 검증 상태
    const errors = ref({})
    const warnings = ref({})
    const infos = ref({})
    
    // UI 상태
    const showTaxFreeAlert = ref(true)
    
    // 요약 계산
    const summary = computed(() => {
      // 지급액 계산
      const incomeFields = getSectionFieldIds('income')
      const totalIncome = incomeFields.reduce((sum, field) => {
        return sum + (formData.value[field] || 0)
      }, 0)
      
      // 공제액 계산
      const deductionFields = getSectionFieldIds('deduction')
      const totalDeduction = deductionFields.reduce((sum, field) => {
        return sum + (formData.value[field] || 0)
      }, 0)
      
      // 실수령액
      const netPay = totalIncome - totalDeduction
      
      // 비과세 혜택 계산
      const mealTaxFree = Math.min(formData.value.mealAllowance || 0, 200000)
      const carTaxFree = Math.min(formData.value.carAllowance || 0, 200000)
      const taxFreeBenefit = mealTaxFree + carTaxFree
      
      return {
        totalIncome,
        totalDeduction,
        netPay,
        taxFreeBenefit
      }
    })
    
    // 폼 데이터 변경 감지
    watch(formData, (newData) => {
      // 검증 실행
      const validation = validateForm(newData)
      errors.value = validation.errors
      warnings.value = validation.warnings
      infos.value = validation.infos
      
      // 부모 컴포넌트에 전달
      emit('update', {
        data: newData,
        summary: summary.value,
        validation
      })
    }, { deep: true })
    
    // 필드 업데이트 처리
    const handleFieldUpdate = (fieldId, value) => {
      formData.value[fieldId] = value
    }
    
    // 필드 포커스 처리
    const handleFieldFocus = (fieldId) => {
      emit('field-focus', fieldId)
    }
    
    // 도움말 클릭 처리
    const handleHelpClick = (fieldId) => {
      emit('help-click', fieldId)
    }
    
    // 폼 초기화
    const handleReset = () => {
      if (confirm('입력한 모든 정보를 초기화하시겠습니까?')) {
        Object.keys(formData.value).forEach(key => {
          formData.value[key] = 0
        })
      }
    }
    
    // 폼 제출
    const handleSubmit = () => {
      const validation = validateForm(formData.value)
      if (validation.isValid) {
        emit('submit', {
          data: formData.value,
          summary: summary.value
        })
      }
    }
    
    // 급여 분석
    const handleAnalyze = () => {
      emit('analyze', {
        data: formData.value,
        summary: summary.value
      })
    }
    
    // 내보내기
    const handleExport = () => {
      emit('export', {
        data: formData.value,
        summary: summary.value
      })
    }
    
    return {
      formData,
      errors,
      warnings,
      infos,
      showTaxFreeAlert,
      summary,
      formatCurrency,
      handleFieldUpdate,
      handleFieldFocus,
      handleHelpClick,
      handleReset,
      handleSubmit,
      handleAnalyze,
      handleExport
    }
  }
}
</script>

<style scoped>
.salary-form {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.form-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.salary-form-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.summary-section {
  position: sticky;
  bottom: 0;
  background: white;
  padding-top: 1rem;
  margin-top: auto;
  z-index: 5000;
}

.summary-item {
  padding: 0.5rem;
}

.form-actions {
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

/* 스크롤바 스타일 */
.salary-form-body::-webkit-scrollbar {
  width: 6px;
}

.salary-form-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.salary-form-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.salary-form-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 애니메이션 */
.alert {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 반응형 */
@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>