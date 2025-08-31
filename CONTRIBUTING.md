# Contributing to SP3 Vote Core

First off, thank you for considering contributing to SP3 Vote Core! We welcome any and all contributions, from bug reports to feature suggestions and code improvements. This project is a collaborative effort, and we're excited to have you join us.

This document provides a set of guidelines for contributing to the project.

## Code of Conduct

This project and everyone participating in it is governed by the [SP3 Vote Core Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## How Can I Contribute?

There are many ways to contribute, from writing code and documentation to submitting bug reports and feature requests.

### Reporting Bugs

If you find a bug, please ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/PS3stack/iwb25-384-ps3stack/issues).

When you are creating a bug report, please include as many details as possible:

-   A clear and descriptive title.
-   A step-by-step description of how to reproduce the issue.
-   The expected behavior and what actually happened.
-   Screenshots or animated GIFs, if applicable.
-   Details about your environment (OS, browser version, etc.).

### Suggesting Enhancements

If you have an idea for a new feature or an improvement to an existing one, please open an issue using the "Feature Request" template. Provide a clear description of the feature, why it's needed, and any potential implementation ideas.

### Your First Code Contribution

Ready to contribute code? Here’s how to set up your environment and submit your changes.

1.  **Fork the Repository**
    Click the "Fork" button at the top right of the repository page. This creates a copy of the project in your own GitHub account.

2.  **Clone Your Fork**
    Clone your forked repository to your local machine:
    ```bash
    git clone [https://github.com/PS3stack/iwb25-384-ps3stack.git](https://github.com/PS3stack/iwb25-384-ps3stack.git)
    cd iwb25-384-ps3stack
    ```

3.  **Create a New Branch**
    Create a new branch for your changes. Use a descriptive name, like `feat/add-new-chart` or `fix/login-validation-bug`.
    ```bash
    git checkout -b your-branch-name
    ```

4.  **Make Your Changes**
    Now you can start making your changes to the code. This is a monorepo, so you'll find the frontend, API gateway, and microservices in their respective directories.

5.  **Commit Your Changes**
    Once you're happy with your changes, commit them with a clear and descriptive message. We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
    ```bash
    # Example commit messages
    git commit -m "feat: Add CSV download button to results page"
    git commit -m "fix: Correct validation logic for voter ID input"
    ```

6.  **Push to Your Fork**
    Push your changes to your forked repository on GitHub.
    ```bash
    git push origin your-branch-name
    ```

7.  **Create a Pull Request (PR)**
    Go to your forked repository on GitHub and click the "Compare & pull request" button. Fill out the PR template with details about your changes, and submit it for review.

## Development Setup

This project is a monorepo containing multiple applications and packages.

-   **Frontend:** A Next.js application located in `/frontend`.
-   **API Gateway:** A Ballerina application in `/api-gateway`.
-   **Microservices:** Individual Ballerina services located in `/services`.

To get started, ensure you have Node.js and the Ballerina compiler installed. Refer to the `README.md` file in the root directory for detailed setup instructions.

## Pull Request Process

1.  Once you submit a Pull Request, the project maintainers will be notified.
2.  Your PR will be reviewed for code quality, correctness, and adherence to the project's goals. You may be asked to make changes based on the feedback.
3.  Once your PR is approved and all checks have passed, a maintainer will merge it into the `dev` branch.

Thank you again for your contribution!
