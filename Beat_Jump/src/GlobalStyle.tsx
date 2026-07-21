import { Global, css, useTheme } from '@emotion/react';

export const GlobalStyle = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: ${theme.colors.canvas};
          color: ${theme.colors.ink};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button {
          border: none;
          background: none;
          font: inherit;
          cursor: pointer;
        }
      `}
    />
  );
};