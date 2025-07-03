<!-- src/components/form/IncomeSection.vue -->
<template>
  <div class="income-section">
    <h6 class="section-title text-success mb-3">
      <i class="bi bi-plus-circle me-2"></i>
      지급 항목
      <small class="text-muted ms-2">(급여로 받는 항목)</small>
    </h6>

    <div class="row">
      <!-- 기본급 -->
      <div class="col-md-6 col-lg-4">
        <BaseInput
          v-model="formData.basicSalary"
          field-id="basicSalary"
          label="기본급"
          :required="true"
          :error-message="errors.basicSalary"
          help-tooltip="근로계약서에 명시된 기본 급여"
          @update:model-value="(value) => handleUpdate('basicSalary', value)"
          @focus="(fieldId) => $emit('field-focus', fieldId)"
          @help-click="(fieldId) => $emit('help-click', fieldId)"
        />
      </div>

      <!-- 시간외수당 -->
      <div class="col-md-6 col-lg-4">
        <BaseInput
          v-model="formData.overtimePay"
          field-id="overtimePay"
          label="시간외수당"
          :error-message="errors.overtimePay"
          help-tooltip="연장, 야간, 휴일 근로 수당"
          @update:model-value="(value) => handleUpdate('overtimePay', value)"
          @focus="(fieldId) => $emit('field-focus', fieldId)"
          @help-click="(fieldId) => $emit('help-click', fieldId)"
        />
      </div>

      <!-- 상여금 -->
      <div class="col-md-6 col-lg-4">
        <BaseInput
          v-model="formData.bonus"
          field-id="bonus"
          label="상여금"
          :error-message="errors.bonus"
          :warning-message="warnings.bonus"
          help-tooltip="정기상여, 성과급 등"
          @update:model-value="(value) => handleUpdate('bonus', value)"
          @focus="(fieldId) => $emit('field-focus', fieldId)"
          @help-click="(fieldId) => $emit('help-click', fieldId)"
        />
      </div>

      <!-- 식대 -->
      <div class="col-md-6 col-lg-4">
        <BaseInput
          v-model="formData.mealAllowance"
          field-id="mealAllowance"
          label="식대"
          :tax-free-info="true"
          :tax-free-limit="200000"
          :error-message="errors.mealAllowance"
          :warning-message="warnings.mealAllowance"
          help-tooltip="식사 보조비 (월 20만원까지 비과세)"
          @update:model-value="(value) => handleUpdate('mealAllowance', value)"
          @focus="(fieldId) => $emit('field-focus', fieldId)"
          @help-click="(fieldId) => $emit('help-click', fieldId)"
        >
          <template v-if="formData.mealAllowance > 200000" #help-text>
            <small class="text-warning">
              <i class="bi bi-exclamation-triangle me-1"></i>
              20만원 초과분 {{ formatCurrency(formData.mealAllowance - 200000) }}원은 과세 대상입니다.
            </small>
          </template>
        </BaseInput>
      </div>

      <!-- 교통비 -->
      <div class="col-md-6 col-lg-4">
        <BaseInput
          v-model="formData.transportAllowance"
          field-id="transportAllowance"
          label="교통비"
          :error-message="errors.transportAllowance"
          help-tooltip="출퇴근 교통비 지원"
          @update:model-value="(value) => handleUpdate('transportAllowance', value)"
          @focus="(fieldId) => $emit('field-focus', fieldId)"
          @help-click="(fieldId) => $emit('help-click', fieldId)"
        />
      </div>

      <!-- 차량유지비 -->
      <div class="col-md-6 col-lg-4">
        <BaseInput
          v-model="formData.carAllowance"
          field-id="carAllowance"
          label="차량유지비"
          :tax-free-info="true"
          :tax-free-limit="200000"
          :error-message="errors.carAllowance"
          :warning-message="warnings.carAllowance"
          help-tooltip="자가용 업무 사용 시 (월 20만원까지 비과세)"
          help-text="업무용 차량 사용이 전제 조건입니다"
          @update:model-value="(value) => handleUpdate('carAllowance', value)"
          @focus="(fieldId) => $emit('field-focus', fieldId)"
          @help-click="(fieldId) => $emit('help-click', fieldId)"
        />
      </div>

      <!-- 기타수당 -->
      <div class="col-md-6 col-lg-4">
        <BaseInput
          v-model="formData.otherAllowance"
          field-id="otherAllowance"
          label="기타수당"
          :error-message="errors.otherAllowance"
          help-tooltip="그 외 각종 수당"
          placeholder="0"
          @update:model-value="(value) => handleUpdate('otherAllowance', value)"
          @focus="(fieldId) => $emit('field-focus', fieldId)"
          @help-click="(fieldId) => $emit('help-click', fieldId)"
        />
      </div>
    </div>

    <!-- 지급액 소계 -->
    <div class="mt-3 p-3 bg-light rounded">
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-muted">
          <i class="bi bi-calculator me-1"></i>
          지급액 소계
        </span>
        <strong class="text-success fs-5">
          {{ formatCurrency(totalIncome) }}원
        </strong>
      </div>
      <div v-if="taxFreeTotal > 0" class="mt-2 small text-muted">
        <i class="bi bi-info-circle me-1"></i>
        비과세 항목: {{ formatCurrency(taxFreeTotal) }}원
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'IncomeSection',
  
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
    }
  },
  
  emits: ['update', 'field-focus', 'help-click'],
  
  setup(props, { emit }) {
    // 지급액 합계
    const totalIncome = computed(() => {
      const fields = [
        'basicSalary',
        'overtimePay',
        'bonus',
        'mealAllowance',
        'transportAllowance',
        'carAllowance',
        'otherAllowance'
      ]
      
      return fields.reduce((sum, field) => {
        return sum + (props.formData[field] || 0)
      }, 0)
    })
    
    // 비과세 합계
    const taxFreeTotal = computed(() => {
      const mealTaxFree = Math.min(props.formData.mealAllowance || 0, 200000)
      const carTaxFree = Math.min(props.formData.carAllowance || 0, 200000)
      return mealTaxFree + carTaxFree
    })
    
    // 필드 업데이트
    const handleUpdate = (fieldId, value) => {
      emit('update', fieldId, value)
    }
    
    return {
      totalIncome,
      taxFreeTotal,
      formatCurrency,
      handleUpdate
    }
  }
}
</script>

<style scoped>
.income-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

/* 반응형 그리드 조정 */
@media (max-width: 992px) {
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
</style>