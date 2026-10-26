# Git Command Handbook

A practical Git reference for everyday development: commits, branches, merging, remotes, and release tags. Commands work in Git Bash, PowerShell, and most terminals unless noted.

> **Convention:** Replace placeholders such as `<branch>`, `<file>`, and `<tag>` with your own values. Do **not** type the angle brackets. Examples use `main` as the default branch.

## 1. Setup and inspect a repository

| Command | What it does |
|---|---|
| `git --version` | Show the installed Git version. |
| `git config --global user.name "Your Name"` | Set the author name used for future commits. |
| `git config --global user.email "you@example.com"` | Set the author email used for future commits. |
| `git config --global --list` | Show global Git configuration. |
| `git init` | Create a new local Git repository in the current directory. |
| `git clone <url>` | Download an existing repository and its history. |
| `git status` | Show current branch, staged changes, unstaged changes, and untracked files. |
| `git status -sb` | Show a compact branch and working-tree summary. |
| `git log --oneline --graph --decorate --all` | Visualize commits and branches in a compact graph. |
| `git show <commit>` | Inspect a commit and its patch. |
| `git diff` | Show unstaged changes. |
| `git diff --staged` | Show changes staged for the next commit. |

## 2. Stage and commit changes

A **commit** is a snapshot of staged changes. Git does not automatically commit all modified files.

| Command | What it does |
|---|---|
| `git add <file>` | Stage one file. |
| `git add .` | Stage changes under the current directory. |
| `git add -A` | Stage all changes in the repository, including deletions. |
| `git add -p` | Interactively stage selected parts of files. |
| `git restore --staged <file>` | Unstage a file without discarding edits. |
| `git commit -m "Add health endpoint"` | Create a commit from staged changes. |
| `git commit -am "Fix typo"` | Stage and commit modified/deleted **tracked** files; does not add new untracked files. |
| `git commit --amend` | Replace the most recent commit (message and/or staged contents). Rewrites its ID. |
| `git log -5 --oneline` | Show the five most recent commits. |
| `git show HEAD` | Inspect the latest commit. |

**Typical workflow:**

```bash
git status
git add src/routes/health.ts
git diff --staged
git commit -m "feat: add MongoDB health check"
git push origin main
```

### Commit message convention (optional)

- `feat: add health endpoint` — new feature
- `fix: handle database timeout` — bug fix
- `refactor: simplify auth service` — code restructuring
- `docs: update README` — documentation
- `test: cover refresh token rotation` — tests
- `chore: update dependencies` — maintenance

## 3. Branches

A **branch** is a movable pointer to a commit. Work on feature branches to keep `main` stable.

| Command | What it does |
|---|---|
| `git branch` | List local branches; `*` marks the current branch. |
| `git branch -a` | List local and remote-tracking branches. |
| `git branch -vv` | Show branch tips and upstream tracking information. |
| `git switch -c feature/health` | Create and switch to a new branch. |
| `git switch <branch>` | Switch to an existing local branch. |
| `git switch -` | Switch back to the previous branch. |
| `git branch <branch>` | Create a branch without switching. |
| `git branch -m <new-name>` | Rename the current branch. |
| `git branch -d <branch>` | Delete a local branch only if Git considers it merged. |
| `git branch -D <branch>` | Force-delete a local branch even if unmerged; use carefully. |
| `git push -u origin feature/health` | Publish the branch and set its upstream. |
| `git push origin --delete feature/health` | Delete the branch on `origin`. |
| `git fetch --prune` | Fetch updates and remove stale remote-tracking references. |

