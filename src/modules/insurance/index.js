// src/modules/insurance/index.js
// 4대 보험 관련 로직을 처리하는 모듈

import insuranceData from '@/data/explanations/ko/insurance.json'
import rulesData from '@/data/rules/2025/kr.json'

/**
 * 보험 정보 가져오기
 * @param {string} insuranceType - 보험 종류 (nationalPension, healthInsurance 등)
 * @returns {Object} 보험 정보
 */
export const getInsuranceInfo = (insuranceType) => {
  const explanation = insuranceData[insuranceType] || {}
  const rule = rulesData.insuranceRates[insuranceType] || {}
  
  return {
    ...explanation,
    ...rule,
    type: insuranceType
  }
}

/**
 * 모든 보험 정보 가져오기
 * @returns {Object} 전체 보험 정보
 */
export const getAllInsuranceInfo = () => {
  const insuranceTypes = ['nationalPension', 'healthInsurance', 'longTermCare', 'employmentInsurance']
  const result = {}
  
  insuranceTypes.forEach(type => {
    result[type] = getInsuranceInfo(type)
  })
  
  return result
}

/**
 * 보험료 계산 정보 제공 (실제 계산이 아닌 설명용)
 * @param {string} insuranceType - 보험 종류
 * @param {number} amount - 입력된 보험료
 * @param {Object} formData - 전체 폼 데이터
 * @returns {Object} 계산 설명 정보
 */
export const getCalculationExplanation = (insuranceType, amount, formData = {}) => {
  const rule = rulesData.insuranceRates[insuranceType]
  if (!rule) return null
  
  const explanations = {
    nationalPension: {
      getExplanation: (amount, formData) => {
        const basicSalary = formData.basicSalary || 0
        const estimatedBase = Math.round(amount / 0.045)
        
        return {
          formula: '국민연금보험료 = 기준소득월액 × 4.5%',
          rate: '4.5% (근로자 부담분)',
          estimatedBase: estimatedBase,
          estimatedBaseText: `약 ${estimatedBase.toLocaleString()}원`,
          note: rule.maxBase ? `상한액: ${rule.maxBase.toLocaleString()}원, 하한액: ${rule.minBase.toLocaleString()}원` : '',
          detail: '기준소득월액은 비과세 소득을 제외한 월 평균 소득입니다.'
        }
      }
    },
    
    healthInsurance: {
      getExplanation: (amount, formData) => {
        const estimatedBase = Math.round(amount / 0.03545)
        
        return {
          formula: '건강보험료 = 보수월액 × 3.545%',
          rate: '3.545% (근로자 부담분)',
          estimatedBase: estimatedBase,
          estimatedBaseText: `약 ${estimatedBase.toLocaleString()}원`,
          note: '보수월액 = 기본급 + 고정수당 (비과세 제외)',
          detail: '매년 3월 정산하여 7월부터 다음해 6월까지 적용됩니다.'
        }
      }
    },
    
    longTermCare: {
      getExplanation: (amount, formData) => {
        const healthInsurance = formData.healthInsurance || 0
        const expectedAmount = Math.round(healthInsurance * 0.1227)
        
        return {
          formula: '장기요양보험료 = 건강보험료 × 12.27%',
          rate: '12.27% (2025년 기준)',
          baseAmount: healthInsurance,
          baseAmountText: `건강보험료 ${healthInsurance.toLocaleString()}원`,
          expectedAmount: expectedAmount,
          expectedAmountText: `예상 금액: ${expectedAmount.toLocaleString()}원`,
          detail: '건강보험 가입자는 자동으로 장기요양보험에 가입됩니다.'
        }
      }
    },
    
    employmentInsurance: {
      getExplanation: (amount, formData) => {
        const estimatedBase = Math.round(amount / 0.009)
        
        return {
          formula: '고용보험료 = 월 급여 × 0.9%',
          rate: '0.9% (근로자 부담분)',
          estimatedBase: estimatedBase,
          estimatedBaseText: `약 ${estimatedBase.toLocaleString()}원`,
          note: '사업주는 0.9% + 고용안정·직업능력개발사업 보험료 추가 부담',
          detail: '실업급여, 육아휴직급여 등의 재원이 됩니다.'
        }
      }
    }
  }
  
  const explanation = explanations[insuranceType]
  if (explanation && explanation.getExplanation) {
    return explanation.getExplanation(amount, formData)
  }
  
  return null
}

/**
 * 보험 관련 FAQ 가져오기
 * @param {string} insuranceType - 보험 종류
 * @returns {Array} FAQ 목록
 */
export const getInsuranceFAQ = (insuranceType) => {
  const info = insuranceData[insuranceType]
  return info?.faq || []
}

/**
 * 보험 관련 팁 제공
 * @param {Object} formData - 폼 데이터
 * @returns {Array} 팁 목록
 */
export const getInsuranceTips = (formData) => {
  const tips = []
  
  // 국민연금 관련 팁
  if (formData.nationalPension) {
    const estimatedMonthlyIncome = Math.round(formData.nationalPension / 0.045)
    if (estimatedMonthlyIncome >= 5900000) {
      tips.push({
        type: 'nationalPension',
        icon: 'bi-info-circle',
        message: '국민연금 상한액이 적용되고 있습니다. 월 소득이 590만원을 초과해도 보험료는 동일합니다.',
        level: 'info'
      })
    }
  }
  
  // 건강보험 관련 팁
  if (formData.healthInsurance && formData.longTermCare) {
    const expectedLongTermCare = Math.round(formData.healthInsurance * 0.1227)
    if (Math.abs(formData.longTermCare - expectedLongTermCare) > 100) {
      tips.push({
        type: 'longTermCare',
        icon: 'bi-exclamation-triangle',
        message: '장기요양보험료가 예상 금액과 차이가 있습니다. 건강보험료의 12.27%가 맞는지 확인해보세요.',
        level: 'warning'
      })
    }
  }
  
  // 식대 비과세 관련 팁
  if (formData.mealAllowance > 200000) {
    tips.push({
      type: 'mealAllowance',
      icon: 'bi-lightbulb',
      message: '식대가 월 20만원을 초과합니다. 초과분은 과세 대상이므로 건강보험료 산정에 포함됩니다.',
      level: 'info'
    })
  }
  
  return tips
}

/**
 * 보험 관련 외부 링크 정보
 * @returns {Object} 링크 정보
 */
export const getInsuranceLinks = () => {
  return {
    nationalPension: {
      name: '국민연금공단',
      url: 'https://www.nps.or.kr',
      tel: '국번없이 1355',
      services: ['가입내역 조회', '예상연금액 조회', '보험료 납부확인']
    },
    healthInsurance: {
      name: '국민건강보험공단',
      url: 'https://www.nhis.or.kr',
      tel: '1577-1000',
      services: ['보험료 조회', '건강검진 예약', '피부양자 등록']
    },
    employmentInsurance: {
      name: '고용보험',
      url: 'https://www.ei.go.kr',
      tel: '1350',
      services: ['실업급여 신청', '육아휴직급여', '고용보험 가입이력']
    }
  }
}

// 기본 내보내기
export default {
  getInsuranceInfo,
  getAllInsuranceInfo,
  getCalculationExplanation,
  getInsuranceFAQ,
  getInsuranceTips,
  getInsuranceLinks
}