/* global acquireVsCodeApi */

const vscode = acquireVsCodeApi();
let currentStep = 1;

function nextStep(step) {
    console.log('Next step:', step, 'Current step:', currentStep);
    const errorDiv = document.getElementById('projectNameError');
    if (currentStep === 1) {
        const projectName = document.getElementById('projectName').value.trim();
        console.log('Project name entered:', JSON.stringify(projectName));
        if (!projectName) {
            console.error('Empty project name');
            if (errorDiv) {
                errorDiv.textContent = 'Please enter a project name';
                errorDiv.style.display = 'block';
            }
            return;
        }
        if (!/^[a-z0-9\-]+$/.test(projectName)) {
            console.error('Invalid project name format:', projectName);
            if (errorDiv) {
                errorDiv.textContent = `Invalid name: "${projectName}". Use only lowercase letters, numbers, and hyphens.`;
                errorDiv.style.display = 'block';
            }
            return;
        }
        if (errorDiv) errorDiv.style.display = 'none';
    }
    const currentStepEl = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
    const nextStepEl = document.querySelector(`.wizard-step[data-step="${step}"]`);
    console.log('Current step element:', currentStepEl);
    console.log('Next step element:', nextStepEl);
    if (currentStepEl) currentStepEl.classList.remove('active');
    if (nextStepEl) {
        nextStepEl.classList.add('active');
        console.log('Step', step, 'is now active');
    } else {
        console.error('Could not find step', step);
    }
    currentStep = step;
}

function prevStep(step) {
    console.log('Previous step:', step);
    document.querySelector(`.wizard-step[data-step="${currentStep}"]`).classList.remove('active');
    currentStep = step;
    document.querySelector(`.wizard-step[data-step="${step}"]`).classList.add('active');
}

window.nextStep = nextStep;
window.prevStep = prevStep;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Webview loaded');

    // Attach event listeners to navigation buttons
    const step1Next = document.getElementById('step1Next');
    const step2Back = document.getElementById('step2Back');
    const step2Next = document.getElementById('step2Next');
    const step3Back = document.getElementById('step3Back');

    if (step1Next) {
        console.log('Step 1 Next button found');
        step1Next.addEventListener('click', () => {
            console.log('Step 1 Next button clicked');
            nextStep(2);
        });
    } else {
        console.error('ERROR: step1Next button not found!');
    }
    if (step2Back) {
        step2Back.addEventListener('click', () => prevStep(1));
    }
    if (step2Next) {
        step2Next.addEventListener('click', () => nextStep(3));
    }
    if (step3Back) {
        step3Back.addEventListener('click', () => prevStep(2));
    }

    // Vue and Express are now available!
    // const comingSoonOptions = document.querySelectorAll('input[value="vue"], input[value="express"]');
    // comingSoonOptions.forEach(option => {
    //     option.disabled = true;
    //     option.parentElement.style.opacity = '0.5';
    //     option.parentElement.style.cursor = 'not-allowed';
    // });

    const form = document.getElementById('genieForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const config = {
                projectName: formData.get('projectName'),
                frontend: formData.get('frontend'),
                backend: formData.get('backend'),
                database: formData.get('database'),
                auth: document.getElementById('auth').checked,
                createGitHubRepo: document.getElementById('createGitHubRepo').checked
            };
            form.style.display = 'none';
            document.getElementById('progress').style.display = 'block';
            vscode.postMessage({ command: 'generate', config: config });
        });
    }
});

window.addEventListener('message', event => {
    const message = event.data;
    if (message.command === 'error') {
        alert(message.text);
        document.getElementById('genieForm').style.display = 'block';
        document.getElementById('progress').style.display = 'none';
    }
});