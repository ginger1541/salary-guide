// src/modules/tax/index.js
// 세금 관련 로직을 처리하는 모듈

import taxData from '@/data/explanations/ko/tax.json'
import rulesData from '@/data/rules/2025/kr.json'

/**
 * 세금 정보 가져오기
 * @param {string} taxType - 세금 종류 (incomeTax, localIncomeTax)
 * @returns {Object} 세금 정보
 */
export const getTaxInfo = (taxType) => {
  const explanation = taxData[taxType] || {}
  const rule = taxType === 'incomeTax' 
    ? rulesData.incomeTaxRates 
    : { rate: rulesData.incomeTaxRates.localIncomeTaxRate }
  
  return {
    ...explanation,
    ...rule,
    type: taxType
  }
}

/**
 * 소득세 구간 정보 제공
 * @param {number} annualIncome - 연간 소득
 * @returns {Object} 해당 구간 정보
 */
export const getTaxBracketInfo = (annualIncome) => {
  const brackets = rulesData.incomeTaxRates.brackets
  
  for (const bracket of brackets) {
    if (annualIncome >= bracket.min && (bracket.max === null || annualIncome <= bracket.max)) {
      return {
        ...bracket,
        ratePercent: (bracket.rate * 100).toFixed(0) + '%',
        description: getTaxBracketDescription(bracket)
      }
    }
  }
  
  return null
}

/**
 * 세금 구간별 설명 생성
 * @param {Object} bracket - 세금 구간 정보
 * @returns {string} 구간 설명
 */
const getTaxBracketDescription = (bracket) => {
  const min = bracket.min.toLocaleString()
  const max = bracket.max ? bracket.max.toLocaleString() : null
  const rate = (bracket.rate * 100).toFixed(0)
  
  if (bracket.min === 0) {
    return `${max}원 이하: ${rate}%`
  } else if (bracket.max === null) {
    return `${min}원 초과: ${rate}%`
  } else {
    return `${min}원 초과 ~ ${max}원 이하: ${rate}%`
  }
}

/**
 * 세금 계산 설명 제공
 * @param {string} taxType - 세금 종류
 * @param {number} amount - 입력된 세금액
 * @param {Object} formData - 전체 폼 데이터
 * @returns {Object} 계산 설명 정보
 */
export const getTaxCalculationExplanation = (taxType, amount, formData = {}) => {
  if (taxType === 'incomeTax') {
    // 월 소득세로부터 연간 과세소득 추정
    const monthlyTax = amount
    const totalIncome = (formData.basicSalary || 0) + 
                       (formData.overtimePay || 0) + 
                       (formData.bonus || 0) + 
                       (formData.otherAllowance || 0)
    
    // 비과세 항목 계산
    const mealAllowance = Math.min(formData.mealAllowance || 0, 200000)
    const carAllowance = Math.min(formData.carAllowance || 0, 200000)
    const nonTaxable = mealAllowance + carAllowance
    
    const taxableMonthlyIncome = totalIncome - nonTaxable
    const estimatedAnnualIncome = taxableMonthlyIncome * 12
    
    // 해당 소득세 구간 찾기
    const bracketInfo = getTaxBracketInfo(estimatedAnnualIncome)
    
    return {
      monthlyIncome: totalIncome,
      monthlyIncomeText: `월 총소득: ${totalIncome.toLocaleString()}원`,
      nonTaxable: nonTaxable,
      nonTaxableText: `비과세: ${nonTaxable.toLocaleString()}원`,
      taxableMonthlyIncome: taxableMonthlyIncome,
      taxableMonthlyIncomeText: `과세소득: ${taxableMonthlyIncome.toLocaleString()}원`,
      estimatedAnnualIncome: estimatedAnnualIncome,
      estimatedAnnualIncomeText: `연간 추정: ${estimatedAnnualIncome.toLocaleString()}원`,
      taxBracket: bracketInfo,
      note: '실제 세액은 소득공제, 세액공제, 부양가족 수 등에 따라 달라집니다.',
      detail: '매월 원천징수되는 세금은 간이세액표 기준이며, 연말정산에서 최종 확정됩니다.'
    }
  } else if (taxType === 'localIncomeTax') {
    const incomeTax = formData.incomeTax || 0
    const expectedAmount = Math.round(incomeTax * 0.1)
    
    return {
      formula: '지방소득세 = 소득세 × 10%',
      rate: '10%',
      baseAmount: incomeTax,
      baseAmountText: `소득세 ${incomeTax.toLocaleString()}원`,
      expectedAmount: expectedAmount,
      expectedAmountText: `예상 금액: ${expectedAmount.toLocaleString()}원`,
      detail: '지방소득세는 거주 지역의 지방자치단체 재원으로 사용됩니다.'
    }
  }
  
  return null
}

