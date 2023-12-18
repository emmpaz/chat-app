import { PaletteColor, SimplePaletteColorOptions, createTheme } from "@mui/material";

declare module '@mui/material/styles' {
    interface Palette {
        custom: Palette['primary'];
    }

    interface PaletteOptions {
        custom: PaletteOptions['primary'];
    }
}

export const FontTheme = createTheme({
    typography: {
        fontFamily: 'Work Sans, sans-serif'
    }
});