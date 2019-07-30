const themeFile = {
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#00bcd4",
      dark: "#008394",
      contrastText: "#fff" // text color white
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff"
    }
  },
  typography: {
    useNextVariants: true
  },
  form: {
    textAlign: "center"
  },
  image: {
    height: 225,
    width: 225
  },
  title: {
    margin: "0 auto 20px auto"
  },
  textField: {
    margin: "10px auto 10px auto"
  },
  button: {
    margin: "10px auto 10px auto",
    position: "relative" // so that progress can be in the middle
  },
  error: {
    color: "red",
    fontSize: "0.8rem"
  },
  progress: {
    position: "absolute"
  }
};

module.exports = { themeFile };