/**
 * 세금 관련 FAQ 가져오기
 * @param {string} taxType - 세금 종류
 * @returns {Array} FAQ 목록
 */
export const getTaxFAQ = (taxType) => {
  const info = taxData[taxType]
  return info?.faq || []
}

/**
 * 세금 절감 팁 제공
 * @param {Object} formData - 폼 데이터
 * @returns {Array} 팁 목록
 */
export const getTaxSavingTips = (formData) => {
  const tips = []
  
  // 식대 비과세 활용 팁
  if (!formData.mealAllowance || formData.mealAllowance < 200000) {
    tips.push({
      type: 'mealAllowance',
      icon: 'bi-lightbulb',
      title: '식대 비과세 혜택',
      message: '월 20만원까지 식대는 비과세입니다. 회사와 협의하여 급여 구조를 조정하면 세금을 절감할 수 있습니다.',
      level: 'info',
      savings: '연간 약 36만원 절세 가능'
    })
  }
  
  // 연말정산 관련 팁
  tips.push({
    type: 'yearEndTax',
    icon: 'bi-calendar-check',
    title: '연말정산 준비',
    message: '신용카드 사용액, 의료비, 교육비, 기부금 영수증을 미리 준비하세요.',
    level: 'info',
    items: ['신용카드: 총급여의 25% 초과분', '의료비: 총급여의 3% 초과분', '교육비: 본인 전액 공제']
  })
  
  // 고소득자 팁
  const totalIncome = (formData.basicSalary || 0) + (formData.overtimePay || 0) + (formData.bonus || 0)
  if (totalIncome > 7000000) {
    tips.push({
      type: 'highIncome',
      icon: 'bi-graph-up',
      title: '고소득자 절세 전략',
      message: '연금저축, IRP 등 세액공제 상품을 활용하세요.',
      level: 'important',
      savings: '연간 최대 900만원 납입 시 13.2~16.5% 세액공제'
    })
  }
  
  return tips
}

/**
 * 세금 관련 외부 링크 정보
 * @returns {Object} 링크 정보
 */
export const getTaxLinks = () => {
  return {
    nts: {
      name: '국세청',
      url: 'https://www.nts.go.kr',
      tel: '국번없이 126',
      services: ['홈택스', '연말정산 간소화', '세금 계산기']
    },
    wetax: {
      name: '위택스',
      url: 'https://www.wetax.go.kr',
      tel: '110',
      services: ['지방세 조회', '지방소득세 신고']
    },
    tools: {
      simpleTaxCalc: {
        name: '간이세액 계산기',
        url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2415&cntntsId=7783',
        description: '월급여액으로 예상 세금 계산'
      },
      yearEndCalc: {
        name: '연말정산 계산기',
        url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2416&cntntsId=7784',
        description: '연말정산 환급액 미리 계산'
      }
    }
  }
}

/**
 * 소득세율표 정보 가져오기
 * @returns {Array} 소득세율 구간 정보
 */
export const getIncomeTaxBrackets = () => {
  return rulesData.incomeTaxRates.brackets.map(bracket => ({
    ...bracket,
    description: getTaxBracketDescription(bracket),
    maxFormatted: bracket.max ? bracket.max.toLocaleString() + '원' : '초과',
    minFormatted: bracket.min.toLocaleString() + '원',
    ratePercent: (bracket.rate * 100) + '%',
    deductionFormatted: bracket.deduction.toLocaleString() + '원'
  }))
}

// 기본 내보내기
export default {
  getTaxInfo,
  getTaxBracketInfo,
  getTaxCalculationExplanation,
  getTaxFAQ,
  getTaxSavingTips,
  getTaxLinks,
  getIncomeTaxBrackets
}