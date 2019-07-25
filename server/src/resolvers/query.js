module.exports = {
  applications: (parent, args, context) => {
    return context.prisma.applications(args);
  },
  application: (parent, { where }, context) => {
    return context.prisma.application(where);
  },
  candidates: (parent, args, context) => {
    return context.prisma.candidates(args);
  },
  candidate: (parent, { where }, context) => {
    return context.prisma.candidate(where);
  },
  openings: (parent, args, context) => {
    return context.prisma.openings(args);
  },
  opening: (parent, { where }, context) => {
    return context.prisma.opening(where);
  },
  applicationSteps: (parent, args, context) => {
    return context.prisma.applicationSteps(args);
  },
  applicationStep: (parent, { where }, context) => {
    return context.prisma.applicationStep(where);
  },
  steps: (parent, args, context) => {
    return context.prisma.steps(args);
  },
  step: (parent, { where }, context) => {
    return context.prisma.step(where);
  },
  templateSteps: (parent, args, context) => {
    return context.prisma.templateSteps(args);
  },
  templateStep: (parent, { where }, context) => {
    return context.prisma.templateStep(where);
  }
};
