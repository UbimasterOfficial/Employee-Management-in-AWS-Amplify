Employee Management — Frontend (Amplify) + Backend (EC2)

Local development
-----------------
FrontEnd start -> npm run dev          (in Frontend/)
Backend start  -> npm run dev          (in Backend/, default port 5001)

Backend endpoints
-----------------
    POST   -> /api/users
    GET    -> /api/users
    GET    -> /api/users/:id
    PUT    -> /api/users/:id
    DELETE -> /api/users/:id

Production backend (EC2 + Elastic IP)
-------------------------------------
    http://100.29.211.141:5001/api/users

Frontend API configuration
----------------------------
The React app reads VITE_API_URL (must include /api/users).

    - Frontend/.env.development     -> localhost:5001 for local dev
    - Frontend/.env.production      -> EC2 URL for npm run build / Amplify
    - Amplify Console env var       -> optional override: VITE_API_URL

AWS Amplify deployment
----------------------
1. Connect this repo in Amplify Hosting.
2. Set "Monorepo" app root to: Frontend
   (amplify.yml is already under Frontend/ with appRoot: Frontend)
3. Build uses amplify.yml; default API URL is the EC2 Elastic IP above.
4. Backend CORS (Backend/server.js) allows:
       https://frontend-dev.d173bi0k0a6t1i.amplifyapp.com
   and any https://*.amplifyapp.com URL. On EC2 you can also set:
       AMPLIFY_FRONTEND_URL=https://frontend-dev.d173bi0k0a6t1i.amplifyapp.com
   Redeploy/restart the backend after pulling these changes.

EC2 / security checklist
------------------------
- Security group: allow inbound TCP 5001 (and 22 for SSH) from needed sources.
- Backend .env on EC2: MONGODB_URI (or MONGO_URI), PORT=5001

HTTPS / mixed content (important)
---------------------------------
Amplify serves the site over HTTPS. Browsers block HTTPS pages from calling
HTTP APIs (mixed content). If the app loads but API calls fail in the browser:

  - Put HTTPS in front of the EC2 API (e.g. Nginx + Let's Encrypt on port 443),
    then set VITE_API_URL=https://your-api-domain/api/users in Amplify, or
  - Test the Amplify URL and check the browser DevTools → Network/Console.

Docker Compose (optional local stack)
-------------------------------------
Uses backend port 5000. For the frontend container, set:
    VITE_API_URL=http://localhost:5000/api/users
