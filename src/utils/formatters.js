// src/utils/formatters.js
// 숫자 및 텍스트 포맷팅을 위한 유틸리티 함수들

/**
 * 숫자를 한국 원화 형식으로 포맷팅
 * @param {number|string} value - 포맷팅할 숫자
 * @param {boolean} includeSymbol - 원화 기호 포함 여부
 * @returns {string} 포맷된 문자열
 */
export const formatCurrency = (value, includeSymbol = false) => {
  const num = Number(value) || 0
  const formatted = num.toLocaleString('ko-KR')
  return includeSymbol ? `${formatted}원` : formatted
}

/**
 * 천단위 콤마 추가
 * @param {number|string} value - 포맷팅할 숫자
 * @returns {string} 콤마가 추가된 문자열
 */
export const addThousandSeparator = (value) => {
  if (!value && value !== 0) return ''
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 콤마 제거
 * @param {string} value - 콤마가 포함된 문자열
 * @returns {string} 콤마가 제거된 문자열
 */
export const removeThousandSeparator = (value) => {
  if (!value) return ''
  return String(value).replace(/,/g, '')
}

/**
 * 퍼센트 포맷팅
 * @param {number} value - 소수점 형태의 비율 (예: 0.045)
 * @param {number} decimals - 소수점 자릿수
 * @returns {string} 퍼센트 문자열
 */
export const formatPercent = (value, decimals = 2) => {
  const percent = (value * 100).toFixed(decimals)
  return `${percent}%`
}

/**
 * 날짜 포맷팅
 * @param {Date|string} date - 날짜 객체 또는 문자열
 * @param {string} format - 포맷 형식 ('YYYY-MM-DD', 'YYYY년 MM월 DD일' 등)
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = date instanceof Date ? date : new Date(date)
  
  if (isNaN(d.getTime())) {
    return ''
  }
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'YYYY년 MM월 DD일':
      return `${year}년 ${month}월 ${day}일`
    case 'YYYY.MM.DD':
      return `${year}.${month}.${day}`
    case 'MM/DD':
      return `${month}/${day}`
    default:
      return `${year}-${month}-${day}`
  }
}

/**
 * 급여 기간 포맷팅
 * @param {Date|string} startDate - 시작일
 * @param {Date|string} endDate - 종료일
 * @returns {string} 포맷된 기간 문자열
 */
export const formatPayPeriod = (startDate, endDate) => {
  const start = formatDate(startDate, 'MM/DD')
  const end = formatDate(endDate, 'MM/DD')
  return `${start} ~ ${end}`
}

/**
 * 숫자를 한글로 변환
 * @param {number} num - 변환할 숫자
 * @returns {string} 한글로 표현된 숫자
 */
export const numberToKorean = (num) => {
  let number = Number(num)
  if (isNaN(number) || number === 0) return '영'
  
  const units = ['', '만', '억', '조']
  const smallUnits = ['', '십', '백', '천']
  const numbers = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
  
  let result = ''
  let unitIndex = 0
  
  while (number > 0 && unitIndex < units.length) {
    const part = number % 10000
    if (part > 0) {
      let partResult = ''
      let smallUnitIndex = 0
      let tempPart = part
      
      while (tempPart > 0 && smallUnitIndex < smallUnits.length) {
        const digit = tempPart % 10
        if (digit > 0) {
          partResult = numbers[digit] + smallUnits[smallUnitIndex] + partResult
        }
        tempPart = Math.floor(tempPart / 10)
        smallUnitIndex++
      }
      
      result = partResult + units[unitIndex] + ' ' + result
    }
    
    number = Math.floor(number / 10000)
    unitIndex++
  }
  
  return result.trim() + '원'
}

/**
 * 급여 항목 이름 포맷팅 (아이콘 포함)
 * @param {string} itemName - 항목 이름
 * @param {string} iconClass - 부트스트랩 아이콘 클래스
 * @returns {string} HTML 문자열
 */
export const formatItemWithIcon = (itemName, iconClass) => {
  return `<i class="${iconClass} me-2"></i>${itemName}`
}

/**
 * 금액 차이 포맷팅 (증감 표시)
 * @param {number} current - 현재 금액
 * @param {number} previous - 이전 금액
 * @returns {Object} 포맷 정보
 */
export const formatDifference = (current, previous) => {
  const diff = current - previous
  const percent = previous !== 0 ? ((diff / previous) * 100).toFixed(1) : 0
  
  return {
    amount: Math.abs(diff),
    formattedAmount: formatCurrency(Math.abs(diff)),
    percent: Math.abs(percent),
    formattedPercent: `${Math.abs(percent)}%`,
    isIncrease: diff > 0,
    isDecrease: diff < 0,
    isUnchanged: diff === 0,
    icon: diff > 0 ? 'bi-arrow-up' : diff < 0 ? 'bi-arrow-down' : 'bi-dash',
    color: diff > 0 ? 'danger' : diff < 0 ? 'success' : 'secondary',
    text: diff > 0 ? '증가' : diff < 0 ? '감소' : '변동없음'
  }
}

/**
 * 입력 필드용 포맷팅 (입력 중 실시간 적용)
 * @param {string} value - 입력값
 * @param {Object} options - 포맷 옵션
 * @returns {string} 포맷된 값
 */
export const formatInputValue = (value, options = {}) => {
  const {
    allowDecimal = false,
    maxLength = 12,
    prefix = '',
    suffix = ''
  } = options
  
  // 숫자만 추출
  let cleaned = value.replace(/[^\d.]/g, '')
  
  // 소수점 처리
  if (!allowDecimal) {
    cleaned = cleaned.replace(/\./g, '')
  } else {
    const parts = cleaned.split('.')
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('')
    }
  }
  
  // 최대 길이 제한
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength)
  }
  
  // 천단위 콤마 추가
  const parts = cleaned.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formatted = parts.join('.')
  
  // 접두사/접미사 추가
  let result = formatted
  if (prefix) result = prefix + result
  if (suffix) result = result + suffix
  
  return result
}

/**
 * 보험료율 텍스트 포맷팅
 * @param {number} rate - 보험료율 (예: 0.045)
 * @param {string} type - 보험 종류
 * @returns {string} 설명 텍스트
 */
export const formatInsuranceRateText = (rate, type) => {
  const percent = formatPercent(rate)
  const half = formatPercent(rate / 2)
  
  return `${percent} (근로자 ${half}, 사업주 ${half})`
}

/**
 * 비과세 한도 텍스트 포맷팅
 * @param {number} limit - 비과세 한도
 * @param {number} current - 현재 금액
 * @returns {Object} 포맷 정보
 */
export const formatTaxFreeInfo = (limit, current) => {
  const isOver = current > limit
  const overAmount = Math.max(0, current - limit)
  
  return {
    isOver,
    limitText: `월 ${formatCurrency(limit)}까지 비과세`,
    statusText: isOver 
      ? `${formatCurrency(overAmount)} 초과 (과세 대상)` 
      : '비과세 적용',
    statusColor: isOver ? 'warning' : 'success',
    statusIcon: isOver ? 'bi-exclamation-circle' : 'bi-check-circle'
  }
}