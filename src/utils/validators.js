// src/utils/validators.js
// 입력값 검증을 위한 유틸리티 함수들

/**
 * 숫자 유효성 검사
 * @param {*} value - 검사할 값
 * @returns {boolean} 유효한 숫자인지 여부
 */
export const isValidNumber = (value) => {
  if (value === '' || value === null || value === undefined) return false
  const num = Number(value)
  return !isNaN(num) && isFinite(num)
}

/**
 * 양수 검사
 * @param {*} value - 검사할 값
 * @returns {boolean} 양수인지 여부
 */
export const isPositiveNumber = (value) => {
  return isValidNumber(value) && Number(value) >= 0
}

/**
 * 금액 범위 검사
 * @param {number} value - 검사할 금액
 * @param {number} min - 최소값
 * @param {number} max - 최대값
 * @returns {boolean} 범위 내에 있는지 여부
 */
export const isInRange = (value, min = 0, max = Infinity) => {
  const num = Number(value)
  return isValidNumber(value) && num >= min && num <= max
}

/**
 * 급여 항목별 유효성 검사 규칙
 */
export const validationRules = {
  // 기본급 검증
  basicSalary: {
    validate: (value) => {
      if (!value || value === 0) return { valid: false, message: '기본급은 필수 입력 항목입니다' }
      if (!isPositiveNumber(value)) return { valid: false, message: '올바른 금액을 입력해주세요' }
      if (value < 2060740) return { valid: false, message: '2025년 최저임금(월 2,060,740원) 이상이어야 합니다' }
      if (value > 100000000) return { valid: false, message: '1억원을 초과할 수 없습니다' }
      return { valid: true }
    }
  },
  
  // 식대 검증
  mealAllowance: {
    validate: (value) => {
      if (!isPositiveNumber(value) && value !== 0 && value !== '') return { valid: false, message: '올바른 금액을 입력해주세요' }
      if (value > 200000) {
        return { 
          valid: true, 
          warning: '월 20만원을 초과하는 금액은 과세 대상입니다' 
        }
      }
      return { valid: true }
    }
  },
  
  // 차량유지비 검증
  carAllowance: {
    validate: (value) => {
      if (!isPositiveNumber(value) && value !== 0 && value !== '') return { valid: false, message: '올바른 금액을 입력해주세요' }
      if (value > 200000) {
        return { 
          valid: true, 
          warning: '월 20만원을 초과하는 금액은 과세 대상입니다' 
        }
      }
      return { valid: true }
    }
  },
  
  // 4대보험 검증
  nationalPension: {
    validate: (value, formData) => {
      if (!isPositiveNumber(value) && value !== 0) return { valid: false, message: '올바른 금액을 입력해주세요' }
      
      // 대략적인 검증 (정확한 계산이 아닌 범위 확인)
      const expectedMin = formData.basicSalary * 0.04
      const expectedMax = formData.basicSalary * 0.05
      
      if (value > 0 && (value < expectedMin || value > expectedMax)) {
        return {
          valid: true,
          info: '입력하신 국민연금 금액을 확인해주세요. 일반적으로 기본급의 4.5% 수준입니다.'
        }
      }
      return { valid: true }
    }
  },
  
  // 건강보험 검증
  healthInsurance: {
    validate: (value, formData) => {
      if (!isPositiveNumber(value) && value !== 0) return { valid: false, message: '올바른 금액을 입력해주세요' }
      
      // 보수월액 추정 (기본급 + 고정수당)
      const estimatedMonthlyPay = (formData.basicSalary || 0) + 
                                  (formData.overtimePay || 0) + 
                                  (formData.bonus || 0) / 12 // 상여금은 연간 기준으로 분할
      
      const expectedMin = estimatedMonthlyPay * 0.03
      const expectedMax = estimatedMonthlyPay * 0.04
      
      if (value > 0 && (value < expectedMin || value > expectedMax)) {
        return {
          valid: true,
          info: '입력하신 건강보험 금액을 확인해주세요. 일반적으로 보수월액의 3.545% 수준입니다.'
        }
      }
      return { valid: true }
    }
  },
  
  // 장기요양보험 검증
  longTermCare: {
    validate: (value, formData) => {
      if (!isPositiveNumber(value) && value !== 0) return { valid: false, message: '올바른 금액을 입력해주세요' }
      
      const healthInsurance = formData.healthInsurance || 0
      const expected = Math.round(healthInsurance * 0.1227)
      
      if (value > 0 && Math.abs(value - expected) > 100) {
        return {
          valid: true,
          info: `장기요양보험료는 건강보험료의 12.27%입니다. 예상 금액: ${expected.toLocaleString()}원`
        }
      }
      return { valid: true }
    }
  },
  
  // 소득세 검증
  incomeTax: {
    validate: (value) => {
      if (!isPositiveNumber(value) && value !== 0) return { valid: false, message: '올바른 금액을 입력해주세요' }
      return { valid: true }
    }
  },
  
  // 지방소득세 검증
  localIncomeTax: {
    validate: (value, formData) => {
      if (!isPositiveNumber(value) && value !== 0) return { valid: false, message: '올바른 금액을 입력해주세요' }
      
      const incomeTax = formData.incomeTax || 0
      const expected = Math.round(incomeTax * 0.1)
      
      if (value > 0 && Math.abs(value - expected) > 10) {
        return {
          valid: true,
          info: `지방소득세는 소득세의 10%입니다. 예상 금액: ${expected.toLocaleString()}원`
        }
      }
      return { valid: true }
    }
  }
}

/**
 * 폼 전체 유효성 검사
 * @param {Object} formData - 폼 데이터
 * @returns {Object} 유효성 검사 결과
 */
export const validateForm = (formData) => {
  const errors = {}
  const warnings = {}
  const infos = {}
  
  // 각 필드별 검증
  Object.keys(validationRules).forEach(fieldId => {
    const rule = validationRules[fieldId]
    const value = formData[fieldId]
    
    if (rule && rule.validate) {
      const result = rule.validate(value, formData)
      
      if (!result.valid) {
        errors[fieldId] = result.message
      }
      if (result.warning) {
        warnings[fieldId] = result.warning
      }
      if (result.info) {
        infos[fieldId] = result.info
      }
    }
  })
  
  // 전체 검증 결과
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    infos
  }
}

/**
 * 실시간 입력 검증 (숫자만 허용)
 * @param {Event} event - 입력 이벤트
 * @returns {boolean} 입력 허용 여부
 */
export const validateNumberInput = (event) => {
  const char = String.fromCharCode(event.which || event.keyCode)
  const value = event.target.value
  
  // 백스페이스, 탭, 엔터, 화살표 키 등은 허용
  const allowedKeys = [8, 9, 13, 37, 38, 39, 40, 46]
  if (allowedKeys.includes(event.keyCode)) {
    return true
  }
  
  // 숫자가 아닌 경우 차단
  if (!/[0-9]/.test(char)) {
    event.preventDefault()
    return false
  }
  
  // 첫 자리 0 입력 방지 (0원은 허용)
  if (value === '0' && char !== '0') {
    event.target.value = char
    event.preventDefault()
    return false
  }
  
  return true
}

/**
 * 입력값 포맷 정리 (숫자만 추출)
 * @param {string} value - 입력값
 * @returns {number} 숫자값
 */
export const cleanNumberValue = (value) => {
  if (!value) return 0
  
  // 문자열에서 숫자만 추출
  const cleaned = String(value).replace(/[^0-9]/g, '')
  return cleaned ? parseInt(cleaned, 10) : 0
}