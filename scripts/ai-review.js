import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            if (dirent.name === 'node_modules' || dirent.name === '.git' || dirent.name === 'dist' || dirent.name === 'public') {
                return [];
            }
            return getFiles(res);
        } else {
            return res;
        }
    }));
    return files.flat();
}

async function main() {
    try {
        const rootDir = path.resolve(__dirname, '..');
        const allFiles = await getFiles(rootDir);

        const readmePath = allFiles.find(f => path.basename(f).toLowerCase() === 'readme.md');
        const srcFiles = allFiles.filter(f => f.includes('/src/') && (f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.css')));

        let prompt = "You are an expert code reviewer and project manager. Please review the following project files.\n\n";

        if (readmePath) {
            const content = await fs.readFile(readmePath, 'utf-8');
            prompt += `--- README.md ---\n${content}\n\n`;
        } else {
            prompt += "WARNING: No README.md found.\n\n";
        }

        prompt += "--- Source Code ---\n";
        for (const file of srcFiles) {
            const relativePath = path.relative(rootDir, file);
            const content = await fs.readFile(file, 'utf-8');
            prompt += `File: ${relativePath}\n\`\`\`\n${content}\n\`\`\`\n\n`;
        }

        prompt += `
    Please evaluate the project based on the following criteria:
    1. **README Completeness**: Is the README up to date? Does it explain how to run the project? Does it describe the features?
    2. **Code Quality**: Is the code well-written, following best practices? Are there any potential bugs or improvements?
    3. **Test Coverage**: Do the tests seem adequate for the provided code? (Note: I have provided the test files as part of the source code if they exist in src/).

    Provide a summary of your findings and specific actionable recommendations.
    `;

        console.log("Analyzing project with Gemini...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("\n--- AI Review Report ---\n");
        console.log(text);

    } catch (error) {
        console.error("Error during AI review:", error);
        process.exit(1);
    }
}

main();
