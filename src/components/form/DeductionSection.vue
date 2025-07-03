<!-- src/components/form/DeductionSection.vue -->
<template>
  <div class="deduction-section">
    <h6 class="section-title text-danger mb-3">
      <i class="bi bi-dash-circle me-2"></i>
      공제 항목
      <small class="text-muted ms-2">(급여에서 차감되는 항목)</small>
    </h6>

    <!-- 4대 보험 -->
    <div class="subsection mb-4">
      <h6 class="subsection-title mb-3">
        <i class="bi bi-shield-check me-1"></i>
        4대 보험
      </h6>
      
      <div class="row">
        <!-- 국민연금 -->
        <div class="col-md-6 col-lg-6">
          <BaseInput
            v-model="formData.nationalPension"
            field-id="nationalPension"
            label="국민연금"
            :required="true"
            :error-message="errors.nationalPension"
            :warning-message="warnings.nationalPension"
            help-tooltip="노후 대비 공적 연금 (월급의 4.5%)"
            :help-text="infos.nationalPension"
            @update:model-value="(value) => handleUpdate('nationalPension', value)"
            @focus="(fieldId) => $emit('field-focus', fieldId)"
            @help-click="(fieldId) => $emit('help-click', fieldId)"
          />
        </div>

        <!-- 건강보험 -->
        <div class="col-md-6 col-lg-6">
          <BaseInput
            v-model="formData.healthInsurance"
            field-id="healthInsurance"
            label="건강보험"
            :required="true"
            :error-message="errors.healthInsurance"
            :warning-message="warnings.healthInsurance"
            help-tooltip="의료비 지원 보험 (보수월액의 3.545%)"
            :help-text="infos.healthInsurance"
            @update:model-value="(value) => handleUpdate('healthInsurance', value)"
            @focus="(fieldId) => $emit('field-focus', fieldId)"
            @help-click="(fieldId) => $emit('help-click', fieldId)"
          />
        </div>

        <!-- 장기요양보험 -->
        <div class="col-md-6 col-lg-6">
          <BaseInput
            v-model="formData.longTermCare"
            field-id="longTermCare"
            label="장기요양보험"
            :required="true"
            :error-message="errors.longTermCare"
            :warning-message="warnings.longTermCare"
            help-tooltip="노인 장기요양 보험 (건강보험료의 12.27%)"
            :help-text="infos.longTermCare"
            @update:model-value="(value) => handleUpdate('longTermCare', value)"
            @focus="(fieldId) => $emit('field-focus', fieldId)"
            @help-click="(fieldId) => $emit('help-click', fieldId)"
          />
        </div>

        <!-- 고용보험 -->
        <div class="col-md-6 col-lg-6">
          <BaseInput
            v-model="formData.employmentInsurance"
            field-id="employmentInsurance"
            label="고용보험"
            :required="true"
            :error-message="errors.employmentInsurance"
            :warning-message="warnings.employmentInsurance"
            help-tooltip="실업급여 등 (월급의 0.9%)"
            :help-text="infos.employmentInsurance"
            @update:model-value="(value) => handleUpdate('employmentInsurance', value)"
            @focus="(fieldId) => $emit('field-focus', fieldId)"
            @help-click="(fieldId) => $emit('help-click', fieldId)"
          />
        </div>
      </div>

      <!-- 4대보험 소계 -->
      <div class="mt-3 p-2 bg-light rounded">
        <div class="d-flex justify-content-between align-items-center small">
          <span class="text-muted">4대보험 합계</span>
          <strong>{{ formatCurrency(totalInsurance) }}원</strong>
        </div>
      </div>
    </div>

    <!-- 세금 -->
    <div class="subsection mb-4">
      <h6 class="subsection-title mb-3">
        <i class="bi bi-calculator me-1"></i>
        세금
      </h6>
      
      <div class="row">
        <!-- 소득세 -->
        <div class="col-md-6">
          <BaseInput
            v-model="formData.incomeTax"
            field-id="incomeTax"
            label="소득세"
            :required="true"
            :error-message="errors.incomeTax"
            help-tooltip="근로소득에 대한 세금 (누진세율)"
            help-text="간이세액표 기준이며, 연말정산에서 확정됩니다"
            @update:model-value="(value) => handleUpdate('incomeTax', value)"
            @focus="(fieldId) => $emit('field-focus', fieldId)"
            @help-click="(fieldId) => $emit('help-click', fieldId)"
          />
        </div>

        <!-- 지방소득세 -->
        <div class="col-md-6">
          <BaseInput
            v-model="formData.localIncomeTax"
            field-id="localIncomeTax"
            label="지방소득세"
            :required="true"
            :error-message="errors.localIncomeTax"
            :warning-message="warnings.localIncomeTax"
            help-tooltip="소득세의 10%"
            :help-text="infos.localIncomeTax"
            @update:model-value="(value) => handleUpdate('localIncomeTax', value)"
            @focus="(fieldId) => $emit('field-focus', fieldId)"
            @help-click="(fieldId) => $emit('help-click', fieldId)"
          />
        </div>
      </div>

      <!-- 세금 소계 -->
      <div class="mt-3 p-2 bg-light rounded">
        <div class="d-flex justify-content-between align-items-center small">
          <span class="text-muted">세금 합계</span>
          <strong>{{ formatCurrency(totalTax) }}원</strong>
        </div>
      </div>
    </div>

    <!-- 기타 공제 -->
    <div class="subsection">
      <h6 class="subsection-title mb-3">
        <i class="bi bi-dash me-1"></i>
        기타 공제
      </h6>
      
      <div class="row">
        <!-- 가불금 -->
        <div class="col-md-6 col-lg-4">
          <BaseInput
            v-model="formData.advancePayment"
            field-id="advancePayment"
            label="가불금"
            :error-message="errors.advancePayment"
            help-tooltip="미리 받은 급여"
            placeholder="0"
            @update:model-value="(value) => handleUpdate('advancePayment', value)"
            @focus="(fieldId) => $emit('field-focus', fieldId)"
            @help-click="(fieldId) => $emit('help-click', fieldId)"
          />
        </div>

        <!-- 대출상환 -->
        <div class="col-md-6 col-lg-4">
          <BaseInput
            v-model="formData.loanRepayment"
            field-id="loanRepayment"
            label="대출상환"
            :error-message="errors.loanRepayment"
            help-tooltip="회사 대출금 상환액"
            placeholder="0"
            @update:model-value="(value) => handleUpdate('loanRepayment', value)"
            @focus="(fieldId) => $emit('field-focus', fieldId)"
            @help-click="(fieldId) => $emit('help-click', fieldId)"
          />
        </div>

        <!-- 기타공제 -->
        <div class="col-md-6 col-lg-4">
          <BaseInput
            v-model="formData.otherDeduction"
            field-id="otherDeduction"
            label="기타공제"
            :error-message="errors.otherDeduction"
            help-tooltip="그 외 공제 항목"
            placeholder="0"
            @update:model-value="(value) => handleUpdate('otherDeduction', value)"
            @focus="(fieldId) => $emit('field-focus', fieldId)"
            @help-click="(fieldId) => $emit('help-click', fieldId)"
          />
        </div>
      </div>
    </div>

    <!-- 공제액 소계 -->
    <div class="mt-4 p-3 bg-light rounded">
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-muted">
          <i class="bi bi-calculator me-1"></i>
          공제액 소계
        </span>
        <strong class="text-danger fs-5">
          {{ formatCurrency(totalDeduction) }}원
        </strong>
      </div>
      <div class="mt-2 small text-muted">
        <div class="row">
          <div class="col-6">
            <i class="bi bi-shield-check me-1"></i>
            4대보험: {{ formatCurrency(totalInsurance) }}원
          </div>
          <div class="col-6">
            <i class="bi bi-receipt me-1"></i>
            세금: {{ formatCurrency(totalTax) }}원
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'DeductionSection',
  
  components: {
    BaseInput
  },
  
  props: {
    formData: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      default: () => ({})
    },
    warnings: {
      type: Object,
      default: () => ({})
    },
    infos: {
      type: Object,
      default: () => ({})
    }
  },
  
  emits: ['update', 'field-focus', 'help-click'],
  
  setup(props, { emit }) {
    // 4대보험 합계
    const totalInsurance = computed(() => {
      return (props.formData.nationalPension || 0) +
             (props.formData.healthInsurance || 0) +
             (props.formData.longTermCare || 0) +
             (props.formData.employmentInsurance || 0)
    })
    
    // 세금 합계
    const totalTax = computed(() => {
      return (props.formData.incomeTax || 0) +
             (props.formData.localIncomeTax || 0)
    })
    
    // 기타공제 합계
    const totalOther = computed(() => {
      return (props.formData.advancePayment || 0) +
             (props.formData.loanRepayment || 0) +
             (props.formData.otherDeduction || 0)
    })
    
    // 전체 공제액 합계
    const totalDeduction = computed(() => {
      return totalInsurance.value + totalTax.value + totalOther.value
    })
    
    // 필드 업데이트
    const handleUpdate = (fieldId, value) => {
      emit('update', fieldId, value)
    }
    
    return {
      totalInsurance,
      totalTax,
      totalOther,
      totalDeduction,
      formatCurrency,
      handleUpdate
    }
  }
}
</script>

<style scoped>
.deduction-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.subsection {
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  background: #fafbfc;
}

.subsection-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
}

/* 반응형 그리드 조정 */
@media (max-width: 992px) {
  .col-lg-3,
  .col-lg-4 {
    margin-bottom: 0.5rem;
  }
}

/* 애니메이션 */
.bg-light {
  transition: all 0.3s ease;
}

.bg-light:hover {
  background-color: #e9ecef !important;
}

.subsection {
  transition: box-shadow 0.3s ease;
}

.subsection:hover {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>