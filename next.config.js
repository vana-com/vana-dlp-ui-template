module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/claim/upload",
        permanent: true,
      },
    ];
  },
};
