import React from "react";
import { Grid } from "@mui/material";
import Select from "../utils/Select";

const FooterMenu = ({ themesOptions, theme, handleThemeChange }) => {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Select
        classNamePrefix="Select"
        value={themesOptions.find((e) => e.value.label === theme.label)}
        options={themesOptions}
        isSearchable={false}
        isSelected={false}
        onChange={handleThemeChange}
        menuPlacement="top"
      ></Select>
    </Grid>
  );
};

export default FooterMenu;
