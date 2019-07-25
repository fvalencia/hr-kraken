module.exports = {
  steps: ({ id }, args, context) => {
    return context.prisma.templateStep({ id }).steps();
  }
};
