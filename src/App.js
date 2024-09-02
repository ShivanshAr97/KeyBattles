import React, { useState, useRef, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { defaultTheme, themesOptions } from "./style/theme";
import { GlobalStyles } from "./style/global";
import TypeBox from "./components/features/TypeBox/TypeBox";
import Logo from "./components/common/Logo";
import FooterMenu from "./components/common/FooterMenu";

function App() {
  const [theme, setTheme] = useState(() => {
    const stickyTheme = window.localStorage.getItem("theme");
    if (stickyTheme !== null) {
      const localTheme = JSON.parse(stickyTheme);
      const upstreamTheme = themesOptions.find(
        (e) => e.label === localTheme.label
      ).value;
      const isDeepEqual = localTheme === upstreamTheme;
      return isDeepEqual ? localTheme : upstreamTheme;
    }
    return defaultTheme;
  });

  const handleThemeChange = (e) => {
    window.localStorage.setItem("theme", JSON.stringify(e.value));
    setTheme(e.value);
  };

  const textInputRef = useRef(null);
  const focusTextInput = () => {
    textInputRef.current && textInputRef.current.focus();
  };

  useEffect(() => {
    focusTextInput();
    return;
  }, [theme]);

  return (
    <ThemeProvider theme={theme}>
      <>
        <div className="canvas">
          <GlobalStyles />
          <Logo />
          <TypeBox
            textInputRef={textInputRef}
            theme={theme}
            key="type-box"
            handleInputFocus={() => focusTextInput()}
          ></TypeBox>
          <div className="bottomBar">
            <FooterMenu
              themesOptions={themesOptions}
              theme={theme}
              handleThemeChange={handleThemeChange}
            ></FooterMenu>
          </div>
        </div>
      </>
    </ThemeProvider>
  );
}

export default App;
