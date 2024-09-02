const lightTheme = {
  label: "Light",
  background: "#F5F5F5",
  text: "#000000",
  gradient: "linear-gradient(315deg, #74ebd5 0%, #ACB6E5 94%)",
  title: "#2979ff",
  textTypeBox: "#9E9E9E",
  stats: "#3D5AFE",
  fontFamily: "Roboto Mono",
};

const darkTheme = {
  label: "Dark",
  background: "#121212",
  text: "#FAFAFA",
  gradient: "linear-gradient(315deg, #F7971E 0%, #FFD200 94%)",
  title: "#ffc107",
  textTypeBox: "#706d6d",
  stats: "#BB86FC",
  fontFamily: "Roboto Mono",
};

const cyberTheme = {
  label: "Cyber",
  background: "#272932",
  text: "#CB1DCD",
  gradient: "linear-gradient(315deg, #FDF500 0%, #CB1DCD 94%)",
  title: "#FDF500",
  textTypeBox: "#D1C5C0",
  stats: "#00ff9f",
  fontFamily: "Tomorrow",
};

const terminalTheme = {
  label: "Terminal",
  background: "#0D0208",
  text: "#39ff14",
  gradient: "linear-gradient(315deg, #39ff14 0%, #008F11 94%)",
  title: "#008F11",
  textTypeBox: "#706d6d",
  stats: "#39ff14",
  fontFamily: "Tomorrow",
};

const defaultTheme = darkTheme;

const themesOptions = [
  { value: darkTheme, label: "Dark" },
  { value: lightTheme, label: "Light" },
  { value: terminalTheme, label: "Terminal" },
  { value: cyberTheme, label: "Cyber" }
];

export {
  lightTheme,
  darkTheme,
  cyberTheme,
  terminalTheme,
  defaultTheme,
  themesOptions,
};