**Feature branch example:**

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/health
# Edit files
git add -A
git commit -m "feat: implement health route"
git push -u origin feature/health
```

## 4. Merge branches

A **merge** integrates changes from another branch into the branch you currently have checked out.

| Command | What it does |
|---|---|
| `git merge feature/health` | Merge `feature/health` into the **current** branch. |
| `git merge --no-ff feature/health` | Create a merge commit even if fast-forwarding is possible. |
| `git merge --ff-only feature/health` | Merge only when a fast-forward is possible; otherwise fail. |
| `git merge --squash feature/health` | Stage the combined changes for one new commit; does not record a merge relationship. |
| `git merge --abort` | Return to the pre-merge state when an in-progress merge can be aborted. |
| `git diff --name-only --diff-filter=U` | List files with unresolved merge conflicts. |

**Merge a completed feature into `main`:**

```bash
git switch main
git pull --ff-only origin main
git merge --no-ff feature/health
git push origin main
git branch -d feature/health
```

### Resolve a merge conflict

1. Run `git status` to see conflicted files.
2. Open each file and resolve sections marked `<<<<<<<`, `=======`, and `>>>>>>>`.
3. Stage resolved files with `git add <file>`.
4. Finish with `git merge --continue` (or `git commit`, where appropriate).
5. To cancel instead, use `git merge --abort`.

> **Direction matters:** If you are on `main`, `git merge feature/health` brings the feature into `main`. If you are on the feature branch, `git merge main` brings `main` into the feature.

## 5. Rebase vs. merge

`merge` preserves the branch topology; `rebase` replays commits on a new base, creating new commit IDs.

```bash
# While on your feature branch:
git fetch origin
git rebase origin/main

# If conflicts occur, resolve them, stage the files, then:
git rebase --continue

# Or cancel:
git rebase --abort
```

Avoid rebasing commits that teammates already rely on. If you must push a rebased branch that you own, `git push --force-with-lease` is safer than `--force` because it checks whether the remote has changed.

## 6. Remotes: fetch, pull, and push

| Command | What it does |
|---|---|
| `git remote -v` | Show configured remotes and their URLs. |
| `git remote add origin <url>` | Add a remote named `origin`. |
| `git remote set-url origin <url>` | Change the remote URL. |
| `git fetch origin` | Download remote objects and update remote-tracking refs; does not merge into your current branch. |
| `git pull --ff-only origin main` | Fetch `main` and update the current branch only if it can fast-forward. |
| `git pull --rebase origin main` | Fetch and rebase local commits on top of the fetched `main`. |
| `git push origin main` | Publish local `main` to the remote. |
| `git push -u origin <branch>` | Publish a branch and set upstream tracking. |
| `git push` | Push the current branch using its configured upstream and push settings. |

**Remember:** `fetch` downloads, `pull` downloads **and integrates**, and `push` uploads your commits/refs.

## 7. Tags and releases

A **tag** names a specific commit. Unlike a branch, a tag does not automatically move as new commits are created. Annotated tags are recommended for releases.

| Command | What it does |
|---|---|
| `git tag` | List local tags. |
| `git tag -l 'v2.*'` | List tags matching a pattern. |
| `git tag -a v2.3.0 -m "Release v2.3.0"` | Create an annotated tag at `HEAD`. |
| `git tag v2.3.0` | Create a lightweight tag at `HEAD`. |
| `git tag -a v2.3.0 <commit> -m "Release v2.3.0"` | Tag a specific older commit. |
| `git show v2.3.0` | Inspect a tag and its target commit. |
| `git push origin v2.3.0` | Publish one tag to the remote. |
| `git push origin --tags` | Publish all local tags not yet on the remote. |
| `git fetch --tags` | Fetch remote tags. |
| `git tag -d v2.3.0` | Delete a **local** tag. |
| `git push origin --delete v2.3.0` | Delete a **remote** tag. |
| `git switch --detach v2.3.0` | Inspect a tagged snapshot in detached-HEAD mode. |

### Example: release v2.3.0

```bash
git switch main
git pull --ff-only origin main
# Ensure tests and build pass before tagging.
git tag -a v2.3.0 -m "Release v2.3.0"
git push origin main
git push origin v2.3.0
```

**GitHub Actions tip:** A workflow triggered by `push` tags matching `v*` can build and publish a Docker image with both a version tag (such as `v2.3.0`) and `latest`. Tag pushes alone do not automatically create GitHub Releases unless your workflow explicitly does so.

> Avoid moving or reusing published release tags. If a release needs fixing, make a new commit and a new tag such as `v2.3.1`.

## 8. Undo mistakes safely

| Command | What it does |
|---|---|
| `git restore <file>` | Discard **unstaged** edits to a tracked file. Destructive. |
| `git restore --staged <file>` | Unstage without discarding edits. |
| `git revert <commit>` | Create a new commit that reverses a previous commit; good for shared branches. |
| `git reset --soft HEAD~1` | Remove the last commit locally but keep its changes staged. |
| `git reset --mixed HEAD~1` | Remove the last commit locally and keep changes unstaged. |
| `git reset --hard HEAD~1` | Discard the last commit and tracked working-tree changes. Destructive. |
| `git reflog` | Show recent movements of `HEAD` and branch refs; useful for recovery. |
| `git cherry-pick <commit>` | Apply the changes introduced by a specific commit to your current branch. |

**Shared branch rule:** Prefer `git revert` over `git reset` for commits already pushed and used by others.

## 9. Stash temporary changes

| Command | What it does |
|---|---|
| `git stash push -m "WIP health route"` | Temporarily store tracked-file changes. |
| `git stash push -u -m "WIP"` | Also include untracked files. |
| `git stash list` | Show saved stashes. |
| `git stash show -p stash@{0}` | Inspect the latest stash patch. |
| `git stash apply` | Reapply the latest stash without deleting it. |
| `git stash pop` | Reapply and, on success, remove the latest stash. |
| `git stash drop stash@{0}` | Delete a specific stash. |

In PowerShell, quote stash references if needed: `git stash show -p 'stash@{0}'`.

## 10. Complete feature-to-release workflow

```bash
# 1. Update main
git switch main
git pull --ff-only origin main

