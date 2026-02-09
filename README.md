# 🧞 Full Stack Genie

**Skip the boilerplate. Start coding in 60 seconds.**

Full Stack Genie is a VS Code extension that instantly scaffolds full-stack projects. Say goodbye to the first 4 hours of setup—let the genie handle it!

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/ashram15/fullstackgenie)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Features

- **60-Second Setup**: Full-stack project ready in under a minute
- **Interactive Wizard**: Beautiful webview UI inside VS Code
- **Pre-configured Templates**: React + FastAPI with sensible defaults
- **Auto-wiring**: CORS, proxies, and env files configured automatically
- **GitHub Integration**: Optionally create and link a GitHub repo
- **Guided Onboarding**: Built-in walkthrough to get you started
- **Hackathon-Ready**: Focus on features, not boilerplate

## Demo

![Full Stack Genie Demo](media/demo.gif)

## What You Get

When you run Full Stack Genie, it generates:

```
your-project/
├── frontend/               # React 18 + Vite
│   ├── src/
│   │   ├── App.jsx        # Pre-wired to backend
│   │   ├── main.jsx
│   │   └── *.css
│   ├── package.json       # All dependencies included
│   ├── vite.config.js     # Proxy configured
│   └── .env               # Template ready
├── backend/                # FastAPI
│   ├── main.py            # Working API with CORS
│   ├── config.py          # Environment config
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Template ready
├── .gitignore             # Comprehensive rules
├── README.md              # Project-specific docs
└── .git/                  # Initialized + committed
```

## Quick Start

### Installation

1. **Install from VSIX** :
   ```bash
   code --install-extension fullstackgenie-1.0.0.vsix
   ```

2. **Or build from source**:
   ```bash
   git clone https://github.com/yourusername/fullstackgenie
   cd fullstackgenie
   npm install
   npm run compile
   ```

### Usage

1. Open VS Code in an empty folder
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Full Stack Genie: New Project"
4. Fill out the wizard (takes ~10 seconds)
5. Watch the magic happen! ✨

### Post-Generation

After generation, Full Stack Genie will:
- ✅ Open your README.md
- ✅ Prompt you to configure `.env` files
- ✅ Offer to start the walkthrough

**Install dependencies:**
```bash
cd frontend && npm install
cd backend && pip install -r requirements.txt
```

**Run the project:**
```bash
# Terminal 1 - Backend
cd backend && python main.py

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Visit http://localhost:5173 to see your app! 🎉

## Supported Stacks

### Frontend
- ✅ React 18 + Vite (Fast HMR)
- 🔜 Vue 3 + Vite (Coming Soon)
- 🔜 Static HTML (Coming Soon)

### Backend
- ✅ FastAPI + Uvicorn (Python)
- 🔜 Express (Node.js)
- 🔜 Flask (Python)

### Database
- ✅ PostgreSQL (scaffolding)
- ✅ MongoDB (scaffolding)
- ✅ None (API only)

### Features
- ✅ Auth0 scaffolding
- ✅ GitHub repository creation
- ✅ Git initialization
- ✅ Environment variable templates

## Configuration

### GitHub Token (Optional)

To enable automatic GitHub repository creation:

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
2. Create a token with `repo` scope
3. In VS Code: Settings → Extensions → Full Stack Genie → GitHub Token
4. Paste your token

Alternatively, Full Stack Genie will prompt you during project creation.

## Architecture

Full Stack Genie uses:
- **VS Code Extension API**: Command registration, webviews, terminals
- **EJS Templates**: Dynamic file generation
- **fs-extra**: File operations
- **Octokit**: GitHub API integration

### Template System

Templates are stored in `/templates` and support EJS variables:
- `<%= projectName %>`: Your project name
- `<%= frontendPort %>`: Frontend dev server port
- `<%= backendPort %>`: Backend API port
- `<%= databaseUrl %>`: Database connection string

## Development

### Prerequisites
- Node.js 18+
- VS Code 1.85+

### Setup
```bash
git clone https://github.com/yourusername/fullstackgenie
cd fullstackgenie
npm install
```

### Run Extension
1. Open in VS Code
2. Press `F5` to launch Extension Development Host
3. Test the extension in the new window

### Build
```bash
npm run compile        # Compile TypeScript
npm run watch          # Watch mode
npm run package        # Create .vsix file
```

## Contributing

Contributions welcome! 

### Ideas for Enhancement
- [ ] Add more frontend frameworks (Vue, Svelte, Angular)
- [ ] Add more backend frameworks (Express, Django, Spring Boot)
- [ ] Add Docker support
- [ ] Add testing scaffolds (Jest, Pytest)
- [ ] Add deployment scripts (Vercel, Heroku, AWS)
- [ ] Add database migrations
- [ ] Add CI/CD pipeline templates

## License

MIT License - See [LICENSE](LICENSE) for details

*"Stop configuring. Start hacking."*
