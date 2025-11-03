module.exports = {
  plugins: ["prettier-plugin-go-template"],
  overrides: [
    {
      files: "deploy/helm/**/*.yaml",
      options: {
        parser: "go-template",
      },
    },
  ],
};
