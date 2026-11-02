# 🌐 Wavit Studio 호스팅 인프라 및 서버 운영 명세서

이 문서는 **Cloudflare Pages(클라우드 서버리스)** 및 Windows 11 환경의 **Cloudflare Tunnel + PM2/작업 스케줄러(로컬 호스팅)**를 통해 상시 무중단 운영 중인 웹 애플리케이션 및 백엔드 서비스의 전체 구성과 운영 가이드를 기록한 공식 문서입니다.

---

## 1. 🏗️ 전체 시스템 아키텍처

- **방문자 (외부 인터넷 접속 경로)**:
  - `https://wavit-studio.com` (또는 `www`) ➔ **WAVIT Studio 메인 포트폴리오** (Cloudflare Pages 무중단 클라우드 호스팅)
  - `https://schedule.wavit-studio.com` ➔ **Schedule Tracker** (로컬 호스팅 PC)
  - `https://virtualindex.wavit-studio.com` ➔ **VirtualIndex** (로컬 호스팅 PC)
- **Cloudflare Edge**:
  - DNS CNAME 라우팅, SSL/TLS 자동 암호화, DDoS 방어 및 글로벌 엣지 캐싱
  - `_redirects` 규칙을 통해 `/theme_sharp_desktop` 접근 시 루트(`/`)로 301 영구 이동
- **로컬 호스팅 PC (Windows 11)**:
  - **윈도우 서비스**: `Cloudflared` (터널 아웃바운드 연결 유지)
  - **윈도우 작업 스케줄러 (부팅 시 상시 무중단 구동)**:
    - `Schedule_Server` (Next.js 16.2.10, 포트 3000, `C:\apps\schedule\scripts\start-server.vbs`)
    - `Schedule_Runner` (GitHub Actions Self-hosted Runner, `C:\apps\schedule\scripts\start-runner.vbs`)
    - `VirtualIndex_Server` (Next.js 16.3.6, 포트 3001, `C:\Users\wkjne\virtualindex\scripts\start-server.vbs`)
    - `VirtualIndex_Collector` (실시간 방송 수집기, 5분 주기 가동)
  - **PM2 프로세스 매니저 (보조/수동 관리)**:
    - `schedule-web` (Next.js 16.2.10, 포트 3000)
    - `virtualindex-server` (Next.js 16.3.6, 포트 3001)
    - `virtualindex-collector` (실시간 방송 수집기)
- **외부 클라우드**:
  - Supabase PostgreSQL 클라우드 데이터베이스
  - 치지직 / 유튜브 / 트위치 / SOOP(구 아프리카) Open API

---

## 2. 📑 활성 호스팅 서비스 상세 목록

| 항목 | 메인: WAVIT Studio | 서비스 1: Schedule Tracker | 서비스 2: VirtualIndex | 서비스 3: Live Collector |
| :--- | :--- | :--- | :--- | :--- |
| **호스팅 환경** | **Cloudflare Pages (GitHub Actions CI/CD 자동 배포)** | **로컬 PC (Cloudflare Tunnel + GitHub Actions 자동 배포)** | **로컬 PC (Cloudflare Tunnel + GitHub Actions 자동 배포)** | **로컬 PC (백그라운드 워커)** |
| **공개 접속 도메인** | `https://wavit-studio.com` | `https://schedule.wavit-studio.com` | `https://virtualindex.wavit-studio.com` | *(내부 백그라운드 워커)* |
| **로컬 포트** | *(서버리스 - 로컬 점유 없음)* | `3000` | `3001` | `3001` (로컬 호출) |
| **관리 프로세스** | Cloudflare Edge Global CDN | 스케줄러: `Schedule_Server`, `Schedule_Runner` / PM2: `schedule-web` (ID: 0) | 스케줄러: `VirtualIndex_Server` / PM2: `virtualindex-server` (ID: 1) | 스케줄러: `VirtualIndex_Collector` / PM2: `virtualindex-collector` (ID: 2) |
| **프로젝트 경로 / 소스** | GitHub: `WAVYkhy/WAVIT_studio_2` | `C:\apps\schedule` | `C:\Users\wkjne\virtualindex` | `C:\Users\wkjne\virtualindex` |
| **프레임워크 / 구조** | Vanilla HTML/CSS/JS (정적 웹) | Next.js 16.2.10 (Node.js v26) | Next.js 16.3.6 (Node.js v26) | Node.js Worker (ESM) |
| **배포 방식** | `main` 푸시 시 Cloudflare Pages 자동 배포 (20~30초) | `main` 푸시 시 Self-hosted Runner 자동 배포 (`deploy-self-hosted.yml`) | `main` 푸시 시 Self-hosted Runner 자동 배포 (`deploy-self-hosted.yml`) | 서비스 재시작 시 자동 반영 |
| **특이 사항** | Nordic Sharp Desktop 단일 고정 테마 | `schedule.wavit-studio.com` 독립 루트 매핑 (`/schedule` 접근 시 자동 301/308 리다이렉트) | 루트 서브도메인 단독 매핑 | 5분 간격 자동 라이브 수집 |

