module.exports = {
  apps: [{
    name: 'bss-residency-api',
    script: 'backend/server.js',
    instances: 'max',  // Utilize all CPU cores
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
    }
  }]
}
