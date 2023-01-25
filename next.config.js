/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Minifying breaks `@web3-onboard`
  // @see https://github.com/blocknative/web3-onboard/issues/1352#issuecomment-1351890360
  swcMinify: false,
  // `Image` not supported in static export
  images: {
    unoptimized: true,
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material/?(((\\w*)?/?)*)': {
      transform: '@mui/icons-material/{{ matches.[1] }}/{{member}}',
    },
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
  },
  // Safe cannot access manifest.json otherwise
  headers: async () => {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: false,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: { removeViewBox: false },
                  },
                },
              ],
            },
            titleProp: true,
          },
        },
      ],
    })

    return config
  },
}

module.exports = nextConfig