---

## 3. 🌐 네트워크 및 도메인 인프라 정보

### [도메인 및 DNS 정보]
- **루트 도메인**: `wavit-studio.com`
- **도메인 등록기관**: Spaceship
- **네임서버(NS)**:
  - `adele.ns.cloudflare.com`
  - `vin.ns.cloudflare.com`
- **Cloudflare Zone ID**: `023f17403dfe75606f5c10a570677f7e`
- **Cloudflare Account ID**: `d32c927d04c8c89b6f6a9ba3374cfcaf`

### [Cloudflare Pages (메인 웹사이트)]
- **프로젝트명**: `wavit-studio`
- **기본 주소**: `https://wavit-studio.pages.dev`
- **프로덕션 브랜치**: `main`
- **배포 방식**: GitHub Actions CI/CD (`.github/workflows/deploy.yml` ➔ Cloudflare Pages 자동 배포)
- **커스텀 도메인**: `wavit-studio.com`, `www.wavit-studio.com`
- **주요 구성**:
  - `index.html`: Nordic Sharp OS 데스크톱 단일 메인 테마 적용
  - `_redirects`: `/theme_sharp_desktop` ➔ `/` (301 자동 정규화)

### [Cloudflare Zero Trust Tunnel (로컬 서비스)]
- **터널 ID**: `90a6ff3c-b177-44ba-8bbb-d76928e0bb04`
- **터널 호스트**: `90a6ff3c-b177-44ba-8bbb-d76928e0bb04.cfargotunnel.com`
- **윈도우 서비스명**: `Cloudflared` (`C:\Program Files (x86)\cloudflared\cloudflared.exe`)
- **토큰 저장 파일**: `C:\ProgramData\cloudflared\token`
- **터널 인그레스(Ingress) 라우팅 규칙**:
  1. `schedule.wavit-studio.com` ➔ `http://localhost:3000` (Schedule Tracker 전용)
  2. `virtualindex.wavit-studio.com` ➔ `http://localhost:3001` (VirtualIndex 전용)
  3. `*` ➔ `http_status:404` (기타 미등록 서브도메인 차단)

### [DNS 레코드 매핑표]
| Type | Name | Content (Target) | Proxy (구름) | 용도 |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `@` (wavit-studio.com) | `wavit-studio.pages.dev` | 프록시됨 (켜짐) | `wavit-studio.com` Cloudflare Pages 연결 |
| **CNAME** | `www` (www.wavit-studio.com) | `wavit-studio.pages.dev` | 프록시됨 (켜짐) | `www.wavit-studio.com` 보조 도메인 연결 |
| **CNAME** | `schedule` | `90a6ff3c-b177-44ba-8bbb-d76928e0bb04.cfargotunnel.com` | 프록시됨 (켜짐) | `schedule.wavit-studio.com` 터널 라우팅 |
| **CNAME** | `virtualindex` | `90a6ff3c-b177-44ba-8bbb-d76928e0bb04.cfargotunnel.com` | 프록시됨 (켜짐) | `virtualindex.wavit-studio.com` 터널 라우팅 |
| **MX** | `@` | `mx.zoho.com` (우선순위 10) | DNS 전용 | Zoho Mail 메인 수신 서버 |
| **MX** | `@` | `mx2.zoho.com` (우선순위 20) | DNS 전용 | Zoho Mail 보조 수신 서버 1 |
| **MX** | `@` | `mx3.zoho.com` (우선순위 50) | DNS 전용 | Zoho Mail 보조 수신 서버 2 |
| **TXT** | `@` | `v=spf1 include:zoho.com ~all` | DNS 전용 | 이메일 발신 SPF 인증 |
| **TXT** | `zoho._domainkey` | `v=DKIM1; k=rsa; p=MIGfMA0G...` | DNS 전용 | 이메일 위조 방지 DKIM 인증 |
| **TXT** | `_dmarc` | `v=DMARC1; p=none;` | DNS 전용 | 이메일 위조 및 스팸 방지 DMARC 정책 |

