import { createContext, useState, useMemo, useEffect, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 1. Criamos um Contexto para o botão de trocar tema conseguir "falar" com o Provider
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const MuiThemeProvider = ({ children }) => {
  // Lemos o localStorage ou usamos 'light' como padrão
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Toda vez que o 'mode' mudar, o Tailwind é atualizado no HTML
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem("theme", mode);
  }, [mode]);

  // Função que o Header vai chamar para inverter o tema
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  // 2. O Tema do MUI agora é dinâmico e reage ao estado 'mode'
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, // O PULSO DA MÁGICA: Passa 'light' ou 'dark' para o MUI
          primary: { main: '#110364', contrastText: '#ffffff' },
          secondary: { main: '#F4C300', contrastText: '#000000' },
          background: {
            default: mode === 'dark' ? '#09091F' : '#D4D4D4', 
          },
          error: { main: '#E20000' },
          success: { main: '#119400' },
          action: { main: '#2500FF' },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 40,
                textTransform: 'none',
                fontWeight: 'bold',
                padding: '10px 24px',
              },
            },
          },
          MuiTextField: {
            defaultProps: { fullWidth: true },
          },
          // Não precisamos mais forçar o CSS do TextField! 
          // O `mode: 'dark'` já avisa o MUI para deixar tudo branco sozinho.
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

// Hook customizado para importar no Header
export const useColorTheme = () => useContext(ColorModeContext);