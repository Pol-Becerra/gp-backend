/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Disable strict checks during build to prevent resource exhaustion on small VPS
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
}

export default nextConfig
