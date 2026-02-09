export interface ProjectConfig {
    projectName: string;
    frontend: 'react' | 'vue' | 'none';
    backend: 'fastapi' | 'express' | 'none';
    database: 'postgres' | 'mongodb' | 'none';
    auth: boolean;
    createGitHubRepo: boolean;
}

export interface TemplateVariables {
    projectName: string;
    frontendPort: number;
    backendPort: number;
    databaseUrl?: string;
    authDomain?: string;
}
