export default () => ({
  auth: {
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY || 'STATICSECRETKEY',
  }
});
