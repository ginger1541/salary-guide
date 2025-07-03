// src/modules/allowance/index.js
// 각종 수당 및 급여 항목 관련 로직을 처리하는 모듈

import generalData from '@/data/explanations/ko/general.json'
import rulesData from '@/data/rules/2025/kr.json'

/**
 * 수당 정보 가져오기
 * @param {string} category - 카테고리 (income, deductions, summary)
 * @param {string} itemType - 항목 종류
 * @returns {Object} 수당 정보
 */
export const getAllowanceInfo = (category, itemType) => {
  const categoryData = generalData[category]
  if (!categoryData) return null
  
  const itemInfo = categoryData[itemType] || {}
  
  // 비과세 정보 추가
  if (category === 'income' && rulesData.commonDeductions[itemType]) {
    const taxFreeInfo = rulesData.commonDeductions[itemType]
    itemInfo.taxFree = {
      limit: taxFreeInfo.nonTaxableLimit,
      description: taxFreeInfo.description
    }
  }
  
  return {
    ...itemInfo,
    category,
    type: itemType
  }
}

/**
 * 모든 수당 항목 정보 가져오기
 * @returns {Object} 전체 수당 정보
 */
export const getAllAllowanceInfo = () => {
  const result = {
    income: {},
    deductions: {},
    summary: {}
  }
  
  Object.keys(generalData).forEach(category => {
    Object.keys(generalData[category]).forEach(itemType => {
      result[category][itemType] = getAllowanceInfo(category, itemType)
    })
  })
  
  return result
}

/**
 * 비과세 항목 정보 가져오기
 * @returns {Array} 비과세 항목 목록
 */
export const getTaxFreeItems = () => {
  const taxFreeItems = []
  
  Object.entries(rulesData.commonDeductions).forEach(([key, value]) => {
    taxFreeItems.push({
      id: key,
      name: value.name,
      limit: value.nonTaxableLimit,
      limitText: `월 ${value.nonTaxableLimit.toLocaleString()}원`,
      description: value.description,
      type: 'allowance'
    })
  })
  
  return taxFreeItems
}

/**
 * 비과세 혜택 계산
 * @param {Object} formData - 폼 데이터
 * @returns {Object} 비과세 혜택 정보
 */
export const calculateTaxFreeBenefit = (formData) => {
  const benefits = {
    items: [],
    totalAmount: 0,
    taxableReduction: 0,
    estimatedTaxSaving: 0
  }
  
  // 식대 비과세
  if (formData.mealAllowance) {
    const taxFreeAmount = Math.min(formData.mealAllowance, 200000)
    const taxableAmount = Math.max(0, formData.mealAllowance - 200000)
    
    benefits.items.push({
      name: '식대',
      totalAmount: formData.mealAllowance,
      taxFreeAmount: taxFreeAmount,
      taxableAmount: taxableAmount,
      status: taxableAmount > 0 ? 'partial' : 'full'
    })
    
    benefits.totalAmount += taxFreeAmount
  }
  
  // 차량유지비 비과세
  if (formData.carAllowance) {
    const taxFreeAmount = Math.min(formData.carAllowance, 200000)
    const taxableAmount = Math.max(0, formData.carAllowance - 200000)
    
    benefits.items.push({
      name: '차량유지비',
      totalAmount: formData.carAllowance,
      taxFreeAmount: taxFreeAmount,
      taxableAmount: taxableAmount,
      status: taxableAmount > 0 ? 'partial' : 'full',
      condition: '업무용 차량 사용 시'
    })
    
    benefits.totalAmount += taxFreeAmount
  }
  
  // 예상 세금 절감액 (간단 계산)
  // 소득세 + 지방소득세 + 4대보험료 절감 효과
  benefits.taxableReduction = benefits.totalAmount
  benefits.estimatedTaxSaving = Math.round(benefits.totalAmount * 0.2) // 약 20% 절세 효과 추정
  
  return benefits
}

/**
 * 급여 구성 분석
 * @param {Object} formData - 폼 데이터
 * @returns {Object} 급여 구성 분석 정보
 */
