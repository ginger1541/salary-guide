 <!-- src/components/report/ResultReport.vue -->
<template>
  <div class="result-report">
    <!-- 선택된 항목이 없을 때 -->
    <div v-if="!selectedField" class="empty-state text-center py-5">
      <i class="bi bi-hand-index display-1 text-primary mb-3 d-block"></i>
      <h5 class="mb-3">항목을 선택하세요</h5>
      <p class="text-muted">
        왼쪽에서 급여 항목을 클릭하거나<br>
        <i class="bi bi-question-circle"></i> 버튼을 누르면<br>
        해당 항목에 대한 자세한 설명이 표시됩니다.
      </p>
    </div>

    <!-- 선택된 항목이 있을 때 -->
    <div v-else class="report-content">
      <!-- 헤더 -->
      <div class="report-header mb-4">
        <div class="d-flex align-items-start">
          <div class="flex-grow-1">
            <h4 class="mb-2">
              <i :class="fieldInfo.icon" class="me-2"></i>
              {{ fieldInfo.title }}
            </h4>
            <p class="text-muted mb-0">{{ fieldInfo.shortDescription }}</p>
          </div>
          <div class="text-end">
            <div class="badge bg-light text-dark fs-6 px-3 py-2">
              <small class="d-block text-muted">입력값</small>
              <strong>{{ formatCurrency(currentValue) }}원</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- 상세 설명 -->
      <div class="report-body">
        <!-- 기본 정보 카드 -->
        <div class="info-card mb-4">
          <h6 class="card-title">
            <i class="bi bi-info-circle me-2"></i>
            상세 설명
          </h6>
          <p>{{ fieldInfo.detailDescription }}</p>
          
          <!-- 핵심 포인트 -->
          <div v-if="fieldInfo.keyPoints" class="key-points mt-3">
            <ul class="mb-0">
              <li v-for="(point, index) in fieldInfo.keyPoints" :key="index">
                {{ point }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 계산 정보 (있는 경우) -->
        <div v-if="calculationInfo" class="info-card mb-4">
          <h6 class="card-title">
            <i class="bi bi-calculator me-2"></i>
            계산 방법
          </h6>
          
          <div class="calculation-box">
            <div class="formula mb-3">
              <small class="text-muted d-block mb-1">계산식</small>
              <code class="fs-6">{{ calculationInfo.formula }}</code>
            </div>
            
            <div v-if="calculationInfo.example" class="example">
              <small class="text-muted d-block mb-1">예시</small>
              <p class="mb-0">{{ calculationInfo.example }}</p>
            </div>
            
            <div v-if="calculationInfo.estimatedBase" class="mt-3 p-3 bg-light rounded">
              <div class="row g-3">
                <div class="col-6">
                  <small class="text-muted d-block">추정 기준액</small>
                  <strong>{{ calculationInfo.estimatedBaseText }}</strong>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">적용 요율</small>
                  <strong>{{ calculationInfo.rate }}</strong>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="calculationInfo.note" class="mt-3">
            <p class="mb-0 small text-muted">
              <i class="bi bi-info-circle me-1"></i>
              {{ calculationInfo.note }}
            </p>
          </div>
        </div>

        <!-- 비과세 정보 (해당하는 경우) -->
        <div v-if="taxFreeInfo" class="info-card mb-4">
          <h6 class="card-title">
            <i class="bi bi-check-circle text-success me-2"></i>
            비과세 혜택
          </h6>
          
          <div class="tax-free-box">
            <div class="row align-items-center">
              <div class="col-8">
                <p class="mb-1">{{ taxFreeInfo.description }}</p>
                <small class="text-muted">비과세 한도: {{ formatCurrency(taxFreeInfo.limit) }}원</small>
              </div>
              <div class="col-4 text-end">
                <div v-if="currentValue <= taxFreeInfo.limit" class="text-success">
                  <i class="bi bi-check-circle-fill me-1"></i>
                  <strong>전액 비과세</strong>
                </div>
                <div v-else class="text-warning">
                  <i class="bi bi-exclamation-circle-fill me-1"></i>
                  <strong>{{ formatCurrency(currentValue - taxFreeInfo.limit) }}원 과세</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ (있는 경우) -->
        <div v-if="fieldInfo.faq && fieldInfo.faq.length > 0" class="info-card mb-4">
          <h6 class="card-title">
            <i class="bi bi-question-circle me-2"></i>
            자주 묻는 질문
          </h6>
          
          <div class="accordion accordion-flush" id="faqAccordion">
            <div 
              v-for="(item, index) in fieldInfo.faq" 
              :key="index"
              class="accordion-item"
            >
              <h2 class="accordion-header" :id="`heading${index}`">
                <button 
                  class="accordion-button collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  :data-bs-target="`#collapse${index}`"
                  :aria-expanded="false"
                  :aria-controls="`collapse${index}`"
                >
                  {{ item.question }}
                </button>
              </h2>
              <div 
                :id="`collapse${index}`" 
                class="accordion-collapse collapse" 
                :aria-labelledby="`heading${index}`"
                data-bs-parent="#faqAccordion"
              >
                <div class="accordion-body">
                  {{ item.answer }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 관련 링크 -->
        <div v-if="fieldInfo.link" class="info-card">
          <h6 class="card-title">
            <i class="bi bi-link-45deg me-2"></i>
            관련 정보
          </h6>
          
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <p class="mb-1">더 자세한 정보는 공식 사이트에서 확인하세요</p>
              <small class="text-muted">{{ fieldInfo.link }}</small>
            </div>
            <a 
              :href="fieldInfo.link" 
              target="_blank" 
              class="btn btn-primary btn-sm"
            >
              방문하기
              <i class="bi bi-box-arrow-up-right ms-1"></i>
            </a>
          </div>
        </div>

        <!-- 팁 (있는 경우) -->
        <div v-if="tips.length > 0" class="mt-4">
          <div 
            v-for="(tip, index) in tips" 
            :key="index"
            class="alert alert-info d-flex align-items-start"
            role="alert"
          >
            <i class="bi bi-lightbulb me-2 mt-1"></i>
            <div>
              <strong>{{ tip.title }}</strong>
              <p class="mb-0 mt-1">{{ tip.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { formatCurrency } from '@/utils/formatters'
import { getFieldSchema } from '@/config/formSchema'
import insuranceModule from '@/modules/insurance'
import taxModule from '@/modules/tax'
import allowanceModule from '@/modules/allowance'

export default {
  name: 'ResultReport',
  
  props: {
    selectedField: {
      type: String,
      default: null
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  
  setup(props) {
    const fieldInfo = ref({})
    const calculationInfo = ref(null)
    const taxFreeInfo = ref(null)
    const tips = ref([])
    
    // 현재 필드의 값
    const currentValue = computed(() => {
      return props.formData[props.selectedField] || 0
    })
    
    // 필드 정보 로드
    const loadFieldInfo = () => {
      if (!props.selectedField) return
      
      // 스키마에서 기본 정보 가져오기
      const schema = getFieldSchema(props.selectedField)
      if (!schema) return
      
      // 필드 타입별로 상세 정보 가져오기
      let detailInfo = {}
      let calcInfo = null
      
      // 보험 항목
      if (['nationalPension', 'healthInsurance', 'longTermCare', 'employmentInsurance'].includes(props.selectedField)) {
        detailInfo = insuranceModule.getInsuranceInfo(props.selectedField)
        calcInfo = insuranceModule.getCalculationExplanation(
          props.selectedField, 
          currentValue.value, 
          props.formData
        )
      }
      // 세금 항목
      else if (['incomeTax', 'localIncomeTax'].includes(props.selectedField)) {
        detailInfo = taxModule.getTaxInfo(props.selectedField)
        calcInfo = taxModule.getTaxCalculationExplanation(
          props.selectedField,
          currentValue.value,
          props.formData
        )
      }
      // 수당 및 기타 항목
      else {
        const category = schema.category || 'income'
        detailInfo = allowanceModule.getAllowanceInfo(category, props.selectedField)
      }
      
      // 필드 정보 병합
      fieldInfo.value = {
        ...schema,
        ...detailInfo,
        icon: detailInfo.icon || schema.icon || 'bi-cash'
      }
      
      calculationInfo.value = calcInfo
      
      // 비과세 정보
      if (schema.taxFree) {
        taxFreeInfo.value = {
          limit: schema.taxFree.limit,
          description: schema.taxFree.message
        }
      } else {
        taxFreeInfo.value = null
      }
      
      // 팁 가져오기
      loadTips()
    }
    
    // 팁 로드
    const loadTips = () => {
      tips.value = []
      
      // 보험 관련 팁
      if (['nationalPension', 'healthInsurance', 'longTermCare', 'employmentInsurance'].includes(props.selectedField)) {
        const insuranceTips = insuranceModule.getInsuranceTips(props.formData)
        tips.value = insuranceTips.filter(tip => tip.type === props.selectedField)
      }
      
      // 세금 관련 팁
      if (['incomeTax', 'localIncomeTax'].includes(props.selectedField)) {
        const taxTips = taxModule.getTaxSavingTips(props.formData)
        tips.value = taxTips.filter(tip => 
          tip.type === props.selectedField || tip.type === 'general'
        ).slice(0, 2) // 최대 2개만
      }
    }
    
    // 선택된 필드 변경 감지
    watch(() => props.selectedField, () => {
      loadFieldInfo()
    }, { immediate: true })
    
    // 폼 데이터 변경 감지 (계산 정보 업데이트)
    watch(() => props.formData, () => {
      if (props.selectedField) {
        loadFieldInfo()
      }
    }, { deep: true })
    
    return {
      fieldInfo,
      calculationInfo,
      taxFreeInfo,
      tips,
      currentValue,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.result-report {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
}

.report-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.report-header {
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.info-card {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #495057;
}

.calculation-box,
.tax-free-box {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1rem;
}

.formula code {
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  display: inline-block;
  color: #e83e8c;
}

.key-points ul {
  padding-left: 1.5rem;
}

.key-points li {
  margin-bottom: 0.5rem;
  color: #495057;
}

/* 아코디언 커스텀 */
.accordion-item {
  background: transparent;
  border: none;
}

.accordion-button {
  background: white;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  margin-bottom: 0.5rem;
  border-radius: 0.375rem !important;
}

.accordion-button:not(.collapsed) {
  background: #e7f3ff;
  border-color: #0d6efd;
  color: #0d6efd;
}

.accordion-button:focus {
  box-shadow: none;
  border-color: #0d6efd;
}

.accordion-body {
  padding: 1rem;
  font-size: 0.875rem;
  color: #495057;
}

/* 스크롤바 */
.report-content::-webkit-scrollbar {
  width: 6px;
}

.report-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.report-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

/* 애니메이션 */
.info-card {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 반응형 */
@media (max-width: 768px) {
  .report-content {
    padding: 1rem;
  }
  
  .info-card {
    padding: 1rem;
  }
}
</style>
