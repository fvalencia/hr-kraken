module.exports = {
  applications: ({ id }, args, context) => {
    return context.prisma.candidate({ id }).applications();
  }
};
