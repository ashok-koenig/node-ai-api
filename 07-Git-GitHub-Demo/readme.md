# Working with GIT

## Basic GIT Commands

### Intialize git to your project
- Run the follwing command in your project root directory

```
git init
```

### Stage the files into git
- Add a specific file into git
```
git add <file-name>
```
- Add all files into git
```
git add .
```

### Show the git status
```
git status
```

### Commit the file changes in git
```
git commit -m "commit message"
```
### Command to view the git logs
- view all git logs
```
git log
```
- view last n git logs
```
git log -n
```
## Integrate with GitHub
### Create a GitHub repository
- Goto https://github.com
- Click "New Repository"
- Give a name to repository
- Select repository visibility (public / private)
- Click "Create" repository

### Pushing Project code to GitHub
- Connect to GitHuB
```
git remote add origin https://github.com/your-username/your-repo-name.git
```
- Use master as the default branch 
```
git branch -M master
```
- Push local code to GitHub
```
git push -u origin master
```
### Clone remote repository
```
git clone https://github.com/your-username/your-repo-name.git
```
### Pull the remote repository changes into local repository
```
git pull
```