# Nordic Sharp Edge Language Transition Animation Spec

본 지시서는 웹 애플리케이션 및 사이트에서 **언어 전환(Language Switch)** 시 시각적 안정성과 감각적인 유저 피드백을 제공하기 위한 **2-Phase Sharp Fade & Shift 애니메이션 표준 사양**입니다.

---

## 1. 디자인 컨셉 (Design Concept)

- **명칭**: 2-Phase Sharp Fade & Vertical Shift (2단계 정밀 페이드 & 12px 수직 이동)
- **목적**: 
  - 다국어(한국어, 일본어, 영어 등) 변경 시 글자 수 및 줄 바뀜 차이로 인한 시각적 충격을 방지.
  - 절제된 12px 수직 이동과 0.4초의 유연한 타임라인을 통해 고급스러운 Nordic Glass-Cut 브랜드 미학 구현.

---

## 2. 애니메이션 파라미터 (Animation Parameters)

| 구분 | 지속 시간 | 수직 이동 범위 | 투명도 (Opacity) | 이징 곡선 (Easing) |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Fade-Out (사라짐)** | `0.18s` (180ms) | `0px` ➔ `-12px` (위쪽) | `1.0` ➔ `0.0` | `cubic-bezier(0.4, 0, 1, 1)` |
| **Phase 2: Fade-In (나타남)** | `0.22s` (220ms) | `+12px` ➔ `0px` (제자리) | `0.0` ➔ `1.0` | `cubic-bezier(0, 0, 0.2, 1)` |
| **총 소요 시간** | **`0.40s` (400ms)** | 총 이동거리 `12px` | Cross-Fade | Continuous Flow |

---

## 3. CSS 구현 스펙 (Stylesheet Spec)

프로젝트의 글로벌 CSS 또는 스타일시트에 아래 애니메이션 사양을 추가합니다:

```css
/* --------------------------------------------------------------------------
   Language Transition Spec: 2-Phase Cross-Fade & Shift
   -------------------------------------------------------------------------- */

/* Phase 1: 기존 텍스트가 위로 올라가며 사라짐 */
@keyframes sharpFadeOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-12px);
  }
}

/* Phase 2: 새 텍스트가 아래에서 올라오며 나타남 */
@keyframes sharpFadeIn {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 애니메이션 적용 유틸리티 클래스 */
.lang-fading-out {
  animation: sharpFadeOut 0.18s cubic-bezier(0.4, 0, 1, 1) forwards;
  will-change: opacity, transform;
}

.lang-fading-in {
  animation: sharpFadeIn 0.22s cubic-bezier(0, 0, 0.2, 1) forwards;
  will-change: opacity, transform;
}
```

---

## 4. 프론트엔드 연동 지시서 (Integration Guide)

### A. React / Next.js 구현 방식

1. **상태 관리 (Context / Custom Hook)**:
   - 언어 변경 요청 시 즉시 언어를 바꾸지 않고, 전환 상태 `isTransitioning = true`를 선언합니다.
   - `180ms` 타이머 후 실제 언어 코드(State)를 변경하고 `isTransitioning = false`로 되돌립니다.

```javascript
// i18n Context 내 setLang 구현 예시
const setLang = (newLang) => {
  if (newLang === currentLang || isTransitioning) return;
  
  setIsTransitioning(true); // Phase 1 (Fade-Out) 시작

  setTimeout(() => {
    setCurrentLang(newLang); // 언어 교체
    setIsTransitioning(false); // Phase 2 (Fade-In) 시작
  }, 180); // 180ms 후 전환
};
```

2. **컴포넌트 바인딩 패턴**:
   - 다국어 영향을 받는 텍스트/카드 영역에 `isTransitioning`에 따른 클래스와 `key` 값을 동적으로 적용합니다.

```jsx
const langAnimClass = isTransitioning ? 'lang-fading-out' : 'lang-fading-in';

return (
  <h1 
    key={`title-${isTransitioning ? 'out' : currentLang}`} 
    className={`title ${langAnimClass}`}
  >
    {t('header_title')}
  </h1>
);
```

---

### B. 바닐라 JavaScript (Vanilla JS) 구현 방식

```javascript
function changeLanguage(newLang) {
  const targets = document.querySelectorAll('.lang-target');
  
  // Phase 1: Fade-Out
  targets.forEach(el => {
    el.classList.remove('lang-fading-in');
    el.classList.add('lang-fading-out');
  });

  setTimeout(() => {
    // 텍스트 교체
    updateTextContent(newLang);
    
    // Phase 2: Fade-In
    targets.forEach(el => {
      el.classList.remove('lang-fading-out');
      el.classList.add('lang-fading-in');
    });
  }, 180);
}
```

---

## 5. 적용 권장 대상 (Recommended Targets)

- **Main Heading & Titles**: 대형 타이틀 및 헤드라인
- **Informational Badges / Status**: 상태 태그, 버튼 텍스트
- **Card Content Containers**: 다국어가 들어있는 마감일 정보/대시보드 패널
- **Footer & Navigation**: 네비게이션 메뉴 및 푸터 카피라이트

---

## 6. 검토 및 체크리스트 (Verification Checklist)

- [ ] `12px` 수직 이동 중 overflow로 인한 스크롤바 생성이 없는지 확인
- [ ] `will-change: opacity, transform`을 통한 브라우저 하드웨어 가속 적용 확인
- [ ] Fade-Out(`180ms`) 과 Fade-In(`220ms`)의 합이 `400ms`를 넘지 않도록 관리
