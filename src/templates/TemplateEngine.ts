import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as ejs from 'ejs';
import { ProjectConfig, TemplateVariables } from '../types';

export class TemplateEngine {
    private extensionUri: vscode.Uri;

    constructor(extensionUri: vscode.Uri) {
        this.extensionUri = extensionUri;
    }

    async generateProject(targetPath: string, config: ProjectConfig): Promise<void> {
        // Determine template name based on config
        const templateName = this.getTemplateName(config);
        const templatePath = vscode.Uri.joinPath(this.extensionUri, 'templates', templateName).fsPath;

        // Prepare template variables
        const variables: TemplateVariables = {
            projectName: config.projectName,
            frontendPort: 5173,
            backendPort: 8000,
            databaseUrl: this.getDatabaseUrl(config.database),
            authDomain: config.auth ? 'YOUR_AUTH0_DOMAIN' : undefined
        };

        // Copy and process template
        await this.copyTemplate(templatePath, targetPath, variables);
    }

    private getTemplateName(config: ProjectConfig): string {
        // For now, ignore auth option and use base templates
        // Map frontend-backend combinations to template directories
        if (config.frontend === 'react' && config.backend === 'fastapi') {
            return 'react-fastapi-auth0'; // Rename to react-fastapi later
        }
        if (config.frontend === 'vue' && config.backend === 'fastapi') {
            return 'vue-fastapi';
        }
        if (config.frontend === 'react' && config.backend === 'express') {
            return 'react-express';
        }
        if (config.frontend === 'vue' && config.backend === 'express') {
            return 'vue-express';
        }
        // Default fallback
        return 'react-fastapi-auth0';
    }

    private getDatabaseUrl(database: string): string | undefined {
        switch (database) {
            case 'postgres':
                return 'postgresql://user:password@localhost:5432/dbname';
            case 'mongodb':
                return 'mongodb://localhost:27017/dbname';
            default:
                return undefined;
        }
    }

    private async copyTemplate(
        templatePath: string,
        targetPath: string,
        variables: TemplateVariables
    ): Promise<void> {
        const files = await this.getAllFiles(templatePath);

        for (const file of files) {
            const relativePath = path.relative(templatePath, file);
            const targetFile = path.join(targetPath, relativePath);

            // Create directory if it doesn't exist
            await fs.ensureDir(path.dirname(targetFile));

            // Process .ejs files
            if (file.endsWith('.ejs')) {
                const template = await fs.readFile(file, 'utf-8');
                const rendered = ejs.render(template, variables);
                const finalPath = targetFile.replace('.ejs', '');
                await fs.writeFile(finalPath, rendered);
            } else {
                // Copy non-template files directly
                await fs.copy(file, targetFile);
            }
        }
    }

    private async getAllFiles(dirPath: string, arrayOfFiles: string[] = []): Promise<string[]> {
        const files = await fs.readdir(dirPath);

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                await this.getAllFiles(filePath, arrayOfFiles);
            } else {
                arrayOfFiles.push(filePath);
            }
        }

        return arrayOfFiles;
    }
}
