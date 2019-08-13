module.exports = {
  candidate: ({ id }, args, context) => {
    return context.prisma.application({ id }).candidate();
  },
  opening: ({ id }, args, context) => {
    return context.prisma.application({ id }).opening();
  },
  steps: ({ id }, args, context) => {
    return context.prisma.application({ id }).steps(args);
  }
};
