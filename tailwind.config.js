const viewports = require('./config/viewports.json');
const colors = require('./config/colors.json')

/**
 * returns { 't-primary': 'var(--t-primary)'} from {"--t-primary": "#27272F"}
 * @param {*} cssVarsObj
 */
function transformCssVarsIntoTailwindVarsObject(cssVarsObj) {
  const cssVarsKeys = Object.keys(cssVarsObj);

  const TailwindVarsObj = {};

  cssVarsKeys.forEach((cssVarsKey) => {
    TailwindVarsObj[cssVarsKey.split('--')[1]] = `var(${cssVarsKey})`
  })

  return TailwindVarsObj;
}


module.exports = {
  content: ['./pages/*.tsx', './pages/**/*.tsx', './pages/**/**/*.tsx', './components/*.tsx', './components/**/*.tsx', './components/**/**/*.tsx'],
  theme: {
    screens: {
      'sm': viewports.small + "px",
      "md": viewports.medium + "px",
      "lg": viewports.large + "px",
      "xl": viewports.xlarge + "px",
      "xxl": viewports.xxlarge + "px"
    },
    colors: transformCssVarsIntoTailwindVarsObject(colors),
    fontFamily: {
      primary: 'var(--font-family-primary)',
    },
    rotate: {
      '-180': '-180deg',
      '-90': '-90deg',
      '-45': '-45deg',
       '0': '0',
       '45': '45deg',
       '90': '90deg',
      '180': '180deg',
    },
    fontSize: {
      "xs": ['13px', '16px'],
      "sm": ['16px', '24px'],
      'lg': ['19px', '24px'],
      "xl": ['23px', '32px'],
      "xxl": ['32px', '46px'],
      '2lg': ['36px', '1'],
      '2xl': ['33px', '48px'],
      '3xl': ['40px', '56px'],
      '4xl': ['60px', '1'],
    },
    extend: {
      lineHeight: {
        'normal': 'normal',
       },
    },
  },
  plugins: [],
}
