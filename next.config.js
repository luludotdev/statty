const modules = [
  'read-pkg-up',
  'read-pkg',
]

const withTM = require('next-transpile-modules')(modules)
module.exports = withTM({
  future: {
    webpack5: true,
  },
})
