# Doppler Setup Guide

## Prerequisites

- Install Doppler CLI
- Create Doppler Account
- Create Project
- Create `dev` Config

---

## Install Doppler

```bash
winget install Doppler.Doppler
```

Verify:

```bash
doppler --version
```

---

## Login

```bash
doppler login
```

---

## Connect Project

```bash
cd my-backend
doppler setup
```

Select:

```txt
Project: error-monitoring
Config: dev
```

---

## Download Secrets to .env

```bash
doppler secrets download --format env --no-file > .env
```

---

## Run Application

```bash
doppler run -- npm run dev
```

---

## Upload Local .env to Doppler

```bash
doppler secrets upload .env
```

---

## Useful Commands

| Action        | Command                                                  |
| ------------- | -------------------------------------------------------- |
| List Secrets  | `doppler secrets`                                        |
| Get Secret    | `doppler secrets get MONGO_URI`                          |
| Download .env | `doppler secrets download --format env --no-file > .env` |
| Upload .env   | `doppler secrets upload .env`                            |
| Run App       | `doppler run -- npm run dev`                             |

---

## Production

### Development

```txt
Doppler
  ↓
doppler run -- npm run dev
  ↓
process.env
```

### Production

```txt
Render Environment Variables
  ↓
process.env
```
