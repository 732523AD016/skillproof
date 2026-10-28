# SkillProof — Evidence-Based Developer Skill Assessment

## 📌 Overview

**SkillProof** is a developer portfolio and skill-assessment platform designed to help students, freshers, and recruiters understand technical skills through verifiable development activity.

Instead of relying only on self-reported skills on a resume, SkillProof aims to connect GitHub profiles with repository activity and present relevant technical evidence in an easy-to-understand format.

The project is being developed with a React frontend, a Node.js and Express backend, MongoDB, and GitHub OAuth integration.

## 🎯 Problem Statement

Traditional resumes often list technical skills without showing enough evidence of how those skills were used in real projects.

This can make it difficult for recruiters to evaluate a fresher's practical experience.

SkillProof aims to address this challenge by creating a platform where developer profiles can be connected to coding activity and presented as structured skill evidence.

## 💡 Proposed Solution

SkillProof is designed around four key ideas:

- **GitHub Integration:** Allow users to connect their GitHub accounts.
- **Development Evidence:** Use repository and commit activity as potential evidence of practical experience.
- **Skill Insights:** Organize technical evidence into understandable skill categories.
- **Recruiter-Friendly Profiles:** Make it easier to review a candidate's projects and development activity.

*Repository analysis, automated skill scoring, and recruiter reports are planned enhancements unless explicitly implemented and tested.*

## ✨ Key Features

### Current Project Components

- Responsive React-based user interface.
- Landing page introducing the SkillProof concept.
- Dedicated sections explaining the workflow and benefits.
- Express backend with API endpoints.
- MongoDB database connectivity using Mongoose.
- GitHub OAuth authorization and callback routes.
- Environment-based configuration for credentials and application URLs.
- CORS configuration for local frontend-backend communication.

### Planned Features

- Fetch public GitHub repositories and commit activity.
- Analyze programming languages and repository metadata.
- Generate evidence-based skill summaries.
- Build personalized developer skill reports.
- Provide recruiter-friendly candidate views.
- Add secure user authentication and persistent profiles.
- Display project activity and skill insights through visual dashboards.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development server and build tooling |
| JavaScript | Application logic |
| CSS | Styling and responsive layouts |
| Node.js | Backend JavaScript runtime |
| Express.js | REST API and OAuth routes |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| Axios | HTTP requests to GitHub APIs |
| dotenv | Environment variable configuration |
| CORS | Cross-origin communication |
| GitHub OAuth | GitHub account authorization |
| Git & GitHub | Version control and source-code hosting |

## 🏗️ System Architecture

```text
                 USER
                   |
                   v
          React + Vite Frontend
             localhost:5173
                   |
                   v
          Express REST Backend
             localhost:5000
                   |
          +--------+---------+
          |                  |
          v                  v
    GitHub OAuth          MongoDB
    GitHub API             Database
```

The frontend handles user interaction. The backend manages API requests and the GitHub authorization flow. MongoDB provides database connectivity for future persistent application data.

## 🔄 Application Workflow

1. The user opens the SkillProof web application.
2. The user selects **Connect GitHub**.
3. The backend redirects the user to GitHub's OAuth authorization page.
4. GitHub redirects the user to the configured backend callback URL after authorization.
5. The backend exchanges the authorization code for an access token and retrieves basic GitHub profile information.
6. Repository analysis and skill-report generation can be added to the authenticated workflow.

**Note:** The complete workflow must be tested in the running application. Successful OAuth authorization alone does not mean repository analysis or skill scoring is complete.

## 📂 Project Structure

```text
SkillProof/
├── backend/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── server.backup.js
│   └── server.oauth-backup.js
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

The `frontend/` and `server/` directories also exist in the current local workspace. The primary setup described here uses `client/` and `backend/`.

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB connection URI
- GitHub account
- GitHub OAuth App credentials

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd SkillProof
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the actual repository URL.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Required packages include Express, Mongoose, CORS, Axios, and dotenv. Add other packages if your current backend code requires them.

### 3. Configure Environment Variables

Create or update `backend/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/skillproof
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
```

Replace the GitHub credential placeholders with your own values. Use the MongoDB URI appropriate for your environment.

**Security:** Never commit `.env`, OAuth client secrets, access tokens, or other credentials to GitHub.

### 4. Configure GitHub OAuth

In your GitHub OAuth App settings, configure the authorization callback URL as:

```text
http://localhost:5000/api/auth/github/callback
```

The callback URL configured in GitHub must match the backend environment variable exactly.

### 5. Start the Backend

Open a terminal:

```bash
cd backend
node server.js
```

The backend should connect to MongoDB and listen on port `5000`.

Test the health endpoint:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "OK"
}
```

### 6. Start the Frontend

Open a second terminal from the project root:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, normally:

```text
http://localhost:5173
```

Keep both frontend and backend terminals running while testing the application.

## 🔐 Security Considerations

- Keep OAuth client secrets in environment variables.
- Do not expose access tokens or client secrets in frontend code or URL query parameters.
- Request only the GitHub permissions required for the application's features.
- Validate OAuth callback responses and handle authorization failures.
- Use secure session or token-handling practices before deploying to production.
- Protect user data and validate API requests.
- Use HTTPS and production environment variables when deploying.

## 🧪 Testing Checklist

- [ ] Frontend loads without errors.
- [ ] Backend health endpoint returns a successful response.
- [ ] MongoDB connects successfully.
- [ ] Connect GitHub redirects to GitHub authorization.
- [ ] GitHub redirects to the configured callback.
- [ ] OAuth failures display an appropriate message.
- [ ] Repository and commit data are fetched correctly after implementing those features.
- [ ] Skill reports are validated against actual development evidence.

## 🚀 Future Enhancements

- Automated programming-language and repository analysis.
- Evidence-backed skill scoring.
- Interactive skill dashboards and activity charts.
- Project quality indicators and contribution summaries.
- Recruiter dashboard with candidate comparison.
- Exportable developer reports.
- Deployment with secure authentication and persistent storage.

## 🎓 Learning Outcomes

This project provides practical experience with:

- Full-stack web application development.
- React frontend development.
- REST API development using Express.
- GitHub OAuth authorization.
- MongoDB connectivity and Mongoose.
- API integration and error handling.
- Environment configuration and application security.
- Version control and project documentation.

## 👩‍💻 Project Information

**Project:** SkillProof  
**Category:** Full-Stack Web Development  
**Primary Use Case:** Developer skill evidence and portfolio assessment  
**Development Status:** In progress

## 📄 License

Choose and add a suitable open-source license before distributing the project publicly.

---

<p align="center">
  <strong>SkillProof — Skills are stronger when backed by evidence.</strong>
</p>
