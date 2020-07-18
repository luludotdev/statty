# 📈 Statty ![Docker Build](https://github.com/lolPants/statty/workflows/Docker%20Build/badge.svg)

_A no-nonsense status page / statistics server._

## 🚀 Running in Production
This project uses GitHub Actions to run automated docker builds, you can find them in this repo's [Package Registry](https://github.com/lolPants/statty/packages). A sample Docker Compose file has been provided for you to use as a reference.

### 📝 Configuration
Statty services are configured using YAML or JSON. A [JSON schema](https://raw.githubusercontent.com/lolPants/statty/master/assets/config.schema.json) has been provided for use in IDEs. By default, Statty looks for `config.yaml`, `config.yml`, or `config.json` in the application's root directory. You can override this behaviour using environment variables. Refer to `.env.example` for documentation.

Statty also requires a Redis database for persistence between restarts. This is configured using environment variables. Refer to `.env.example` for documentation.

## 💖 Special Thanks
* **[Vercel](https://github.com/vercel)** - Creating the Next.js Framework and SWR, as well as many other libraries used in this project.
* **[Elstat](https://gitdab.com/ashie/elstat)** - Being the inspiration for this project, and proving a solid base for the Statty dashboard.
