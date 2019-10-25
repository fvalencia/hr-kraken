module.exports = {
  applicationsConnection: (parent, args, context) => {
    return {
      pageInfo: context.prisma.applicationsConnection(args).pageInfo(),
      edges: context.prisma.applicationsConnection(args).edges(),
      // should we use args on aggregate? I think we need all the count
      aggregate: context.prisma.applicationsConnection().aggregate()
    };
  },
  applications: (parent, args, context) => {
    return context.prisma.applications(args);
  },
  application: (parent, { where }, context) => {
    return context.prisma.application(where);
  },
  candidatesConnection: (parent, args, context) => {
    return {
      pageInfo: context.prisma.candidatesConnection(args).pageInfo(),
      edges: context.prisma.candidatesConnection(args).edges(),
      // should we use args on aggregate? I think we need all the count
      aggregate: context.prisma.candidatesConnection().aggregate()
    };
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
  templateStepsConnection: (parent, args, context) => {
    return {
      pageInfo: context.prisma.templateStepsConnection(args).pageInfo(),
      edges: context.prisma.templateStepsConnection(args).edges(),
      // should we use args on aggregate? I think we need all the count
      aggregate: context.prisma.templateStepsConnection().aggregate()
    };
  },
  templateSteps: (parent, args, context) => {
    return context.prisma.templateSteps(args);
  },
  templateStep: (parent, { where }, context) => {
    return context.prisma.templateStep(where);
  }
};
