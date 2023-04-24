import Signal from "../models/Signal";

export default [
  new Signal(
    "User-centric testing of UI components",
    "Prefer testing user behaviour on UI components rather than testing implementation details, such as the presence of elements in the UI at a certain moment in time.",
    "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c385a94172_0_0",
    [],
    [/@testing-library\/(\w+(-\w+)?)/g, /\benzyme\b/g]
  ),
  new Signal(
    "Native state management for simple apps",
    "Many of the front end frameworks come with their own support when it comes to application level state management solutions. It is preferable to use these native solutions instead of using third party libraries.",
    "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c303425273_0_56",
    ["reducer"],
    [
      /\buseContext\b/g,
      /\bcreateStore\b/g,
      /\breact-redux\b/g,
      /\bdispatch\b/g,
      /\bconnect\b/g,
      /\bProvider\b/g,
      /\bcreateReducer\b/g,
      /\bcreateAction\b/g,
      /\bcreateContext\b/g,
      /\bconfigureStore\b/g,
      /@reduxjs\/toolkit/g,
    ]
  ),
  new Signal(
    "Component Libraries for consistency and faster development",
    "A component library is a collection of pre-built reusable UI elements (such as buttons, forms, and layout elements) that can be used to build user interfaces. These libraries can be easily incorporated into applications, saving developers time and ensuring consistency in design and functionality. You can either adopt the component library as is or adapt the component libraries to adhere to your design language. Some popular UI component libraries include Bootstrap, Material UI, Ant Design and Chakra UI",
    "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c303425273_0_42",
    [],
    [
      /@emotion\/\w+/g,
      /@chakra-ui\/\w+/g,
      /@fluentui\/\w+/g,
      /@fluentui\/react\/\w+\/\w+/g,
      /@mui\/material/g,
    ]
  ),
  new Signal(
    "CSS in JS to manage CSS at scale",
    "Scope CSS to your UI components to scale CSS in large code-bases and avoid naming collisions.",
    "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c303425273_0_14",
    ["module.css", ".scss"],
    [
      /\bstyled-components\b/g,
      /@emotion\/\w+/g,
      /\breact-jss\b/g,
      /\bstyled-system\b/g,
      /\bstitches\b/g,
      /\buseTheme\b/g,
      /\bemotion\b/g,
      /\bstyled\.\w+/g,
    ]
  ),
];
