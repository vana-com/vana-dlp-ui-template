import { Container, Text, colorsTuple, createTheme, rem } from "@mantine/core";
import { Khand } from "next/font/google";
import localFont from "next/font/local";

const khand = Khand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const arrayFont = localFont({
  src: [
    {
      path: "../fonts/Array-Wide.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Array-SemiboldWide.otf",
      weight: "500",
      style: "bolder",
    },
    {
      path: "../fonts/Array-BoldWide.otf",
      weight: "700",
      style: "bold",
    },
  ],
});

export const theme = createTheme({
  components: {
    Container: Container.extend({
      defaultProps: {
        size: "lg",
      },
    }),
    Text: Text.extend({
      defaultProps: {
        size: "sm",
      },
    }),
  },
  fontFamily: khand.style.fontFamily,
  fontFamilyMonospace: arrayFont.style.fontFamily,
  headings: {
    fontFamily: khand.style.fontFamily,
    sizes: {
      h1: {
        fontSize: rem(60),
      },
      h2: {
        fontSize: rem(56),
      },
      h3: {
        fontSize: rem(40),
      },
      h4: {
        fontSize: rem(32),
      },
      h5: {
        fontSize: rem(24),
      },
      h6: {
        fontSize: rem(16),
      },
    },
  },
  fontSizes: {
    xl: rem(32),
    lg: rem(24),
    md: rem(20),
    sm: rem(16),
    xs: rem(14),
    xxs: rem(12),
  },
  lineHeights: {
    xl: rem(48),
    lg: rem(32),
    md: rem(28),
    sm: rem(24),
    xs: rem(20),
    xxs: rem(16),
  },
  spacing: {
    xs: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
    xxl: rem(40),
  },
  colors: {
    ["brand-1"]: colorsTuple("#90D26D"),
    ["brand-2"]: colorsTuple("#A0AA96"),
    ["brand-3"]: colorsTuple("#2D7865"),
    ["brand-4"]: colorsTuple("#D9EDBF"),
    ["brand-5"]: colorsTuple("#F7FFF4"),
    ["brand-6"]: colorsTuple("#F3F8EE"),
    ["brand-7"]: colorsTuple("#E0EAE3"),
    ["brand-8"]: colorsTuple("#A5B3A5"),
  },
});