---

## 4. 🛠️ 일상 운영 및 관리 명령 치트시트

### [Schedule Tracker (포트 3000) 자동 배포 파이프라인]
> **GitHub Actions CI/CD 파이프라인 구축 완료**: `main` 브랜치에 코드를 푸시하면 로컬 PC의 Self-hosted Runner(`Schedule_Runner`)가 감지하여 **20~30초 내 `git pull` ➔ `npm run build` ➔ 포트 3000 재시작**을 완전 자동으로 수행합니다.

```powershell
# 1. 자동 배포 (GitHub main 푸시 시 자동으로 배포 완료)
git add .
git commit -m "feat: 업데이트 내용"
git push origin main

# 2. 러너 상태 및 로그 확인
Get-ScheduledTask -TaskName "Schedule_Runner"
Get-Content "C:\apps\actions-runner-schedule\runner.log" -Tail 20

# 3. 비상 수동 서버 재시작
powershell -ExecutionPolicy Bypass -File "C:\apps\schedule\scripts\start-server.ps1"
```

### [Windows 작업 스케줄러 관리 (상시 서비스)]
```powershell
# 1. 상시 서비스 상태 일괄 확인
Get-ScheduledTask -TaskName "Schedule_Server", "Schedule_Runner", "VirtualIndex_Server", "VirtualIndex_Collector" | Format-Table TaskName, State

# 2. 특정 서비스 재시작
Restart-ScheduledTask -TaskName "Schedule_Server"        # 스케줄러 웹 (포트 3000)
Restart-ScheduledTask -TaskName "Schedule_Runner"        # 스케줄러 CI/CD 러너
Restart-ScheduledTask -TaskName "VirtualIndex_Server"    # 버추얼인덱스 웹 (포트 3001)
Restart-ScheduledTask -TaskName "VirtualIndex_Collector" # 5분 주기 방송 수집기

# 3. 서비스 로그 확인
Get-Content "C:\apps\schedule\server.log" -Tail 20                # 스케줄러 웹 로그
Get-Content "C:\apps\actions-runner-schedule\runner.log" -Tail 20 # 스케줄러 러너 로그
Get-Content "C:\Users\wkjne\virtualindex\server.log" -Tail 20    # 버추얼인덱스 서버 로그
Get-Content "C:\Users\wkjne\virtualindex\collector.log" -Tail 20 # 수집기 로그
```

### [Cloudflare 터널 서비스 관리]
```powershell
# 1. 터널 서비스 상태 확인
Get-Service cloudflared

# 2. 터널 서비스 재시작 (관리자 권한)
Restart-Service cloudflared
```

---

## 5. ⚠️ 필수 유지보수 수칙

1. **메인 웹사이트(wavit-studio.com) 독립 운영**:
   - 메인 웹사이트는 Cloudflare Pages를 통해 글로벌 엣지에서 서비스되므로, **로컬 호스팅 PC가 꺼져 있어도 항상 정상 작동**합니다.
   - `main` 브랜치에 푸시 시 GitHub Actions를 통해 20~30초 내 무중단 자동 배포됩니다.
2. **로컬 호스팅 PC(VirtualIndex / Schedule Tracker) 관리**:
   - 로컬 PC가 절전 모드에 들어가면 터널 연결이 끊기므로 **절전 모드는 항상 "안 함"**을 유지해야 합니다.
   - PC 재부팅 시 `Cloudflared` 윈도우 서비스와 Windows 작업 스케줄러(`Schedule_Server`, `Schedule_Runner`, `VirtualIndex_Server`, `VirtualIndex_Collector`)가 자동 복원됩니다.
3. **포트 충돌 엄금 원칙 (Port Isolation)**:
   - `Schedule Tracker`는 반드시 **포트 3000**을 사용해야 합니다.
   - `VirtualIndex`는 반드시 **포트 3001**을 사용해야 합니다.
   - 개별 스크립트에서 전체 `node.exe` 프로세스를 일괄 강제 종료(`taskkill /F /IM node.exe`)하는 명령어를 사용하면 다른 상시 서비스가 다운되므로 절대 금지합니다.

---

