# 🌐 Wavit Studio 통합 호스팅 & 인프라 규칙 (필수 준수)

이 프로젝트(`schedule-tracker`)는 **Wavit Studio (`wavit-studio.com`) 인프라의 일부**로 운영됩니다. 다른 PC나 다른 세션에서 작업할 때 아래 규칙을 반드시 준수해야 합니다.
상세한 전체 호스팅 아키텍처 및 라우팅 명세는 루트의 [`HOSTING_GUIDE.md`](./HOSTING_GUIDE.md)를 참조하세요.

1. **포트 3000 고정 (Port Isolation)**:
   - **`schedule-tracker` (본 프로젝트)**: 반드시 **포트 3000**으로 실행되어야 합니다 (`http://localhost:3000` ➔ `https://schedule.wavit-studio.com`).
   - **`virtualindex`**: 다른 서비스이며 반드시 **포트 3001**을 사용합니다.
   - **`WAVIT_studio_2` (메인 웹)**: Cloudflare Pages 무중단 클라우드 호스팅 (`https://wavit-studio.com`).
2. **프로세스 관리 주의**:
   - 스크립트에서 `taskkill /F /IM node.exe`와 같이 **모든 node 프로세스를 일괄 종료하는 명령어를 절대 사용하지 마세요.** (포트 3001의 VirtualIndex 등 다른 상시 서비스가 다운됩니다.)
   - 프로세스를 재시작할 때는 반드시 포트 3000만 특정하여 정리하고 기동하세요 (`scripts/start-server.ps1` 또는 `start-server.vbs` 사용).
3. **부팅 자동 실행 연동**:
   - 로컬 호스팅 PC에서는 Windows 작업 스케줄러 `Schedule_Server` 및 `Schedule_Runner`(GitHub Actions Self-hosted Runner)가 등록되어 있어 부팅 시 백그라운드로 자동 실행되며, `main` 브랜치에 푸시 발생 시 자동으로 동기화 및 재배포됩니다.

---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
