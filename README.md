# 📅 Wavit Schedule Tracker

Wavit Studio 인프라의 공식 일정 트래커 애플리케이션입니다.

- **서비스 도메인**: [https://schedule.wavit-studio.com](https://schedule.wavit-studio.com)
- **로컬 서비스 포트**: `3000` (`http://localhost:3000`)
- **인프라 명세서**: 자세한 호스팅 및 배포 아키텍처는 [`HOSTING_GUIDE.md`](./HOSTING_GUIDE.md)를 참조하세요.

---

## 🚀 자동 배포 (CI/CD)

본 프로젝트는 **GitHub Actions Self-hosted Runner**를 통해 로컬 호스팅 PC와 연동되어 있습니다.

- `main` 브랜치에 코드를 푸시하면 로컬 PC의 Runner가 감지하여 **자동으로 `git pull` ➔ `npm run build` ➔ 포트 3000 재시작**을 수행합니다.
- 부팅 시 Windows 작업 스케줄러 `Schedule_Server` 및 `Schedule_Runner`가 백그라운드로 자동 실행됩니다.

```bash
# 코드 푸시 시 20~30초 내 자동 배포 완료
git add .
git commit -m "feat: 업데이트 내용"
git push origin main
```

---

## 💻 로컬 개발 환경

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행 (포트 3000)
npm run start
```
