module.exports = {
  createApplication(parent, { data }, context) {
    console.log('Got here ---->', data);
    const { candidate, opening, startDate, responsable } = data;
    return context.prisma.createApplication({
      candidate,
      opening,
      startDate,
      responsable,
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
  }
  // deletePost(parent, { id }, context) {
  //   return context.prisma.deletePost({ id })
  // },
  // publish(parent, { id }, context) {
  //   return context.prisma.updatePost({
  //     where: { id },
  //     data: { published: true },
  //   })
  // },
};
