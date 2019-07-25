"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Candidate",
    embedded: false
  },
  {
    name: "Seniority",
    embedded: false
  },
  {
    name: "Application",
    embedded: false
  },
  {
    name: "Result",
    embedded: false
  },
  {
    name: "Status",
    embedded: false
  },
  {
    name: "Opening",
    embedded: false
  },
  {
    name: "OpeningStatus",
    embedded: false
  },
  {
    name: "ApplicationStep",
    embedded: false
  },
  {
    name: "Step",
    embedded: false
  },
  {
    name: "TemplateStep",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://us1.prisma.sh/felipe-valencia/hr-kraken/dev`
});
exports.prisma = new exports.Prisma();
