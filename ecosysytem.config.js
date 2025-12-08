module.exports = {
  apps: [{
    name: "next-front",
    script: "node_modules/next/dist/bin/next",
    args: "start -p 4000",
    cwd: "/home/bookingcab/public_html/public",
    instances: 2, // Optimal for most servers
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 4000,
      TS_NODE_PROJECT: "./tsconfig.json", // Critical for TypeScript
      NEXT_PUBLIC_API_URL: "https://api.bookingcabs.com/api",
      // Add all other ENV variables here
    },
    error_file: "./logs/next-front-err.log",
    out_file: "./logs/next-front-out.log",
    time: true
  }]
}
