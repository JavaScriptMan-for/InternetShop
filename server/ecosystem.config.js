module.exports = {
    apps: [
      {
        name: "my-server",
        script: "./server.js",
        env: {
          NODE_ENV: "development",
          BASE_URL: process.env.BASE_URL,
          PORT: process.env.PORT
        },
        env_production: {
          NODE_ENV: "production",
          BASE_URL: process.env.BASE_URL,
          PORT: process.env.PORT
        }
      }
    ]
  };
  