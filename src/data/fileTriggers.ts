import FileTrigger from "../types/FileTrigger";
import Signal from "../types/Signal";

export default [
  new FileTrigger("file with 'reducer' keyword", "reducer", [
    new Signal(
      "Native state management for simple apps",
      "Many of the front end frameworks come with their own support when it comes to application level state management solutions. It is preferable to use these native solutions instead of using third party libraries.",
      "https://docs.google.com/presentation/d/15Bw1qwvfuJ3bswOUS0HvNJbR2EVmHLtPk_cWNWuLVf0/edit#slide=id.g1c303425273_0_56"
    ),
  ]),
];
