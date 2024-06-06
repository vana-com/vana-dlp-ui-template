module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/claim",
        permanent: true,
      },
    ];
  },
};
