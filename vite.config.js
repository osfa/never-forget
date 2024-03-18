const { createVuePlugin } = require("vite-plugin-vue2");

//typewriter-vue
module.exports = {
  plugins: [createVuePlugin()],
  optimizeDeps: {
    exclude: ["ollama"],
  },
  // server: {
  //   cors: false,
  // },
};