export const analyzeSalaryComposition = (formData) => {
  const totalIncome = Object.keys(formData)
    .filter(key => key.includes('Salary') || key.includes('Pay') || key.includes('Allowance') || key === 'bonus')
    .reduce((sum, key) => sum + (formData[key] || 0), 0)
  
  const composition = {
    totalIncome: totalIncome,
    items: [],
    ratios: {},
    insights: []
  }
  
  // 기본급 비율
  if (formData.basicSalary) {
    const ratio = (formData.basicSalary / totalIncome * 100).toFixed(1)
    composition.ratios.basicSalary = ratio
    
    if (ratio < 60) {
      composition.insights.push({
        type: 'warning',
        message: '기본급 비중이 낮습니다. 퇴직금과 시간외수당 계산에 영향을 줄 수 있습니다.',
        icon: 'bi-exclamation-triangle'
      })
    }
  }
  
  // 고정급 vs 변동급 분석
  const fixedIncome = (formData.basicSalary || 0) + (formData.mealAllowance || 0) + (formData.carAllowance || 0)
  const variableIncome = (formData.overtimePay || 0) + (formData.bonus || 0)
  
  composition.fixedRatio = totalIncome > 0 ? (fixedIncome / totalIncome * 100).toFixed(1) : 0
  composition.variableRatio = totalIncome > 0 ? (variableIncome / totalIncome * 100).toFixed(1) : 0
  
  if (composition.variableRatio > 40) {
    composition.insights.push({
      type: 'info',
      message: '변동급 비중이 높습니다. 월별 실수령액 변동이 클 수 있습니다.',
      icon: 'bi-info-circle'
    })
  }
  
  return composition
}

/**
 * 급여 관련 용어 설명
 * @param {string} term - 용어
 * @returns {Object} 용어 설명
 */
export const getTermExplanation = (term) => {
  const terms = {
    grossPay: {
      term: '지급액계',
      definition: '세금과 보험료를 공제하기 전의 총 지급액',
      includes: ['기본급', '각종 수당', '상여금'],
      relatedTerms: ['총급여', '세전급여']
    },
    netPay: {
      term: '실수령액',
      definition: '모든 공제를 마친 후 실제로 받는 금액',
      calculation: '지급액계 - 공제액계',
      relatedTerms: ['세후급여', '실지급액', '차인지급액']
    },
    taxableIncome: {
      term: '과세소득',
      definition: '세금이 부과되는 소득',
      calculation: '총급여 - 비과세소득',
      examples: ['기본급', '상여금', '시간외수당']
    },
    nonTaxableIncome: {
      term: '비과세소득',
      definition: '세금이 부과되지 않는 소득',
      examples: ['식대 20만원 이하', '차량유지비 20만원 이하', '육아수당 20만원 이하'],
      benefit: '소득세, 지방소득세, 4대보험료 절감'
    },
    ordinaryWage: {
      term: '통상임금',
      definition: '정기적, 일률적, 고정적으로 지급되는 임금',
      usage: ['시간외수당 계산 기준', '연차수당 계산 기준'],
      includes: ['기본급', '고정수당']
    },
    averageWage: {
      term: '평균임금',
      definition: '퇴직 전 3개월간 받은 임금의 총액 ÷ 3개월의 총일수',
      usage: ['퇴직금 계산 기준', '휴업수당 계산 기준'],
      includes: ['기본급', '수당', '상여금 등 모든 금품']
    }
  }
  
  return terms[term] || null
}

/**
 * 수당 관련 팁 제공
 * @param {Object} formData - 폼 데이터
 * @returns {Array} 팁 목록
 */
export const getAllowanceTips = (formData) => {
  const tips = []
  
  // 시간외수당 관련
  if (formData.overtimePay > formData.basicSalary * 0.5) {
    tips.push({
      type: 'overtimePay',
      icon: 'bi-clock-history',
      title: '과도한 시간외근무',
      message: '시간외수당이 기본급의 50%를 초과합니다. 워라밸을 점검해보세요.',
      level: 'warning'
    })
  }
  
  // 상여금 관련
  if (formData.bonus > 0) {
    tips.push({
      type: 'bonus',
      icon: 'bi-gift',
      title: '상여금 과세',
      message: '상여금은 전액 과세 대상입니다. 연말정산 시 세액이 추가될 수 있습니다.',
      level: 'info'
    })
  }
  
  return tips
}

// 기본 내보내기
export default {
  getAllowanceInfo,
  getAllAllowanceInfo,
  getTaxFreeItems,
  calculateTaxFreeBenefit,
  analyzeSalaryComposition,
  getTermExplanation,
  getAllowanceTips
}