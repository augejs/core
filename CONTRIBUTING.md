# Contribution to `augejs`

## Coding Guideline
We enforce code style rules using [ESLint](https://eslint.org/). Execute npm run lint to check your code for style issues.
You may also find an ESLint integration for your favorite IDE [here](https://eslint.org/docs/user-guide/integrations).

## Commit Message Format
*This specification is inspired by and supersedes the [AngularJS commit message format](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#).*

We adhere to the [Conventional Commits](https://conventionalcommits.org/) specification.

We have very precise rules over how our Git commit messages must be formatted.
This format leads to **easier to read commit history**.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### Commit Message Header
The message header is a single line that contains succinct description of the change containing a type, an optional scope and a subject.


```
<type>(<scope>): <subject>
  │       │          │
  │       │          └─⫸ This is a very short description of the change.
  │       │
  │       └─⫸ Commit Scope: Any name of scope.
  │
  └─⫸ Commit Type: feat|fix|docs|perf|refactor|test|chore
```

The `<type>` and `<subject>` fields are mandatory, the `(<scope>)` field is optional.

#### Commit Type
Must be one of the following:

* **feat**: A new feature (note: this will indicate a release)
* **fix**: A bug fix (note: this will indicate a release)
* **docs**: Documentation only changes
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **test**: Adding missing tests or correcting existing tests
* **chore** - changes to the build process or auxiliary tools and libraries such as documentation generation

#### Commit Scope
Scope can be anything specifying place of the commit change. For example $location, $browser, $compile, $rootScope, ngHref, ngClick, ngView, etc...

#### Commit Subject
This is a very short description of the change.

- Use the **imperative present tense**. Instead of "I added feature xy" or "Adding tests for" use "Add feature xy" or "Add tests for".
- It should be no more than **100 characters** long.

#### Commit Body (optional)
After the commit header, there should be an empty line followed by the optional commit body.
- Describe the intention and reasoning of the change.

#### Commit Message footer
The footer can contain information about breaking changes and is also the place to reference GitHub issues, Jira tickets, and other PRs that this commit closes or is related to.

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

Breaking Change section should start with the phrase "BREAKING CHANGE: " followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions.

## Reporting New Issues

- Please specify what kind of issue it is.
- Before you report an issue, please search for related issues. Make sure you are not going to open a duplicate issue.
- Explain your purpose clearly in tags(see **Useful Tags**), title, or content.

Egg group members will confirm the purpose of the issue, replace more accurate tags for it, identify related milestone, and assign developers working on it.
Tags can be divided into two groups, `type` and `scope`.

- type: What kind of issue, e.g. `feature`, `bug`, `documentation`, `performance`, `support` ...
-  scope: What did you modified. Which files are modified, e.g. `core: xx`, `plugin: xx`, `deps: xx`

## Submitting Code

### Submitting an Issue
Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. In order to reproduce bugs, we require that you provide a minimal reproduction. Having a minimal reproducible scenario gives us a wealth of important information without going back and forth to you with additional questions.

A minimal reproduction allows us to quickly confirm a bug (or point out a coding problem) as well as confirm that we are fixing the right problem.

We require a minimal reproduction to save maintainers' time and ultimately be able to fix more bugs. Often, developers find coding problems themselves while preparing a minimal reproduction. We understand that sometimes it might be hard to extract essential bits of code from a larger codebase but we really need to isolate the problem before we can fix it.

Unfortunately, we are not able to investigate / fix bugs without a minimal reproduction, so if we don't hear back from you, we are going to close an issue that doesn't have enough info to be reproduced.

You can file new issues by selecting from our new issue templates and filling out the issue template.

### Submitting a Pull Request (PR)

```bash
# Create a new branch for development. The name of branch should be semantic, avoiding words like 'update' or 'tmp'. We suggest to use feature/xxx, if the modification is about to implement a new feature.
$ git checkout -b branch-name

# Run the test after you finish your modification. Add new test cases or change old ones if you feel necessary
$ npm test

# If your modification pass the tests, congratulations it's time to push your work back to us. Notice that the commit message should be written in the following format.
$ git add . # git add -u to delete files
$ git commit -m "fix(role): role.use must xxx"
$ git push origin branch-name
```

Then you can create a Pull Request

No one can guarantee how much will be remembered about certain PR after some time. To make sure we can easily recap what happened previously, please provide the following information in your PR.

1. Need: What function you want to achieve (Generally, please point out which issue is related).
2. Updating Reason: Different with issue. Briefly describe your reason and logic about why you need to make such modification.
3. Related Testing: Briefly describe what part of testing is relevant to your modification.
4. User Tips: Notice for Egg users. You can skip this part, if the PR is not about update in API or potential compatibility problem.
