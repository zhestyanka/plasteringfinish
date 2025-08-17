module.exports = {
  apps: [{
    name: 'plasteringfinish',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/plasteringfinish',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      TELEGRAM_BOT_TOKEN: '8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY',
      TELEGRAM_CHAT_ID: '6476993703'
    },
    error_file: '/var/log/pm2/plasteringfinish-error.log',
    out_file: '/var/log/pm2/plasteringfinish-out.log',
    log_file: '/var/log/pm2/plasteringfinish-combined.log',
    time: true
  }]
} 