# Use official nginx image for serving static files
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy application files
COPY index.html /usr/share/nginx/html/
COPY styles /usr/share/nginx/html/styles
COPY js /usr/share/nginx/html/js

# Copy Firebase configuration files (optional, for reference)
COPY firebase.json /usr/share/nginx/html/
COPY firestore.rules /usr/share/nginx/html/
COPY firestore.indexes.json /usr/share/nginx/html/
COPY README.md /usr/share/nginx/html/

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
