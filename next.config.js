// next.config.js
const withPWA = require("next-pwa");

const makeArrayFromCommaSeparatedString = (commaSeparatedString) => {
    const localeString = commaSeparatedString || '';

    let localesArray = localeString.split(',')

    localesArray = localesArray.map((untrimmedString) => {
        return untrimmedString.trim()
    })

    return localesArray;
}

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",//disable PWA in development
  },
  webpack: (config) => {//Need this one to be able to compile ts files from sdk
    config.module.rules.push({
      test: /\.(ts)$/,
      use: [
        {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
            onlyCompileBundledFiles: true,
          },
        },
      ],
    });
  
    return config;
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: makeArrayFromCommaSeparatedString(process.env.NEXT_PUBLIC_LOCALES),
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: process.env.DEFAULT_LOCALE || 'en-US',
  },
  images: {
    domains: makeArrayFromCommaSeparatedString(process.env.IMAGES_DOMAINS),
    deviceSizes: [425, 640, 768, 1024, 1200, 1920, 2048, 3840],
  },
});