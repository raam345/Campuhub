# Vercel Deployment Guide for Campus Wellness Hub

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Repository**: Push your code to GitHub (Vercel works best with GitHub)
3. **Google API Key**: Already configured in your .env file

## Deployment Steps

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Link to Vercel**
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add environment variable:
     - Name: `GOOGLE_API_KEY`
     - Value: `AIzaSyBbXnCSvqosBFJuRabjuVNFVXjv4XGm29g`
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 2-3 minutes)
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select "Y" to link to existing project or create new one
   - When asked for environment variables, enter your Google API Key

4. **Set Production Environment Variables**
   ```bash
   vercel env add GOOGLE_API_KEY
   # Paste your API key when prompted
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables Configuration

The following environment variable is required:

| Variable | Value |
|----------|-------|
| `GOOGLE_API_KEY` | AIzaSyBbXnCSvqosBFJuRabjuVNFVXjv4XGm29g |

Add these in Vercel Dashboard → Settings → Environment Variables

## Files Changed for Vercel

1. ✅ `vercel.json` - Vercel configuration
2. ✅ `.vercelignore` - Files to ignore during deployment
3. ✅ `.env` - Environment variables with VITE_ prefix
4. ✅ `api/gemini.js` - Serverless function for Gemini API
5. ✅ `src/services/gemini.js` - Updated to call `/api/gemini`

## Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite (React)

## Testing Deployment

After deployment:

1. Visit your Vercel URL
2. Test the following features:
   - Health Chatbot (Mental Health tab)
   - Academic Chatbot (Academics tab)
   - Meal Plan Generator (Fitness tab)
   - All other features should work as before

## Troubleshooting

### Build fails with "VITE_GOOGLE_API_KEY not found"
- Check that environment variable is set in Vercel dashboard
- Ensure variable name starts with `VITE_`

### API calls return 500 error
- Verify `GOOGLE_API_KEY` is set in environment variables
- Check Vercel function logs in dashboard

### Static files not loading
- Ensure `public/` folder contents are correctly deployed
- Check that build output is in `dist/` directory

## Redeploy After Changes

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```

2. Vercel will automatically deploy (if auto-deploy is enabled)
3. Monitor deployment in Vercel dashboard

## Support

- Vercel Docs: https://vercel.com/docs
- React/Vite Docs: https://vitejs.dev/
- Google Generative AI: https://ai.google.dev/

---

**Deployment Status**: Ready for Vercel ✅
