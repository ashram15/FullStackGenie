# Architecture & Technical Design

## Overview

Full Stack Genie is a VS Code extension that automates full-stack project scaffolding through an interactive wizard interface. It leverages the VS Code Extension API, EJS templating, and GitHub API integration to provide a seamless project initialization experience.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        VS Code IDE                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Full Stack Genie Extension                   │  │
│  │                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │  Extension   │  │   Webview    │  │  Services  │  │  │
│  │  │  Controller  │◄─┤   Provider   │  │            │  │  │
│  │  │              │  │              │  │  • GitHub  │  │  │
│  │  └──────┬───────┘  └──────────────┘  │  • Terminal│  │  │
│  │         │                             └────────────┘  │  │
│  │         │                                             │  │
│  │         ▼                                             │  │
│  │  ┌──────────────┐                                    │  │
│  │  │   Template   │                                    │  │
│  │  │    Engine    │                                    │  │
│  │  └──────┬───────┘                                    │  │
│  └─────────┼────────────────────────────────────────────┘  │
└────────────┼───────────────────────────────────────────────┘
             │
             ▼
      ┌─────────────┐
      │  Templates  │
      │  Directory  │
      └─────────────┘
             │
             ▼
      ┌─────────────┐
      │  User's     │
      │  Workspace  │
      └─────────────┘
```

## Core Components

### 1. Extension Controller (`extension.ts`)

**Responsibility:** Main entry point and orchestration

**Key Functions:**
- `activate()`: Registers commands and initializes services
- `handleProjectGeneration()`: Orchestrates the entire generation workflow
- `initializeGit()`: Sets up git repository

**Flow:**
1. User triggers command via Command Palette
2. Extension creates webview panel
3. User fills out wizard
4. Webview posts message to extension
5. Extension orchestrates generation pipeline

### 2. Webview Provider (`GenieWebviewProvider.ts`)

**Responsibility:** Generate and manage the wizard UI

**Features:**
- Multi-step wizard (3 steps)
- Form validation
- Framework selection
- Feature toggles (Auth, Database, GitHub)

**Communication:**
```typescript
// Webview → Extension
webview.postMessage({ 
  command: 'generate', 
  config: ProjectConfig 
})

// Extension → Webview
panel.webview.postMessage({ 
  command: 'error', 
  text: string 
})
```

### 3. Template Engine (`TemplateEngine.ts`)

**Responsibility:** File generation and variable substitution

**Algorithm:**
```
1. Select template based on stack selection
2. Prepare template variables (ports, URLs, etc.)
3. Recursively walk template directory
4. For each file:
   a. If .ejs: Render with variables, save without .ejs
   b. Else: Copy directly
5. Return success/failure
```

**Template Variables:**
```typescript
interface TemplateVariables {
  projectName: string;
  frontendPort: number;    // Default: 5173
  backendPort: number;     // Default: 8000
  databaseUrl?: string;
  authDomain?: string;
}
```

### 4. GitHub Service (`GitHubService.ts`)

**Responsibility:** Repository creation and linking

**Workflow:**
1. Check for GitHub token (settings → env → prompt)
2. Authenticate with Octokit
3. Create repository via GitHub API
4. Add remote to local git
5. Push initial commit

**Error Handling:**
- 401: Invalid token
- 422: Repository already exists
- Network errors: Graceful degradation

## Template System

### Structure
```
templates/
└── react-fastapi-auth0/
    ├── frontend/
    │   ├── src/
    │   │   ├── App.jsx.ejs      # EJS template
    │   │   └── main.jsx         # Static file
    │   ├── package.json.ejs     # EJS template
    │   └── vite.config.js.ejs   # EJS template
    ├── backend/
    │   ├── main.py.ejs
    │   ├── config.py.ejs
    │   └── requirements.txt.ejs
    ├── README.md.ejs
    └── .gitignore
```

### File Processing Rules

| File Extension | Processing | Output |
|----------------|------------|--------|
| `.ejs` | EJS render with variables | Remove `.ejs` extension |
| Other | Direct copy | Same name |

### Adding New Templates

1. Create folder: `templates/new-stack/`
2. Add template files (use `.ejs` for dynamic files)
3. Update `TemplateEngine.getTemplateName()`
4. Add UI option in webview
5. Test generation

## Data Flow

```
User Input (Webview)
    ↓
ProjectConfig Object
    ↓
Template Selection Logic
    ↓
TemplateVariables Mapping
    ↓
File System Operations
    ↓
Git Initialization
    ↓
GitHub API Call (optional)
    ↓
Success Notification + Walkthrough
```

## Security Considerations

1. **GitHub Token Storage:**
   - Stored in VS Code global settings
   - Never committed to git
   - User-controlled (can decline)

2. **File Operations:**
   - Checks if folder is empty
   - Prompts before overwriting
   - Uses safe path joining

3. **Input Validation:**
   - Project name: `^[a-z0-9-]+$`
   - No path traversal possible
   - Sanitized for shell commands

## Performance Optimizations

1. **Lazy Loading:**
   - GitHub service only initialized when needed
   - Templates read on-demand

2. **Progress Feedback:**
   - VS Code progress API
   - Step-by-step notifications

3. **Error Recovery:**
   - Graceful degradation for GitHub failures
   - Partial generation still useful

## Extension Lifecycle

```
VS Code Launch
    ↓
Extension Activation (on command)
    ↓
Command Registration
    ↓
[User triggers command]
    ↓
Webview Creation
    ↓
User Interaction
    ↓
Generation Pipeline
    ↓
Cleanup & Notifications
    ↓
Extension Remains Active
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Language | TypeScript | Type safety + VS Code API |
| UI | HTML/CSS/JS | Webview wizard |
| Templating | EJS | Variable substitution |
| File Ops | fs-extra | Cross-platform file operations |
| Git | Terminal commands | Repository initialization |
| GitHub | Octokit REST API | Repository creation |
| Build | TypeScript Compiler | ES2020 → CommonJS |

## Testing Strategy

### Manual Testing Checklist
- [ ] Extension activates without errors
- [ ] Webview displays correctly
- [ ] All form validations work
- [ ] File generation succeeds
- [ ] Generated projects run
- [ ] Git initialization works
- [ ] GitHub integration works
- [ ] Walkthrough triggers

### Future: Automated Testing
- Unit tests for TemplateEngine
- Integration tests for GitHub service
- E2E tests with Extension Test Runner

## Deployment

### Development
```bash
npm install
npm run compile
# Press F5 in VS Code
```

### Packaging
```bash
npm install -g @vscode/vsce
vsce package
# Creates fullstackgenie-1.0.0.vsix
```

### Distribution
1. **Manual:** Share `.vsix` file
2. **Marketplace:** `vsce publish`
3. **GitHub Releases:** Attach to release

## Future Enhancements

### Planned Features
- [ ] More templates (Vue, Express, Django)
- [ ] Docker support
- [ ] Testing scaffold (Jest, Pytest)
- [ ] CI/CD templates (GitHub Actions, GitLab CI)
- [ ] Deployment scripts (Vercel, AWS, Azure)
- [ ] Database migrations
- [ ] Monorepo support (Nx, Turborepo)

### Technical Debt
- Add comprehensive error handling
- Add telemetry (opt-in)
- Add extension settings UI
- Improve template discovery
- Add template validation

## References

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Webview API](https://code.visualstudio.com/api/extension-guides/webview)
- [EJS Documentation](https://ejs.co/)
- [Octokit REST API](https://octokit.github.io/rest.js/)

---

**Last Updated:** February 5, 2026  
**Version:** 1.0.0
