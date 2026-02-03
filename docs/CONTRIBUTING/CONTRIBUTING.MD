# How to Contribute

### 1. Fork the repository
Create a fork of this github repo to your own account.
### 2. Create a Branch
Create a new branch for your changes.
```bash
git checkout -b feature/your-feature-name
```
Use clear branch names, such as:
- ``feature/add-command``
- ``bugfix/bug-name``
- ``docs/readme-update``
### 3. Make Your Changes
- Follow the project's **[code style / formatting rules](./PROGRAMMING_GUIDE.md)**
- Keep code readable and consistent
- Avoid unrelated changes in the same commit
- Comment complex logic when necessary

If you add a new command:
- Place it in the correct category
     - Sub-directories are also allowed
- Keep one responsiblity per command
- Enure it follows existing command structure
### 4. Test Your Changes
Before Submitting:
- Run your bot locally
- Make sure there is no runtime errors
- Ensure existing commands still work as expected
### 5. Commit Your Changes
Write clear and meaningful commit messages.

**GOOD EXAMPLE**
```txt
[ADDITION] - Created a moderation warn command
[CHANGE] - Updated documentation for setup
[FIX] - Fixed crash in the command loader
```

**HERE IS WHAT NOT TO DO:**
```txt
update
fix a thing
changes
```
### 6. Open a Pull Request
When opening a PR:
- Clearly explain what your changes do
- Reference any related issue if applicable
- Keep the description short and clear

Your pull request may be reviewed and requested to be adjusted before merging.

## Code Guidelines
If you didn't read the **[Programming Style Guide](./PROGRAMMING_GUIDE.md)**, then heres a basic break down of whats in it, and what you would need to follow.

- Use descriptive variable and function names (when needed)
- Avoid deeply nested logic
- Keep files focused and organized

If a file is under 50 lines, comments are optional, unless the logic is complex.

## What NOT to Contribute
**Please Avoid:**
- Breaking existing functionality
- Adding unused dependencies
- Large refactors without discussion
- Hardcoding tokens, secrets, or private data

**Any pull request containing sensitive data will be rejected immediately.**

## Reporting Bugs or Suggestions
If you find a bug or have a suggestion:
- Open an issue
- Clearly describe the problem or idea
- Include steps to reproduce if reporting a bug

## Final Notes
This project is meant to be simple, clean and easy to build upon.
Contributions that improve the bots, functionality, and readability are always appreciated

**Thank you for contributing! ദ്ദി◝ ⩊ ◜)**