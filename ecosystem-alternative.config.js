module.exports = {
  apps: [
    {
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
        HOSTNAME: '0.0.0.0'
      },
      error_file: '/var/www/plasteringfinish/logs/err.log',
      out_file: '/var/www/plasteringfinish/logs/out.log',
      log_file: '/var/www/plasteringfinish/logs/combined.log',
      time: true
    }
  ]
};
