import Signal from "../types/Signal";
import Trigger from "../types/Trigger";

export default [
  new Trigger("React Testing Library Trigger", /@testing-library\/react/g, [
    new Signal(
      "User-centric testing of UI components",
      "Prefer testing user behaviour on UI components rather than testing implementation details, such as the presence of elements in the UI at a certain moment in time.",
      "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c385a94172_0_0"
    ),
  ]),
  new Trigger("Enzyme Trigger", /\benzyme\b/gi, [
    new Signal(
      "User-centric testing of UI components",
      "Prefer testing user behaviour on UI components rather than testing implementation details, such as the presence of elements in the UI at a certain moment in time.",
      "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c385a94172_0_0"
    ),
  ]),
];
