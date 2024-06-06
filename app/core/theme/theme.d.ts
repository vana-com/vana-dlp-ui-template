import { DefaultMantineColor, MantineColorsTuple } from "@mantine/core";

type ExtendedCustomColors =
  | "brand-1"
  | "brand-2"
  | "brand-3"
  | "brand-4"
  | "brand-5"
  | "brand-6"
  | "brand-7"
  | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}
