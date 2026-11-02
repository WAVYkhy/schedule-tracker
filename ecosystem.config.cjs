module.exports = {
  apps: [
    {
      name: "schedule-web",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "C:\\apps\\schedule",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
