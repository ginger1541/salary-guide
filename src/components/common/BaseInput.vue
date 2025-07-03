<!-- src/components/common/BaseInput.vue -->
<template>
  <div class="base-input" :class="{ 'has-error': hasError, 'is-focused': isFocused }">
    <!-- 라벨 -->
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
      <span v-if="taxFreeInfo" class="badge bg-success ms-1">
        비과세 {{ formatCurrency(taxFreeLimit) }}까지
      </span>
    </label>
    
    <!-- 입력 그룹 -->
    <div class="input-group" :class="size ? `input-group-${size}` : ''">
      <!-- 접두사 (₩) -->
      <span v-if="prefix" class="input-group-text">{{ prefix }}</span>
      
      <!-- 입력 필드 -->
      <input
        :id="inputId"
        ref="input"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': hasError }"
        :value="formattedValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keypress="validateKeypress"
      />
      
      <!-- 도움말 버튼 -->
      <button
        v-if="showHelpButton"
        type="button"
        class="btn btn-outline-secondary"
        :class="{ 'btn-sm': size === 'sm' }"
        @click="$emit('help-click', fieldId)"
        :data-bs-toggle="tooltip"
        :data-bs-placement="tooltipPlacement"
        :title="helpTooltip"
      >
        <i class="bi bi-question-circle"></i>
      </button>
      
      <!-- 접미사 -->
      <span v-if="suffix" class="input-group-text">{{ suffix }}</span>
    </div>
    
    <!-- 도움말 텍스트 -->
    <div v-if="helpText && !hasError" class="form-text">
      <i class="bi bi-info-circle me-1"></i>
      {{ helpText }}
    </div>
    
    <!-- 에러 메시지 -->
    <div v-if="hasError" class="invalid-feedback d-block">
      <i class="bi bi-exclamation-circle me-1"></i>
      {{ errorMessage }}
    </div>
    
    <!-- 경고 메시지 -->
    <div v-if="warningMessage && !hasError" class="text-warning small mt-1">
      <i class="bi bi-exclamation-triangle me-1"></i>
      {{ warningMessage }}
    </div>
  </div>
</template>

<script>
import { formatCurrency, removeThousandSeparator, formatInputValue } from '@/utils/formatters'
import { isValidNumber, cleanNumberValue } from '@/utils/validators'

export default {
  name: 'BaseInput',
  
  props: {
    // 필수 props
    modelValue: {
      type: [String, Number],
      default: ''
    },
    fieldId: {
      type: String,
      required: true
    },
    
    // 라벨 관련
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    
    // 입력 필드 옵션
    placeholder: {
      type: String,
      default: '0'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    
    // 스타일 관련
    size: {
      type: String,
      default: '',
      validator: (value) => ['', 'sm', 'lg'].includes(value)
    },
    prefix: {
      type: String,
      default: '₩'
    },
    suffix: {
      type: String,
      default: ''
    },
    
    // 도움말 관련
    showHelpButton: {
      type: Boolean,
      default: true
    },
    helpTooltip: {
      type: String,
      default: '자세한 설명 보기'
    },
    tooltipPlacement: {
      type: String,
      default: 'top'
    },
    helpText: {
      type: String,
      default: ''
    },
    
    // 검증 관련
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Infinity
    },
    errorMessage: {
      type: String,
      default: ''
    },
    warningMessage: {
      type: String,
      default: ''
    },
    
    // 비과세 정보
    taxFreeInfo: {
      type: Boolean,
      default: false
    },
    taxFreeLimit: {
      type: Number,
      default: 0
    }
  },
  
  emits: ['update:modelValue', 'focus', 'blur', 'help-click', 'change'],
  
  data() {
    return {
      isFocused: false,
      internalValue: ''
    }
  },
  
  computed: {
    inputId() {
      return `input-${this.fieldId}`
    },
    
    formattedValue() {
      if (this.isFocused) {
        return this.internalValue
      }
      
      const numValue = this.numericValue
      return numValue ? formatCurrency(numValue) : ''
    },
    
    numericValue() {
      return cleanNumberValue(this.modelValue)
    },
    
    hasError() {
      return !!this.errorMessage
    }
  },
  
  watch: {
    modelValue: {
      immediate: true,
      handler(newVal) {
        this.internalValue = newVal ? String(newVal) : ''
      }
    }
  },
  
  methods: {
    formatCurrency,
    
    handleInput(event) {
      const rawValue = event.target.value
      const cleanedValue = removeThousandSeparator(rawValue)
      
      // 숫자만 허용
      if (!/^\d*$/.test(cleanedValue)) {
        event.target.value = this.internalValue
        return
      }
      
      this.internalValue = cleanedValue
      const numValue = cleanedValue ? parseInt(cleanedValue, 10) : 0
      
      // 범위 검증
      if (numValue < this.min || numValue > this.max) {
        return
      }
      
      this.$emit('update:modelValue', numValue)
      this.$emit('change', numValue)
    },
    
    handleFocus() {
      this.isFocused = true
      this.$emit('focus', this.fieldId)
      
      // 포커스 시 전체 선택
      this.$nextTick(() => {
        this.$refs.input.select()
      })
    },
    
    handleBlur() {
      this.isFocused = false
      this.$emit('blur', this.fieldId)
    },
    
    validateKeypress(event) {
      const char = String.fromCharCode(event.which || event.keyCode)
      
      // 숫자가 아닌 경우 입력 차단
      if (!/[0-9]/.test(char)) {
        event.preventDefault()
        return false
      }
      
      // 첫 자리 0 방지 (0원은 허용)
      if (this.internalValue === '0' && char !== '0') {
        this.internalValue = char
        event.preventDefault()
        return false
      }
    },
    
    focus() {
      this.$refs.input.focus()
    },
    
    clear() {
      this.internalValue = ''
      this.$emit('update:modelValue', 0)
    }
  }
}
</script>

<style scoped>
.base-input {
  margin-bottom: 1rem;
}

.base-input.is-focused .input-group {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.base-input.has-error .form-label {
  color: #dc3545;
}

.form-label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.form-label .badge {
  font-size: 0.7rem;
  font-weight: normal;
}

.input-group-text {
  background-color: #f8f9fa;
}

.form-control {
  text-align: right;
  font-family: 'Courier New', monospace;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: none;
}

.btn-outline-secondary {
  border-color: #dee2e6;
}

.btn-outline-secondary:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
}

.form-text {
  font-size: 0.75rem;
  color: #6c757d;
}

.invalid-feedback {
  font-size: 0.75rem;
}

/* 애니메이션 */
.base-input {
  transition: all 0.2s ease;
}

.base-input.is-focused {
  transform: translateY(-1px);
}

/* 반응형 */
@media (max-width: 576px) {
  .form-control {
    font-size: 16px; /* iOS 줌 방지 */
  }
}
</style>