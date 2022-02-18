module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '7abfe18208a8af6aa5ce3d876f1d4116'),
  },
});
