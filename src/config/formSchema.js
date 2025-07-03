// src/config/formSchema.js
// 급여명세서 입력 폼의 구조를 정의

export const formSchema = {
  // 폼 섹션 정의
  sections: [
    {
      id: 'income',
      title: '지급 항목',
      icon: 'bi-plus-circle-fill',
      description: '급여로 지급되는 항목들',
      color: 'success',
      items: [
        {
          id: 'basicSalary',
          name: '기본급',
          category: 'income', // 👈 category 추가
          type: 'number',
          required: true,
          placeholder: '0',
          icon: 'bi-cash',
          tooltip: '근로계약서에 명시된 기본 급여',
          validation: {
            min: 0,
            max: 100000000
          }
        },
        {
          id: 'overtimePay',
          name: '시간외수당',
          category: 'income',
          type: 'number',
          required: false,
          placeholder: '0',
          icon: 'bi-clock-history',
          tooltip: '연장, 야간, 휴일 근로 수당'
        },
        {
          id: 'bonus',
          name: '상여금',
          category: 'income',
          type: 'number',
          required: false,
          placeholder: '0',
          icon: 'bi-gift',
          tooltip: '정기상여, 성과급 등'
        },
        {
          id: 'mealAllowance',
          name: '식대',
          category: 'income',
          type: 'number',
          required: false,
          placeholder: '0',
          icon: 'bi-cup-hot',
          tooltip: '식사 보조비 (월 20만원까지 비과세)',
          taxFree: {
            limit: 200000,
            message: '월 20만원까지 비과세'
          }
        },
        {
          id: 'transportAllowance',
          name: '교통비',
          category: 'income',
          type: 'number',
          required: false,
          placeholder: '0',
          icon: 'bi-bus-front',
          tooltip: '출퇴근 교통비 지원'
        },
        {
          id: 'carAllowance',
          name: '차량유지비',
          category: 'income',
          type: 'number',
          required: false,
          placeholder: '0',
          icon: 'bi-car-front',
          tooltip: '자가용 업무 사용 시 (월 20만원까지 비과세)',
          taxFree: {
            limit: 200000,
            message: '월 20만원까지 비과세 (업무용)'
          }
        },
        {
          id: 'otherAllowance',
          name: '기타수당',
          category: 'income',
          type: 'number',
          required: false,
          placeholder: '0',
          icon: 'bi-three-dots',
          tooltip: '그 외 각종 수당'
        }
      ]
    },
    {
      id: 'deduction',
      title: '공제 항목',
      icon: 'bi-dash-circle-fill',
      description: '급여에서 차감되는 항목들',
      color: 'danger',
      subsections: [
        {
          id: 'insurance',
          title: '4대 보험',
          items: [
            {
              id: 'nationalPension',
              name: '국민연금',
              category: 'insurance', // 👈 category 추가
              type: 'number',
              required: true,
              placeholder: '0',
              icon: 'bi-piggy-bank',
              tooltip: '노후 대비 공적 연금 (월급의 4.5%)',
              calculated: true,
              rate: 0.045
            },
            {
              id: 'healthInsurance',
              name: '건강보험',
              category: 'insurance',
              type: 'number',
              required: true,
              placeholder: '0',
              icon: 'bi-hospital',
              tooltip: '의료비 지원 보험 (보수월액의 3.545%)',
              calculated: true,
              rate: 0.03545
            },
            {
              id: 'longTermCare',
              name: '장기요양보험',
              category: 'insurance',
              type: 'number',
              required: true,
              placeholder: '0',
              icon: 'bi-heart-pulse',
              tooltip: '노인 장기요양 보험 (건강보험료의 12.27%)',
              calculated: true,
              baseOn: 'healthInsurance',
              rate: 0.1227
            },
            {
              id: 'employmentInsurance',
              name: '고용보험',
              category: 'insurance',
              type: 'number',
              required: true,
              placeholder: '0',
              icon: 'bi-briefcase',
              tooltip: '실업급여 등 (월급의 0.9%)',
              calculated: true,
              rate: 0.009
            }
          ]
        },
        {
          id: 'tax',
          title: '세금',
          items: [
            {
              id: 'incomeTax',
              name: '소득세',
              category: 'tax', // 👈 category 추가
              type: 'number',
              required: true,
              placeholder: '0',
              icon: 'bi-calculator',
              tooltip: '근로소득에 대한 세금 (누진세율)',
              calculated: true
            },
            {
              id: 'localIncomeTax',
              name: '지방소득세',
              category: 'tax',
              type: 'number',
              required: true,
              placeholder: '0',
              icon: 'bi-building',
              tooltip: '소득세의 10%',
              calculated: true,
              baseOn: 'incomeTax',
              rate: 0.1
            }
          ]
        },
        {
          id: 'other',
          title: '기타 공제',
          items: [
            {
              id: 'advancePayment',
              name: '가불금',
              category: 'deductions', // 👈 category 추가
              type: 'number',
              required: false,
              placeholder: '0',
              icon: 'bi-cash-coin',
              tooltip: '미리 받은 급여'
            },
            {
              id: 'loanRepayment',
              name: '대출상환',
              category: 'deductions',
              type: 'number',
              required: false,
              placeholder: '0',
              icon: 'bi-bank',
              tooltip: '회사 대출금 상환액'
            },
            {
              id: 'otherDeduction',
              name: '기타공제',
              category: 'deductions',
              type: 'number',
              required: false,
              placeholder: '0',
              icon: 'bi-dash',
              tooltip: '그 외 공제 항목'
            }
          ]
        }
      ]
    }
  ],
  
  // 요약 정보
  summary: {
    items: [
      {
        id: 'grossPay',
        name: '지급액계',
        icon: 'bi-plus-square-fill',
        color: 'success',
        formula: 'sum:income'
      },
      {
        id: 'totalDeduction',
        name: '공제액계',
        icon: 'bi-dash-square-fill',
        color: 'danger',
        formula: 'sum:deduction'
      },
      {
        id: 'netPay',
        name: '실수령액',
        icon: 'bi-wallet2',
        color: 'primary',
        formula: 'grossPay - totalDeduction',
        emphasis: true
      }
    ]
  },
  
  // 입력 필드 공통 설정
  fieldDefaults: {
    currency: 'KRW',
    thousandSeparator: true,
    decimalPlaces: 0,
    prefix: '₩',
    selectOnFocus: true
  },
  
  // 유효성 검사 규칙
  validationRules: {
    required: '필수 입력 항목입니다',
    min: '최소값은 {min}원입니다',
    max: '최대값은 {max}원입니다',
    numeric: '숫자만 입력 가능합니다'
  }
}

// 특정 항목의 스키마 정보를 가져오는 헬퍼 함수
export const getFieldSchema = (fieldId) => {
  for (const section of formSchema.sections) {
    // 직접 항목에서 찾기
    if (section.items) {
      const item = section.items.find(item => item.id === fieldId);
      if (item) return { ...item, sectionId: section.id };
    }
    
    // 하위 섹션에서 찾기
    if (section.subsections) {
      for (const subsection of section.subsections) {
        const item = subsection.items.find(item => item.id === fieldId);
        if (item) return { ...item, sectionId: section.id, subsectionId: subsection.id };
      }
    }
  }
  return null;
}

// 섹션별 항목 ID 목록 가져오기
export const getSectionFieldIds = (sectionId) => {
  const section = formSchema.sections.find(s => s.id === sectionId);
  if (!section) return [];
  
  let fieldIds = [];
  
  if (section.items) {
    fieldIds = section.items.map(item => item.id);
  }
  
  if (section.subsections) {
    section.subsections.forEach(subsection => {
      fieldIds = [...fieldIds, ...subsection.items.map(item => item.id)];
    });
  }
  
  return fieldIds;
}