const server = require("./src/app")

  const PORT = 8081;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
