module.exports = {
  createApplication(parent, { data }, context) {
    return context.prisma.createApplication({
      ...data,
      steps: {
        create: [
          { step: { connect: { id: 1 } } },
          { step: { connect: { id: 2 } } },
          { step: { connect: { id: 3 } } },
          { step: { connect: { id: 4 } } },
          { step: { connect: { id: 5 } } }
        ]
      }
    });
  },
  deleteApplication(parent, { where }, context) {
    return context.prisma.deleteApplication(where);
  },
  updateApplication(parent, args, context) {
    return context.prisma.updateApplication(args);
  },
  createStep(parent, { data }, context) {
    return context.prisma.createStep(data);
  },
  upsertCandidate(_, { where, create, update }, context) {
    return context.prisma.upsertCandidate({ where, create, update });
  },
  createCandidate(_, { data }, context) {
    return context.prisma.createCandidate(data);
  },
  deleteCandidate(_, { where }, context) {
    return context.prisma.deleteCandidate(where);
  },
  upsertOpening(_, { where, create, update }, context) {
    return context.prisma.upsertOpening({ where, create, update });
  },
  deleteOpening(_, { where }, context) {
    return context.prisma.deleteOpening(where);
  }
};
