module.exports = {
  applications: ({ id }, args, context) => {
    return context.prisma.opening({ id }).applications();
  },
  steps: ({ id }, args, context) => {
    return context.prisma.opening({ id }).steps();
  }
};
