import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 1. Definição do Tema
const theme = createTheme({
  palette: {
    primary: {
      main: '#110364', // Seu azul principal
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F4C300', // Seu amarelo/dourado
      contrastText: '#000000',
    },
    background: {
      default: '#EAEAEA', // Cor de fundo do projeto
    },
    error: {
      main: '#E20000', // Vermelho para erros
    },
    success: {
      main: '#119400', // Verde para sucesso
    },
    action: {
      main: '#2500FF', // Azul para ações
    }
  },
  shape: {
    borderRadius: 12, // Arredondamento padrão para tudo (inputs, cards)
  },
  components: {
    // 2. Overrides: Aqui você define o comportamento global dos componentes
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 40, // Botões sempre redondos (como no seu layout)
          textTransform: 'none', // Remove o CAPS LOCK automático do MUI
          fontWeight: 'bold',
          padding: '10px 24px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true, // Inputs sempre ocupam a largura total por padrão
      },
    },
  },
});

export const MuiThemeProvider = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline limpa o CSS do navegador e aplica as cores do tema ao body */}
      <CssBaseline /> 
      {children}
    </ThemeProvider>
  );
};
