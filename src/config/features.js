// src/config/features.js
// 기능 플래그 - 향후 기능을 점진적으로 활성화하기 위한 설정

export const features = {
  // 계산기 기능 (현재는 해설만 제공)
  enableCalculator: false,
  
  // 다른 사람과 급여 비교 기능
  enableComparison: false,
  
  // PDF 내보내기 기능
  enablePdfExport: false,
  
  // 급여 히스토리 저장 (로컬스토리지)
  enableHistory: false,
  
  // 다크 모드
  enableDarkMode: false,
  
  // 다국어 지원
  enableMultiLanguage: false,
  
  // 상세 통계 및 차트
  enableAnalytics: false,
  
  // 급여 시뮬레이션 (연봉 협상용)
  enableSimulation: false,
  
  // 모바일 앱 다운로드 배너
  showMobileAppBanner: false,
  
  // 사용자 피드백 수집
  enableFeedback: true,
  
  // 공유 기능 (카카오톡, 링크 복사 등)
  enableSharing: false,
  
  // 실시간 법령 업데이트 알림
  enableUpdateNotification: true
}

// 특정 기능이 활성화되어 있는지 확인하는 헬퍼 함수
export const isFeatureEnabled = (featureName) => {
  return features[featureName] === true
}

// 개발 환경에서만 모든 기능 활성화
export const enableAllFeaturesInDev = () => {
  if (import.meta.env.DEV) {
    Object.keys(features).forEach(key => {
      features[key] = true
    })
    console.log('🚀 Development mode: All features enabled')
  }
}

// 특정 기능들을 한번에 활성화/비활성화
export const setFeatures = (featureList, enabled = true) => {
  featureList.forEach(feature => {
    if (features.hasOwnProperty(feature)) {
      features[feature] = enabled
    }
  })
}

// 현재 활성화된 기능 목록 반환
export const getEnabledFeatures = () => {
  return Object.entries(features)
    .filter(([key, value]) => value === true)
    .map(([key]) => key)
}