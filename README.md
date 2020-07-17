# 📈 Statty ![Docker Build](https://github.com/lolPants/statty/workflows/Docker%20Build/badge.svg)

_A no-nonsense status page / statistics server._

## 🚀 Running in Production
This project uses GitHub Actions to run automated docker builds, you can find them in this repo's [Package Registry](https://github.com/lolPants/statty/packages). A sample Docker Compose file has been provided for you to use as a reference.

### 📝 Configuration
Statty services are configured using YAML or JSON. A [JSON schema](https://raw.githubusercontent.com/lolPants/statty/master/assets/config.schema.json) has been provided for use in IDEs.

Statty also requires a Redis database for persistence between restarts. This is configured using environment variables. Refer to `.env.example` for documentation.
