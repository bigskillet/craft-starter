module.exports = {
  mode: 'jit',
  purge: ['./templates/**/*.twig'],
  theme: {
    fontFamily: {
      body: ['sans-serif'],
      display: []
    },
    colors: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
}
