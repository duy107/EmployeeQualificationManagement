import type { NextConfig } from "next";
import { JSONValue } from "next/dist/server/config-shared";
import type { Configuration as WebpackConfig } from 'webpack';

const svgoConfig: Record<string, unknown> = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    {
      name: 'convertColors',
      params: {
        currentColor: true,
      },
    },
    'prefixIds',
  ],
};

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**"
      },
      {
        protocol: 'https',
        hostname: 'another-site.com',
        pathname: '/images/**', // thêm domain khác
      },
      {
        hostname: "th.bing.com",
        pathname: "**"
      }
    ]
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [{ loader: '@svgr/webpack', options: { svgoConfig: svgoConfig as JSONValue } }],
        as: '*.js',
      },
    },
  },
  webpack(config: WebpackConfig) {
    config.module!.rules!.push({
      test: /\.svg$/i,
      use: { loader: '@svgr/webpack', options: { svgoConfig: svgoConfig as unknown } },
    });

    // https://github.com/vercel/next.js/issues/43567
    config.externals = [...(config.externals as string[]), 'canvas'];

    return config;
  },
};

export default nextConfig;