# TestDino Reporter

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-TestDino%20Reporter-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=github)](https://github.com/marketplace/actions/testdino-playwright-reporter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Upload Playwright test results to TestDino for centralized test analytics, reporting, and debugging.

## 📋 Prerequisites

- A TestDino account ([Sign up here](https://app.testdino.com)) and API token ([Get Your Key here](https://docs.testdino.com/getting-started/#generate-an-api-key))
- Playwright tests configured in your repository
- GitHub Actions enabled in your repository

## 🚀 Quick Start

### Usage with All Options

```yaml
- name: Upload to TestDino
  if: always()
  uses: Testdino1/testdino-actions@v1.0.0
  with:
    token: ${{ secrets.TESTDINO_TOKEN }}
    report-dir: './playwright-report'
    upload-html: true
    upload-traces: true
    upload-videos: true
    upload-images: true
    upload-files: true
    verbose: true
    working-directory: '.'
```

## 📖 Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `token` | TestDino API token for authentication | ✅ Yes | - |
| `report-dir` | Directory containing Playwright reports | No | `./playwright-report` |
| `upload-html` | Upload HTML reports | No | `true` |
| `upload-traces` | Upload Playwright trace files | No | `false` |
| `upload-videos` | Upload video recordings | No | `false` |
| `upload-images` | Upload screenshot images | No | `false` |
| `upload-files` | Upload file attachments | No | `false` |
| `verbose` | Enable verbose logging | No | `false` |
| `working-directory` | Working directory for the action | No | `.` |


## 🔐 Setting Up Your TestDino Token

1. Sign up for a TestDino account at [testdino.com](https://testdino.com)
2. Navigate to your project settings
3. Generate an API token
4. Add the token as a GitHub secret:
   - Go to your repository settings
   - Navigate to **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `TESTDINO_TOKEN`
   - Value: Your TestDino API token
   - Click **Add secret**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Links

- [Testdino](https://app.testdino.com)
- [TestDino Website](https://testdino.com)
- [TestDino Documentation](https://docs.testdino.com)
- [tdpw npm package](https://www.npmjs.com/package/tdpw)
- [TestDino TDPW package](https://pypi.org/project/testdino/)

---

<p align="center">Made with ❤️ by the TestDino team</p>
