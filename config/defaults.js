module.exports = () => {
  let host = "http://localhost:8080";

  let config = {
    database: {
    },
    authentication: {
      cookie: {
        maxAge: 86000
      },
      session: {
        secret: "really-secret-string-here"
      }
    }
  }

  return config
};
