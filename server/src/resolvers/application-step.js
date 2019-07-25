module.exports = {
  step: ({ id }, args, context) => {
    return context.prisma.applicationStep({ id }).step();
  }
};
