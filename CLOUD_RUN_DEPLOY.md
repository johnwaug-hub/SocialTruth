# Google Cloud Run Deployment Guide

This guide will help you deploy SocialTruth DAO to Google Cloud Run.

## Prerequisites

1. Google Cloud account
2. gcloud CLI installed ([Install Guide](https://cloud.google.com/sdk/docs/install))
3. Docker installed (optional, Cloud Build can handle it)
4. Firebase project set up

## Quick Deploy

### Step 1: Set Up Google Cloud

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project social-truth-31e90

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 2: Update Firebase Configuration

Before deploying, update `js/firebase-config.js` with your Firebase credentials.

### Step 3: Deploy to Cloud Run

```bash
# Navigate to project directory
cd SocialTruthV2

# Deploy using Cloud Build (recommended - no local Docker needed)
gcloud run deploy socialtruth \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --timeout 60

# Or build and deploy separately
gcloud builds submit --tag gcr.io/social-truth-31e90/socialtruth
gcloud run deploy socialtruth \
  --image gcr.io/social-truth-31e90/socialtruth \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

### Step 4: Access Your App

After deployment completes, you'll get a URL like:
```
https://socialtruth-xxxxx-uc.a.run.app
```

## Alternative: Deploy with Docker

If you prefer to build locally:

```bash
# Build the Docker image
docker build -t socialtruth .

# Test locally
docker run -p 8080:8080 socialtruth
# Visit http://localhost:8080

# Tag for Google Container Registry
docker tag socialtruth gcr.io/social-truth-31e90/socialtruth

# Push to GCR
docker push gcr.io/social-truth-31e90/socialtruth

# Deploy to Cloud Run
gcloud run deploy socialtruth \
  --image gcr.io/social-truth-31e90/socialtruth \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Troubleshooting

### Error: Container failed to start

**Cause**: Container not listening on PORT environment variable

**Solution**: The Dockerfile now uses nginx configured to listen on port 8080 (Cloud Run default)

### Error: Permission denied

**Cause**: Not authenticated or insufficient permissions

**Solution**:
```bash
gcloud auth login
gcloud auth configure-docker
```

### Error: Service not found

**Cause**: Wrong project or region

**Solution**:
```bash
gcloud config set project social-truth-31e90
gcloud config set run/region us-central1
```

### Health Check Failing

The nginx configuration includes a `/health` endpoint. Test it:
```bash
curl https://your-service-url/health
# Should return: healthy
```

## Configuration Options

### Environment Variables

Set environment variables in Cloud Run:

```bash
gcloud run deploy socialtruth \
  --set-env-vars "FIREBASE_PROJECT_ID=social-truth-31e90"
```

### Custom Domain

Map a custom domain:

```bash
gcloud run domain-mappings create \
  --service socialtruth \
  --domain yourdomain.com \
  --region us-central1
```

### Increase Resources

For higher traffic:

```bash
gcloud run deploy socialtruth \
  --memory 1Gi \
  --cpu 2 \
  --max-instances 10 \
  --concurrency 80
```

### Enable HTTPS Only

Cloud Run automatically provides HTTPS, but you can enforce it:

```bash
gcloud run services update socialtruth \
  --platform managed \
  --region us-central1 \
  --ingress all
```

## Cloud Run Pricing

Cloud Run is billed based on:
- CPU usage (vCPU-seconds)
- Memory usage (GB-seconds)
- Requests

Free tier includes:
- 2 million requests/month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - uses: google-github-actions/setup-gcloud@v0
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: social-truth-31e90
      
      - name: Deploy
        run: |
          gcloud run deploy socialtruth \
            --source . \
            --region us-central1 \
            --allow-unauthenticated
```

## Monitoring

View logs:
```bash
gcloud run services logs read socialtruth \
  --region us-central1 \
  --limit 50
```

View metrics in Cloud Console:
https://console.cloud.google.com/run/detail/us-central1/socialtruth/metrics

## Update Deployment

To update your app:

```bash
# Make changes to your code
# Then redeploy
gcloud run deploy socialtruth --source .
```

## Rollback

If something goes wrong:

```bash
# List revisions
gcloud run revisions list --service socialtruth

# Rollback to previous revision
gcloud run services update-traffic socialtruth \
  --to-revisions REVISION_NAME=100
```

## Delete Service

To remove the deployment:

```bash
gcloud run services delete socialtruth \
  --region us-central1
```

## Best Practices

1. **Use Cloud Build** - Let Google handle the Docker build
2. **Set memory limits** - 512Mi is usually sufficient for static sites
3. **Enable CDN** - Use Cloud CDN for better performance
4. **Monitor costs** - Check billing dashboard regularly
5. **Use tags** - Tag images for version control
6. **Implement health checks** - Already included in nginx.conf
7. **Set up alerts** - Configure Cloud Monitoring alerts

## Next Steps

- Set up Cloud CDN for global distribution
- Configure Cloud Armor for DDoS protection
- Set up Cloud Monitoring alerts
- Implement Cloud Logging for analytics
- Use Cloud Scheduler for maintenance tasks

## Support

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Cloud Run Quotas](https://cloud.google.com/run/quotas)

---

Your app should now be live on Cloud Run! 🚀
