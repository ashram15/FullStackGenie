import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { GenieWebviewProvider } from './webview/GenieWebviewProvider';
import { TemplateEngine } from './templates/TemplateEngine';
import { GitHubService } from './services/GitHubService';
import { ProjectConfig } from './types';

export function activate(context: vscode.ExtensionContext) {
    console.log('Full Stack Genie is now active! 🧞');

    // Register the webview provider
    const webviewProvider = new GenieWebviewProvider(context.extensionUri);

    // Register command to create new project
    let disposable = vscode.commands.registerCommand('fullstackgenie.newProject', async () => {
        const panel = vscode.window.createWebviewPanel(
            'fullstackgenieWizard',
            'Full Stack Genie: New Project',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(context.extensionUri, 'media'),
                    vscode.Uri.joinPath(context.extensionUri, 'out')
                ]
            }
        );

        panel.webview.html = webviewProvider.getHtmlContent(panel.webview, context.extensionUri);

        // Handle messages from webview
        panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'generate':
                        await handleProjectGeneration(message.config, context);
                        panel.dispose();
                        break;
                    case 'cancel':
                        panel.dispose();
                        break;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);

    // Register command to open env file
    context.subscriptions.push(
        vscode.commands.registerCommand('fullstackgenie.openEnv', async () => {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (workspaceFolder) {
                const envPath = vscode.Uri.joinPath(workspaceFolder.uri, '.env');
                const doc = await vscode.workspace.openTextDocument(envPath);
                await vscode.window.showTextDocument(doc);
            }
        })
    );

    // Register command to start dev server
    context.subscriptions.push(
        vscode.commands.registerCommand('fullstackgenie.startDevServer', async () => {
            const terminal = vscode.window.createTerminal('Full Stack Genie Dev Server');
            terminal.show();
            terminal.sendText('echo "Starting development servers..."');
            terminal.sendText('cd frontend && npm run dev &');
            terminal.sendText('cd backend && python main.py');
        })
    );
}

async function handleProjectGeneration(config: ProjectConfig, context: vscode.ExtensionContext) {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
        vscode.window.showErrorMessage('Please open a folder first!');
        return;
    }

    // Check if folder is empty
    const files = await fs.readdir(workspaceFolder.uri.fsPath);
    if (files.length > 0) {
        const answer = await vscode.window.showWarningMessage(
            'This folder is not empty. Continue?',
            'Yes',
            'No'
        );
        if (answer !== 'Yes') {
            return;
        }
    }

    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: 'Full Stack Genie is granting your wish...',
            cancellable: false
        },
        async (progress) => {
            try {
                // Step 1: Copy template files
                progress.report({ increment: 0, message: 'Copying template files...' });
                const templateEngine = new TemplateEngine(context.extensionUri);
                await templateEngine.generateProject(workspaceFolder.uri.fsPath, config);
                progress.report({ increment: 30 });

                // Step 2: Initialize git
                progress.report({ increment: 30, message: 'Initializing git repository...' });
                await initializeGit(workspaceFolder.uri.fsPath);
                progress.report({ increment: 50 });

                // Step 3: Create GitHub repo (if enabled)
                if (config.createGitHubRepo) {
                    progress.report({ increment: 50, message: 'Creating GitHub repository...' });
                    const githubService = new GitHubService();
                    await githubService.createRepo(config.projectName, workspaceFolder.uri.fsPath);
                }
                progress.report({ increment: 100 });

                // Show success message
                vscode.window.showInformationMessage(
                    `🧞 Your project "${config.projectName}" is ready!`,
                    'Open .env',
                    'Start Walkthrough'
                ).then((action) => {
                    if (action === 'Open .env') {
                        vscode.commands.executeCommand('fullstackgenie.openEnv');
                    } else if (action === 'Start Walkthrough') {
                        vscode.commands.executeCommand('workbench.action.openWalkthrough', 'fullstackgenie.getStarted');
                    }
                });

                // Open README
                const readmePath = vscode.Uri.joinPath(workspaceFolder.uri, 'README.md');
                const doc = await vscode.workspace.openTextDocument(readmePath);
                await vscode.window.showTextDocument(doc, { preview: false });

            } catch (error) {
                vscode.window.showErrorMessage(`Failed to generate project: ${error}`);
            }
        }
    );
}

async function initializeGit(projectPath: string) {
    const terminal = vscode.window.createTerminal({ name: 'Full Stack Genie Setup', cwd: projectPath });
    terminal.sendText('git init');
    terminal.sendText('git add .');
    terminal.sendText('git commit -m "Initial commit by Full Stack Genie 🧞"');
    // Don't show terminal unless there's an error
    terminal.hide();
}

export function deactivate() { }
