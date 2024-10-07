/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'farmersangadi.s3.us-east-1.amazonaws.com', // Your S3 bucket hostname
              port: '', // Leave blank for default (HTTPS, port 443)
              pathname: '/**', // Allow all paths from this hostname
            },
          ],      },
}

module.exports = nextConfig
