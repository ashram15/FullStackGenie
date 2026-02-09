import * as vscode from 'vscode';

export class GenieWebviewProvider {
    constructor(private readonly extensionUri: vscode.Uri) { }

    public getHtmlContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'media', 'webview.css')
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'media', 'webview.js')
        );

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline';">
    <link href="${styleUri}" rel="stylesheet">
    <title>Full Stack Genie - New Project</title>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧞 Full Stack Genie</h1>
            <p class="tagline">Skip the boilerplate. Start coding in 60 seconds.</p>
        </div>

        <form id="genieForm">
            <div class="wizard-step active" data-step="1">
                <h2>Step 1: Project Name</h2>
                <div class="form-group">
                    <label for="projectName">What's your project called?</label>
                    <input 
                        type="text" 
                        id="projectName" 
                        name="projectName" 
                        placeholder="my-awesome-app"
                        required
                    >
                    <span class="hint">Use lowercase letters, numbers, and hyphens only</span>
                    <div id="projectNameError" style="color: #ff6b6b; margin-top: 8px; display: none;"></div>
                </div>
                <button type="button" class="btn btn-primary" id="step1Next">
                    Next →
                </button>
            </div>

            <div class="wizard-step" data-step="2">
                <h2>Step 2: Choose Your Stack</h2>
                
                <div class="form-group">
                    <label>Frontend Framework</label>
                    <div class="radio-group">
                        <label class="radio-card">
                            <input type="radio" name="frontend" value="react" checked>
                            <div class="card-content">
                                <span class="icon">⚛️</span>
                                <span class="label">React</span>
                                <span class="description">With Vite for fast HMR</span>
                            </div>
                        </label>
                        <label class="radio-card">
                            <input type="radio" name="frontend" value="vue">
                            <div class="card-content">
                                <span class="icon">💚</span>
                                <span class="label">Vue 3</span>
                                <span class="description">Progressive framework</span>
                            </div>
                        </label>
                        <label class="radio-card">
                            <input type="radio" name="frontend" value="none">
                            <div class="card-content">
                                <span class="icon">🚫</span>
                                <span class="label">None</span>
                                <span class="description">Backend only</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Backend Framework</label>
                    <div class="radio-group">
                        <label class="radio-card">
                            <input type="radio" name="backend" value="fastapi" checked>
                            <div class="card-content">
                                <span class="icon">⚡</span>
                                <span class="label">FastAPI</span>
                                <span class="description">Modern Python framework</span>
                            </div>
                        </label>
                        <label class="radio-card">
                            <input type="radio" name="backend" value="express">
                            <div class="card-content">
                                <span class="icon">📦</span>
                                <span class="label">Express</span>
                                <span class="description">Fast Node.js framework</span>
                            </div>
                        </label>
                        <label class="radio-card">
                            <input type="radio" name="backend" value="none">
                            <div class="card-content">
                                <span class="icon">🚫</span>
                                <span class="label">None</span>
                                <span class="description">Frontend only</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="button-group">
                    <button type="button" class="btn btn-secondary" id="step2Back">
                        ← Back
                    </button>
                    <button type="button" class="btn btn-primary" id="step2Next">
                        Next →
                    </button>
                </div>
            </div>

            <div class="wizard-step" data-step="3">
                <h2>Step 3: Additional Features</h2>
                
                <div class="form-group">
                    <label>Database</label>
                    <div class="radio-group">
                        <label class="radio-card">
                            <input type="radio" name="database" value="postgres">
                            <div class="card-content">
                                <span class="icon">🐘</span>
                                <span class="label">PostgreSQL</span>
                            </div>
                        </label>
                        <label class="radio-card">
                            <input type="radio" name="database" value="mongodb">
                            <div class="card-content">
                                <span class="icon">🍃</span>
                                <span class="label">MongoDB</span>
                            </div>
                        </label>
                        <label class="radio-card">
                            <input type="radio" name="database" value="none" checked>
                            <div class="card-content">
                                <span class="icon">🚫</span>
                                <span class="label">None</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="auth" id="auth">
                        <span>Include Auth0 scaffolding</span>
                    </label>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="createGitHubRepo" id="createGitHubRepo">
                        <span>Create GitHub repository</span>
                    </label>
                    <span class="hint">Requires GitHub Personal Access Token</span>
                </div>

                <div class="button-group">
                    <button type="button" class="btn btn-secondary" id="step3Back">
                        ← Back
                    </button>
                    <button type="submit" class="btn btn-success">
                        🧞 Generate Project
                    </button>
                </div>
            </div>
        </form>

        <div id="progress" class="progress-container" style="display: none;">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <p class="progress-text">Full Stack Genie is granting your wish...</p>
        </div>
    </div>

    <script src="${scriptUri}"></script>
</body>
</html>`;
    }
}
