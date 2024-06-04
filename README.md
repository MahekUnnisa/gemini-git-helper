# gemini-git-helper

## Description

`gemini-git-helper` is a command line tool designed to assist with git commits by providing AI-generated commit messages. It can also amend existing commits, concatenating the new commit message to the existing one.

## Features

- Generate commit messages using AI.
- Support for both standard commits and amended commits.
- Interactive prompts to guide the user through the commit process.
- Clear user feedback on the status of commit operations.

## Installation

Install the package globally using npm:

```sh
npm install -g gemini-git-helper
```

## Setup

Create a `.env` file in your working directory and add your Google Generative AI API key:

```plaintext
API_KEY=your_google_generative_ai_api_key
```

Alternatively, you can export the API key as an environment variable:

```sh
export API_KEY=your_google_generative_ai_api_key
```

To obtain an api key, go to [Google AI For Developers](https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=node#set-up-api-key)
## Usage

### Standard Commit

To perform a standard commit:

```sh
gemini-git commit
```

### Amend Commit

To amend the last commit:

```sh
gemini-git commit --amend
```

### Interactive Prompts

When you run the `commit` command, you will be prompted to choose whether to generate a commit message using AI:

```plaintext
Do you want to generate a commit message using AI? (yes/no)
```

- If you choose `y`, the tool will generate a commit message based on the staged changes and open the commit editor with the generated message.
- If you choose `n`, the commit editor will open without a pre-generated commit message.

## Example Workflow

1. **Stage Your Changes**:

    ```sh
    git add .
    ```

2. **Run the Commit Helper**:

    ```sh
    gemini-git commit
    ```

3. **Follow the Prompts**:

    Respond to the prompt about using AI to generate the commit message.

4. **Review and Edit the Commit Message**:

    The commit editor will open with the generated or empty commit message. Edit if necessary and save to complete the commit.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Google Generative AI](https://ai.google.dev/gemini-api/docs/get-started)
- [Colors](https://www.npmjs.com/package/colors)
- [Readline-sync](https://www.npmjs.com/package/readline-sync)
- [Dotenv](https://www.npmjs.com/package/dotenv)

---

By following the above instructions, you can leverage `gemini-git-helper` to streamline your commit process with AI-generated messages, making your commit history clearer and more informative.