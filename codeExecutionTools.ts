import { exec } from 'child_process';

// Function to execute code
export async function executeCode(code: string): Promise<string> {
    try {
        exec(code, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing code: ${error}`);
                return `Error executing code: ${error.message}`;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            return stdout;
        });
        return `Code executed successfully.`;
    } catch (error: any) {
        console.error('Error executing code:', error);
        return `Could not execute code. ${error.message}`;
    }
}