## 6. 🚨 장애 및 변경 이력 (Changelog & Troubleshooting Log)

### [2026-11-02] Schedule Tracker GitHub Actions Self-hosted Runner 자동 배포 파이프라인 구축
- **현상/요구사항**: GitHub 저장소(`schedule-tracker`)에 커밋 및 푸시가 발생해도 로컬 호스팅 PC로 자동 동기화/배포가 이루어지지 않아 매번 수동으로 pull 및 build, 재시작을 진행해야 했음.
- **원인**: Cloudflare Pages와 달리 Schedule Tracker는 사설망 내의 로컬 PC에서 동작하여 GitHub의 push 이벤트를 수신할 CI/CD 에이전트가 없었음.
- **조치 사항**:
  1. `C:\apps\actions-runner-schedule`에 GitHub Actions Self-hosted Runner 설치 및 등록 (`schedule-runner`, 라벨: `self-hosted`, `schedule-tracker`).
  2. Windows 작업 스케줄러에 `Schedule_Runner` 등록 (`scripts/start-runner.vbs`)하여 부팅 시 상시 백그라운드 구동 보장.
  3. [`.github/workflows/deploy-self-hosted.yml`](file:///c:/apps/schedule/.github/workflows/deploy-self-hosted.yml) 워크플로를 생성하여 `main` 브랜치 푸시 시 자동 `git pull` ➔ `npm run build` ➔ 포트 3000 무중단 재기동 ➔ 헬스체크(HTTP 200) 파이프라인 완성.
  4. 테스트 검증 완료: 푸시 후 25초 이내에 자동 빌드 및 서비스 재기동 확인.

### [2026-11-02] `schedule.wavit-studio.com` 접속 시 VirtualIndex가 노출되던 장애
- **현상**: `https://schedule.wavit-studio.com/` 접속 시 스케줄 페이지가 아닌 VirtualIndex 메인 화면이 출력됨.
- **원인 분석**:
  1. **Cloudflare Tunnel Ingress 설정 중복**: 터널 설정에서 `virtualindex.wavit-studio.com`과 `schedule.wavit-studio.com`이 모두 로컬 `http://localhost:3000`으로 라우팅되도록 설정되어 있었음.
  2. **스크립트 포트 충돌**: `VirtualIndex`의 시작 스크립트(`start-server.bat`)가 포트 `3001`이 아닌 `3000`으로 실행되면서 포트 3000을 점유하던 `schedule-web`을 강제 종료하고 3000을 선점함.
- **해결 조치**:
  1. Cloudflare API를 호출하여 터널 Ingress 라우팅을 정상 분리:
     - `schedule.wavit-studio.com` ➔ `http://localhost:3000`
     - `virtualindex.wavit-studio.com` ➔ `http://localhost:3001`
  2. `VirtualIndex`의 `start-server.bat`, `restart-service.ps1`, `check-status.ps1`을 포트 `3001` 기준으로 전면 수정 및 무차별 `taskkill node.exe` 제거.
  3. `C:\apps\schedule\scripts\start-server.bat` 및 `start-server.vbs` 생성 후 Windows 작업 스케줄러 `Schedule_Server`로 등록하여 3000 포트 상시 자동 실행 복구 완료.

### [2026-11-02] 5분 주기 라이브 수집기(VirtualIndex_Collector) 포트 404 오류로 인한 방송 감지 중단 장애
- **현상**: 대시보드 및 V-Dive에서 실시간 방송 시작/종료 감지가 반영되지 않고 멈춤 현상 발생.
- **원인 분석**:
  1. VirtualIndex 웹 서버를 포트 3001로 이전한 후, Windows 작업 스케줄러(`VirtualIndex_Collector`)가 실행하는 백그라운드 수집 스크립트의 호출 대상 URL이 여전히 `http://localhost:3000/api/collector/run`으로 하드코딩되어 있었음.
  2. 포트 3000은 Schedule-Tracker 전용 서비스이므로 `/api/collector/run` 엔드포인트가 존재하지 않아 매 5분마다 `404 Not Found`가 발생하며 수집이 약 45분간 전면 중단됨.
- **해결 조치**:
  1. 수집 스크립트의 대상 포트를 3001로 변경하고 임시 터널 스크립트도 3001로 수정.
  2. 스케줄러 즉시 실행하여 `[SUCCESS]` 확인 및 41개 라이브 채널 정상 감지 복구 완료.