# 2. Create feature branch
git switch -c feature/mongodb-health

# 3. Develop and commit
git add -A
git commit -m "feat: add MongoDB ping health check"

# 4. Publish branch for review
git push -u origin feature/mongodb-health

# 5. After approval, merge into main
# (or merge the pull request on GitHub instead)
git switch main
git pull --ff-only origin main
git merge --no-ff feature/mongodb-health
git push origin main

# 6. Tag the tested release
git tag -a v2.3.0 -m "Release v2.3.0"
git push origin v2.3.0

# 7. Clean up local branch
git branch -d feature/mongodb-health
```

If a GitHub pull request was already merged, **do not merge it a second time locally**. Just pull the updated `main`, then tag the intended release commit.

## 11. Common mistakes to avoid

- **Committing secrets:** Put `.env`, API keys, and credentials in `.gitignore` before adding files. If a secret was committed, rotate it; deleting it from the latest commit does not remove it from history.
- **Working on the wrong branch:** Check `git status -sb` before committing or merging.
- **Using `git add .` blindly:** Review `git diff --staged` before committing.
- **Force-pushing `main`:** Avoid rewriting shared branch history.
- **Merging with uncommitted work:** Commit or stash first to reduce conflicts and confusion.
- **Tagging before validation:** Run your tests/build before publishing release tags.
- **Assuming a local tag is remote:** Tags need an explicit `git push origin <tag>`.

## 12. Quick cheat sheet

```bash
git status                                  # Current working state
git log --oneline --graph --all            # Commit graph
git add -A                                  # Stage all changes
git commit -m "message"                    # Commit staged changes
git switch -c feature/name                  # Create + switch branch
git switch main                             # Switch to main
git fetch origin                            # Fetch remote updates
git pull --ff-only origin main              # Update main safely
git merge feature/name                      # Merge into current branch
git push -u origin feature/name             # Push new branch
git branch -d feature/name                  # Delete merged local branch
git tag -a v1.0.0 -m "Release v1.0.0"      # Create annotated release tag
git push origin v1.0.0                      # Publish release tag
git revert <commit>                         # Safely undo shared commit
```

---

**Learning order:** `status` → `add` → `commit` → `log` → `switch` → `branch` → `fetch`/`pull`/`push` → `merge` → `tag` → `revert`.
