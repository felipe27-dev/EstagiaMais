# 🚀 Estagia+

> **Plataforma Inteligente de Gestão e Análise de Currículos com IA**

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![React](https://img.shields.io/badge/React-18-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95%2B-green)

## 📖 Sobre o Projeto

O **Estagia+** é uma plataforma full-stack desenvolvida para automatizar o gerenciamento, armazenamento e análise de currículos por meio de inteligência artificial. O sistema transforma documentos não estruturados em dados organizados e analisáveis, permitindo:

- Filtragem estratégica de candidatos.
- Ranqueamento por compatibilidade com vagas (*Match*).
- Apoio objetivo à tomada de decisão.

Não se trata apenas de um banco de currículos, mas de uma ferramenta de engenharia enterprise-ready, projetada para ser escalável, segura e eficiente.

---

## 🛠️ Tech Stack & Arquitetura

O projeto foi construído seguindo princípios de **Engenharia de Software Enterprise-Ready**, focando em desacoplamento, escalabilidade e manutenibilidade.

### 🎨 Frontend (Client-Side)
Construído para alta performance e experiência do usuário fluida (SPA).

| Tecnologia | Função / Motivo da Escolha |
| :--- | :--- |
| **React + Vite** | Renderização reativa e ambiente de desenvolvimento ultra-rápido. |
| **Tailwind CSS** | Estilização utilitária para consistência visual e produtividade. |
| **Material UI** | Componentes robustos e acessíveis prontos para uso. |
| **React Router** | Navegação fluida sem recarregamento de página (SPA). |
| **Axios** | Camada de serviço centralizada para comunicação HTTP. |
| **TanStack Query** | Gerenciamento de estado assíncrono (cache, loading, erros). |
| **MSW (Mock Service Worker)** | Simulação de API em nível de rede para desenvolvimento independente do backend. |
| **React Error Boundary** | Resiliência contra falhas inesperadas na interface. |

### ⚙️ Backend (Server-Side)
API REST robusta com foco em performance e segurança.

| Tecnologia | Função / Motivo da Escolha |
| :--- | :--- |
| **Python** | Linguagem base, ideal para integração futura com modelos de IA. |
| **FastAPI** | Framework moderno, assíncrono e com tipagem forte. |
| **PostgreSQL** | Banco de dados relacional robusto para integridade dos dados. |
| **SQLAlchemy** | ORM para modelagem estruturada e flexível. |
| **Alembic** | Controle seguro de migrações e evolução do banco de dados. |

---

## 🧩 Padrões de Qualidade e DX

A qualidade do código é assegurada por ferramentas de automação que impedem a entrada de dívida técnica:

- **ESLint & Prettier:** Padronização de código e prevenção de erros de sintaxe/estilo.
- **Husky & lint-staged:** Hooks de git que impedem commits fora dos padrões definidos.
- **Arquitetura Desacoplada:** Separação clara entre interface, regras de negócio e persistência de dados.

---

## 🚀 Como Executar

Siga os passos abaixo para rodar o projeto localmente.

### Pré-requisitos
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL

### 1. Backend

```bash
# Entre na pasta do backend
cd backend

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente (.env) e rode as migrações
alembic upgrade head

# Inicie o servidor
uvicorn main:app --reload
```

### 2. Frontend

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install
# ou
yarn install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🧪 Mocking e Testes

O frontend utiliza **MSW** para desenvolvimento isolado. Caso o backend não esteja rodando, certifique-se de que o worker do MSW está ativo no navegador para simular as requisições e testar a interface.

---

## 🤝 Contribuição

1. Faça um Fork do projeto.
2. Crie uma Branch para sua Feature (`git checkout -b feature/MinhaFeature`).
3. Commit suas mudanças (`git commit -m 'Adiciona funcionalidade X'`).
4. Push para a Branch (`git push origin feature/MinhaFeature`).
5. Abra um Pull Request.

---

**Estagia+** © 2024 - Desenvolvido com foco em eficiência e inovação.