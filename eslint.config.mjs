import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "src/**/*.jsx",
      "src/bundle.jsx",
    ],
  },
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/components/wedding-app.tsx"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "react-hooks/purity": "off",
    },
  },
];

export default eslintConfig;
