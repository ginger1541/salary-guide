# 급여명세서 해설기 - "내 월급, 제대로 보기"

복잡한 급여명세서 항목을 누구나 쉽게 이해할 수 있도록 풀어서 설명해주는 웹 기반 서비스입니다.

## 📌 프로젝트 개요

급여명세서의 각종 공제 항목(4대 보험, 세금 등)이 왜, 어떤 기준으로 책정되는지 쉽게 이해할 수 있도록 도와주는 **인터랙티브 해설 서비스**입니다.

### 주요 특징
- ✅ **100% 클라이언트 사이드**: 민감한 급여 정보가 서버로 전송되지 않음
- ✅ **즉각적인 피드백**: 입력 즉시 해당 항목에 대한 설명 제공
- ✅ **2025년 최신 법령 기준**: 현행 세율 및 보험요율 반영
- ✅ **반응형 디자인**: PC, 태블릿, 모바일 모든 기기 지원

## 🛠 기술 스택

- **Frontend Framework**: Vue.js 3
- **UI Framework**: Bootstrap 5
- **Build Tool**: Vite
- **Package Manager**: npm
- **Hosting**: GitHub Pages / Netlify / Vercel (정적 호스팅)

## 📋 주요 기능

### 1. 직관적인 데이터 입력
- 실제 급여명세서와 유사한 레이아웃의 입력 폼
- 지급 항목(기본급, 식대 등)과 공제 항목(국민연금, 소득세 등) 구분

### 2. 실시간 설명 제공
- 각 항목별 도움말 아이콘(❓) 제공
- 클릭/호버 시 상세 설명 툴팁 표시
- 비전문가도 이해하기 쉬운 설명

### 3. 공신력 있는 정보 제공
- 국세청, 국민연금공단 등 공식 기관 링크 연결
- 2025년 기준 최신 법령 정보 반영

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0 이상
- npm 8.0 이상

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/[your-username]/salary-guide.git
cd salary-guide

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 파일 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
salary-guide/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── HelpTooltip.vue
│   │   │   └── BaseInput.vue
│   │   ├── form/
│   │   │   ├── SalaryForm.vue
│   │   │   ├── IncomeSection.vue
│   │   │   └── DeductionSection.vue
│   │   └── report/
│   │       └── ResultReport.vue
│   ├── modules/              # 기능별 모듈 (확장 대비) 미완전 근데 폴더만 달랑있으면 안해도 되잖아? 
│   │   ├── insurance/
│   │   │   ├── national/
│   │   │   ├── health/
│   │   │   ├── employment/
│   │   │   └── index.js
│   │   ├── tax/
│   │   │   ├── income/
│   │   │   ├── local/
│   │   │   └── index.js
│   │   └── allowance/
│   │       └── index.js
│   ├── data/
│   │   ├── rules/           # 연도별/지역별 규칙 관리 js파일 만들어야함.
│   │   │   ├── 2025/
│   │   │   │   └── kr.json
│   │   │   └── index.js
│   │   └── explanations/    # 설명 텍스트 분리 관리
│   │       ├── ko/
│   │       │   ├── insurance.json
│   │       │   ├── tax.json
│   │       │   └── general.json
│   │       └── index.js
│   ├── config/              # 설정 파일
│   │   ├── formSchema.js    # 폼 구조 정의
│   │   └── features.js      # 기능 플래그
│   ├── utils/
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── plugins/             # Vue 플러그인 (향후 확장용)
│   │   └── .gitkeep
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 📋 요구사항

### 기능 요구사항
- **R-1**: 급여명세서 각 항목별 숫자 입력 기능
- **R-2**: 항목별 설명 제공 (툴팁/팝업)
- **R-3**: 2025년 기준 정확한 법령 정보 제공
- **R-4**: 공식 기관 상세 정보 링크
- **R-5**: 입력 데이터 초기화 기능

### 비기능 요구사항
- **R-6**: 🔒 **보안** - 모든 데이터는 클라이언트에서만 처리
- **R-7**: 직관적인 사용자 인터페이스
- **R-8**: 반응형 웹 디자인
- **R-9**: 즉각적인 응답 성능
- **R-10**: 법령 변경 시 쉬운 업데이트 구조

## 🔧 설정 및 유지보수

### 세율/보험요율 업데이트

`src/data/salaryRules.json` 파일을 수정하여 변경된 요율을 반영할 수 있습니다:

```json
{
  "insuranceRates": {
    "nationalPension": 0.045,
    "healthInsurance": 0.03545,
    "longTermCare": 0.1227,
    "employmentInsurance": 0.009
  },
  "taxRates": {
    // 소득세율 등
  }
}
```

### 설명 텍스트 수정

`src/utils/explanations.js` 파일에서 각 항목별 설명을 관리합니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- 국세청, 국민연금공단 등 공식 정보 제공 기관
- Vue.js 및 Bootstrap 오픈소스 커뮤니티

## 📞 문의

프로젝트 관련 문의사항은 [Issues](https://github.com/[your-username]/salary-guide/issues) 페이지를 이용해주세요.

---

**주의사항**: 이 서비스는 교육 목적으로 제작되었으며, 실제 급여 계산의 정확성을 보장하지 않습니다. 정확한 정보는 반드시 공식 기관에 문의하시기 바랍니다.