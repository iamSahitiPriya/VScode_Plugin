import Signal from "../models/Signal";

export default [
  //signal1
  new Signal(
    "User-centric testing of UI components",
    "Prefer testing user behaviour on UI components rather than testing implementation details, such as the presence of elements in the UI at a certain moment in time.",
    "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c385a94172_0_0",
    [],
    [/@testing-library\/(\w+(-\w+)?)/g, /\benzyme\b/g]
  ),
  //signal2
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
  //signal3
  new Signal(
    "Design Systems for standardization",
    "Design systems define a collection of design patterns, component libraries and good design and engineering practices that ensure consistent digital products. Guidance is generally written as code instead of documentation that is sometimes ambiguous and hard-to-maintain. Even for smaller projects or libraries there are evolving ideas of Style Tokens and Atomic Designs e.g OpenProps which helps to standardize the design on a much atomic level.",
    "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c303425273_0_28",
    [],
    [
      /import\s+\{(?=.*(?:Button|Modal|Header|Input|Checkbox|RadioButton|Dropdown|Textarea|Box|Tooltip|Accordion|ProgressBar|Slider|Table|Pagination|Alert|Badge)).*\}\s+from\s+['"]((?!@chakra-ui\/\w+|@fluentui\/\w+|@fluentui\/react\/\w+\/\w+|@mui\/material)[^"']+)['"]/gi,
    ]
  ),
  //signal4
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
  //signal5
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
      /\btailwindcss\b/g,
      /\bemotion\b/g,
      /\bwindicss\b/g,
      /\bstyled\(['"](\w+)['"]\)/g,
      /\bstyled\.\w+/g,
      /\bstyle=\{\{(?:(?:(?!\}\}).)*:)+(?:(?!\}\}).)*\}\}/g,
    ]
  ),
];
