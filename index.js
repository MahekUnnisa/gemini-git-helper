#!/usr/bin/env node
import os from 'os';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import colors from 'colors';
import readline from 'readline';
import { spawn } from 'child_process';
import readlineSync from 'readline-sync';
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

async function main() {
    const args = process.argv.slice(2);
    const isAmend = args.includes('--amend');

    console.log(colors.blue('Preparing to commit...'));
    if (args.includes('commit') || isAmend) {
        const useAI = readlineSync.question(colors.green('Bot: Do you want to generate a commit message using AI? (y/n) '));

        if (useAI.toLowerCase() === 'y') {
            console.log(colors.yellow('Generating commit message using AI...'));
            const apiKey = process.env.API_KEY;

            if (!apiKey) {
                console.error(colors.red('Error: ') + 'API key not provided');
                return;
            }

            const stagedChanges = await getStagedChanges();

            if (stagedChanges.length === 0) {
                console.error(colors.red('Error: ') + 'No changes staged');
                return;
            }
            const commitMessage = await generateCommitMessage(stagedChanges);

            openCommitEditor(commitMessage, isAmend);
        } else {
            console.log(colors.yellow('Opening commit editor without AI-generated message...'));
            openCommitEditor('', isAmend);
        }
    } else {
        console.log(colors.red('Unknown command. Please use "gemini-git commit" or "gemini-git commit --amend"'));
    }
}

async function getStagedChanges() {
    const diffProcess = spawn('git', ['diff', '--cached']);
    const diffOutput = diffProcess.stdout;
    let stagedChanges = '';

    const rl = readline.createInterface({
        input: diffOutput,
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        stagedChanges += line + '\n';
    }

    return stagedChanges;
}

async function generateCommitMessage(stagedChanges) {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log(colors.green('Processing...'));
    const msg = "Write a neat clear but concise commit message for the given git diff and make sure to use appropriate headings and numbered lists: ";

    const result = await model.generateContent(`${msg} \nDiff: ${stagedChanges}`);
    const response = await result.response;
    const text = response.text();

    return text
}

function openCommitEditor(commitMessage, amend = false) {
    const tempFilePath = path.join(os.tmpdir(), 'COMMIT_EDITMSG');
    let finalCommitMessage = commitMessage;

    if (amend) {
        const existingCommitMessage = fs.readFileSync('.git/COMMIT_EDITMSG', 'utf-8');
        finalCommitMessage = `${existingCommitMessage.trim()}\n\n${commitMessage}`;
    }

    fs.writeFileSync(tempFilePath, finalCommitMessage);

    const args = amend ? ['commit', '--amend', '--edit', '--file', tempFilePath] : ['commit', '--edit', '--file', tempFilePath];
    const commitProcess = spawn('git', args, {
        stdio: 'inherit'
    });

    commitProcess.on('close', (code) => {
        fs.unlinkSync(tempFilePath);
        if (code !== 0) {
            console.error(colors.red('Error:') + ' Commit failed');
        } else {
            console.log(colors.green('Commit successful'));
        }
    });
}

main().catch(err => console.error(colors.red('Error:'), err));