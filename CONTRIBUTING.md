# Contributing to SocialTruth DAO

First off, thank you for considering contributing to SocialTruth DAO! It's people like you that make SocialTruth DAO such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain the behavior you expected to see**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the JavaScript/HTML/Haskell styleguides
* End all files with a newline
* Avoid platform-dependent code

## Development Process

1. Fork the repo
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
6. Push to the branch:
   ```bash
   git push origin feature/my-new-feature
   ```
7. Submit a pull request

## Development Setup

### Prerequisites

- Cardano node (for smart contract development)
- Cardano CLI
- Haskell/Cabal (for Plutus contracts)
- Modern web browser
- Cardano wallet browser extension

### Setting Up Your Development Environment

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/socialtruth-dao.git
   cd socialtruth-dao
   ```

2. Install dependencies:
   ```bash
   cabal update
   cabal build
   ```

3. Set up your test wallet with test tokens

### Testing

Before submitting a pull request, please:

1. Test on Cardano testnet first
2. Verify wallet connections work
3. Test transaction signing
4. Verify error handling
5. Check responsive design on mobile
6. Test with different wallets (Nami, Eternl, Flint, Lace)

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

* Use semicolons
* 4 spaces for indentation
* Use template literals for string interpolation
* Use async/await for asynchronous code
* Document functions with JSDoc comments

### Haskell Styleguide

* Follow standard Haskell formatting
* Use meaningful variable names
* Add type signatures for all top-level functions
* Document complex logic with comments

### HTML/CSS Styleguide

* Use Tailwind CSS utility classes
* Keep HTML semantic
* Ensure accessibility (ARIA labels, etc.)
* Mobile-first responsive design

## Smart Contract Development

When contributing to smart contracts:

1. **Security First**: All contract changes must be thoroughly tested
2. **Documentation**: Document all validator logic
3. **Testing**: Include test cases for all scenarios
4. **Audit Trail**: Explain why changes are necessary

### Contract Testing Checklist

- [ ] Test on Cardano testnet
- [ ] Verify all redeemer paths work
- [ ] Check datum structure is correct
- [ ] Ensure no infinite loops
- [ ] Validate all user inputs
- [ ] Test edge cases
- [ ] Verify transaction fees are reasonable

## Documentation

* Keep documentation up to date with code changes
* Use clear, concise language
* Include code examples where helpful
* Update README.md if adding new features

## Community

* Be respectful and inclusive
* Help other contributors
* Share knowledge and best practices
* Participate in discussions

## Questions?

Feel free to ask questions in:
* GitHub Issues
* GitHub Discussions
* Twitter: @SocialTruthDAO

Thank you for contributing to SocialTruth DAO! 🎉
