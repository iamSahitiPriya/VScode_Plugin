class Trigger {
  name: String;
  regex: RegExp;
  relatedDocuments: String[];
  constructor(name: String, regex: RegExp, relatedDocs: String[]) {
    this.name = name;
    this.regex = regex;
    this.relatedDocuments = relatedDocs;
  }
}

export default [
  new Trigger("React Testing Library Trigger", /@testing-library\/react/g, [
    "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c385a94172_0_0",
  ]),
  new Trigger("Enzyme Trigger", /\benzyme\b/gi, [
    "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c385a94172_0_0",
  ]),
];
