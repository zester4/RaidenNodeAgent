import { Octokit } from "@octokit/rest";
import { z } from 'zod';

//Zod schema for username
const usernameSchema = z.string().min(1);

//Zod schema for owner and repo
const ownerRepoSchema = z.string().min(1);

// Zod schema for file path validation
const filePathSchema = z.string().min(1);

const githubToken = process.env.GITHUB_TOKEN

if (!githubToken) {
    throw new Error('GITHUB_TOKEN is not set in .env file.');
}

// Initialize Octokit
const octokit = new Octokit({
    auth: githubToken,
});

// Function to list repositories for a user
export async function listRepos(username: string): Promise<string> {
    try {
        usernameSchema.parse(username)
        const response = await octokit.repos.listForUser({
            username: username,
        });

        const repoNames = response.data.map(repo => repo.name).join('\n');
        return `Repositories for ${username}:\n${repoNames}`;
    } catch (error: any) {
        console.error('Error listing repositories:', error);
        return `Could not list repositories for ${username}. ${error.message}`;
    }
}

// Function to get repository information
export async function getRepo(owner: string, repo: string): Promise<string> {
    try {
        ownerRepoSchema.parse(owner)
        ownerRepoSchema.parse(repo)
        const response = await octokit.repos.get({
            owner: owner,
            repo: repo,
        });

        return `Repository information for ${owner}/${repo}:\n${JSON.stringify(response.data)}`
    } catch (error: any) {
        console.error('Error getting repository:', error);
        return `Could not get repository information for ${owner}/${repo}. ${error.message}`;
    }
}

// Function to list files in a repository
export async function listFiles(owner: string, repo: string, path: string): Promise<string> {
    try {
        ownerRepoSchema.parse(owner)
        ownerRepoSchema.parse(repo)
        filePathSchema.parse(path)
        const response = await octokit.repos.getContent({
            owner: owner,
            repo: repo,
            path: path,
        });

        // @ts-ignore
        if (Array.isArray(response.data)) {
            // @ts-ignore
            const fileNames = response.data.map(file => file.name).join('\n');
            return `Files in ${owner}/${repo} at ${path}:\n${fileNames}`;
        } else {
            return `Could not list files at ${path} because it is not a directory.`
        }

    } catch (error: any) {
        console.error('Error listing files:', error);
        return `Could not list files in ${owner}/${repo} at ${path}. ${error.message}`;
    }
}

// Function to read a file from a repository
export async function readGithubFile(owner: string, repo: string, path: string): Promise<string> {
    try {
        ownerRepoSchema.parse(owner)
        ownerRepoSchema.parse(repo)
        filePathSchema.parse(path)
        const response = await octokit.repos.getContent({
            owner: owner,
            repo: repo,
            path: path,
        });

        // @ts-ignore
        if (response.data.content) {
            // @ts-ignore
            const content = Buffer.from(response.data.content, response.data.encoding).toString();
            return `Content of ${owner}/${repo} at ${path}:\n${content}`;
        } else {
            return `Could not read file at ${path}.`
        }
    } catch (error: any) {
        console.error('Error reading file:', error);
        return `Could not read file ${owner}/${repo} at ${path}. ${error.message}`;
    }
}

// Function to create a repository
export async function createRepo(name: string, description: string, privateRepo: boolean): Promise<string> {
    try {
        usernameSchema.parse(name)

        const response = await octokit.repos.createForAuthenticatedUser({
            name: name,
            description: description,
            private: privateRepo,
        });

        return `Repository ${name} created successfully! ${response.data.html_url}`;
    } catch (error: any) {
        console.error('Error creating repository:', error);
        return `Could not create repository ${name}. ${error.message}`;
    }
}

// Function to create a file in a repository
export async function createFile(owner: string, repo: string, path: string, content: string, message: string): Promise<string> {
    try {
        ownerRepoSchema.parse(owner)
        ownerRepoSchema.parse(repo)
        filePathSchema.parse(path)

        const response = await octokit.repos.createOrUpdateFileContents({
            owner: owner,
            repo: repo,
            path: path,
            message: message,
            content: Buffer.from(content).toString('base64'),
            committer: {
                name: 'Raiden Agent',
                email: 'raidenagent@example.com'
            },
            author: {
                name: 'Raiden Agent',
                email: 'raidenagent@example.com'
            }
        });

        return `File ${path} created successfully! ${response.data.commit.html_url}`;
    } catch (error: any) {
        console.error('Error creating file:', error);
        return `Could not create file ${path}. ${error.message}`;
    }
}

// Function to update a file in a repository
export async function updateFile(owner: string, repo: string, path: string, content: string, message: string): Promise<string> {
    try {
        ownerRepoSchema.parse(owner)
        ownerRepoSchema.parse(repo)
        filePathSchema.parse(path)

        // Get the sha of the file to update
        const getFileResponse = await octokit.repos.getContent({
            owner: owner,
            repo: repo,
            path: path,
        });

        // @ts-ignore
        const sha = getFileResponse.data.sha

        const response = await octokit.repos.createOrUpdateFileContents({
            owner: owner,
            repo: repo,
            path: path,
            message: message,
            content: Buffer.from(content).toString('base64'),
            sha: sha,
            committer: {
                name: 'Raiden Agent',
                email: 'raidenagent@example.com'
            },
            author: {
                name: 'Raiden Agent',
                email: 'raidenagent@example.com'
            }
        });

        return `File ${path} updated successfully! ${response.data.commit.html_url}`;
    } catch (error: any) {
        console.error('Error updating file:', error);
        return `Could not update file ${path}. ${error.message}`;
    }
}

// Function to delete a file in a repository
export async function deleteFile(owner: string, repo: string, path: string, message: string): Promise<string> {
    try {
        ownerRepoSchema.parse(owner)
        ownerRepoSchema.parse(repo)
        filePathSchema.parse(path)

        // Get the sha of the file to delete
        const getFileResponse = await octokit.repos.getContent({
            owner: owner,
            repo: repo,
            path: path,
        });

         // @ts-ignore
        const sha = getFileResponse.data.sha

        const response = await octokit.repos.deleteFile({
            owner: owner,
            repo: repo,
            path: path,
            message: message,
            sha: sha,
            committer: {
                name: 'Raiden Agent',
                email: 'raidenagent@example.com'
            },
            author: {
                name: 'Raiden Agent',
                email: 'raidenagent@example.com'
            }
        });

        return `File ${path} deleted successfully!`
    } catch (error: any) {
        console.error('Error deleting file:', error);
        return `Could not delete file ${path}. ${error.message}`;
    }
}

// Function to create an issue
export async function createIssue(owner: string, repo: string, title: string, body: string): Promise<string> {
    try {
        ownerRepoSchema.parse(owner)
        ownerRepoSchema.parse(repo)

        const response = await octokit.issues.create({
            owner: owner,
            repo: repo,
            title: title,
            body: body,
        });

        return `Issue created successfully! ${response.data.html_url}`;
    } catch (error: any) {
        console.error('Error creating issue:', error);
        return `Could not create issue. ${error.message}`;
    }
}

export async function closeIssue(owner: string, repo: string, issueNumber: number): Promise<string> {
    try {
        ownerRepoSchema.parse(owner)
        ownerRepoSchema.parse(repo)

        const response = await octokit.issues.update({
            owner: owner,
            repo: repo,
            issue_number: issueNumber,
            state: 'closed',
        });

        return `Issue closed successfully!`
    } catch (error: any) {
        console.error('Error closing issue:', error);
        return `Could not close issue. ${error.message}`;
    }
}