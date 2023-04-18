import Signal from "../models/Signal";

export default [
  new Signal(
    "User-centric testing of UI components",
    "Prefer testing user behaviour on UI components rather than testing implementation details, such as the presence of elements in the UI at a certain moment in time.",
    "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c385a94172_0_0",
    [],
    [/@testing-library\/react/g, /\benzyme\b/gi]
  ),
  new Signal(
    "Native state management for simple apps",
    "Many of the front end frameworks come with their own support when it comes to application level state management solutions. It is preferable to use these native solutions instead of using third party libraries.",
    "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c303425273_0_56",
    ["reducer"],
    []
  ),
];
