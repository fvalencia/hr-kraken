module.exports = {
  applications: ({ id }, args, context) => {
    return context.prisma.opening({ id }).applications(args);
  },
  steps: ({ id }, args, context) => {
    return context.prisma.opening({ id }).steps(args);
  }
};
