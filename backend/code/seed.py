import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from code.settings import settings
from code.db.models.domain import User, Resume, Analysis, AnalysisResult

async def seed_data():
    print("Conectando ao banco de dados...")
    engine = create_async_engine(str(settings.db_url))
    AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

    async with AsyncSessionLocal() as session:
        """
        print("Inserindo Usuários...")
        user1 = User(name='Felipe', email='felipe@gmail.com', hashed_password='senha123', role='admin')
        user2 = User(name='Rebeca', email='rebeca@gmail.com', hashed_password='senha456', role='user')
        session.add_all([user1, user2])
        """
        
        print("Inserindo Currículos...")
        resume1 = Resume(
            name_candidate='Lucas Almeida Santos', email_candidate='lucas.almeida@gmail.com',
            phone_candidate='67992345678', degree_candidate='Bacharelado em Sistemas de Informação - UFMS (2024)',
            profile_candidate='Desenvolvedor Full Stack com foco em React, Node.js e PostgreSQL. Experiência com Docker, Git e projetos acadêmicos.',
            resume_archive='lucas_almeida_cv.pdf'
        )
        resume2 = Resume(
            name_candidate='Mariana Costa Ribeiro', email_candidate='mariana.costa@outlook.com',
            phone_candidate='11988764321', degree_candidate='Engenharia de Computação - UNESP (2023)',
            profile_candidate='Desenvolvedora Frontend especializada em React, Tailwind e UX/UI. Experiência com Material UI e interfaces responsivas.',
            resume_archive='mariana_costa_curriculo.pdf'
        )
        resume3 = Resume(
            name_candidate='Gabriel Henrique Souza', email_candidate='gabriel.souza@yahoo.com',
            phone_candidate='21997112233', degree_candidate='Análise e Desenvolvimento de Sistemas - IFSP (2022)',
            profile_candidate='Desenvolvedor Backend com experiência em Python, FastAPI e SQLAlchemy. Atua com APIs REST e PostgreSQL.',
            resume_archive='gabriel_henrique_resume.pdf'
        )
        session.add_all([resume1, resume2, resume3])

        print("Inserindo Análises...")
        analysis1 = Analysis(
            text_input='Procuramos desenvolvedor Full Stack com experiência em React, Node.js, PostgreSQL e Docker. Diferencial conhecimento em metodologias ágeis.',
            tags_input='fullstack, react, nodejs, postgresql, docker, agile'
        )
        analysis2 = Analysis(
            text_input='Vaga para Desenvolvedor Backend com foco em APIs REST utilizando Python e FastAPI. Necessário conhecimento em SQL e boas práticas de arquitetura.',
            tags_input='backend, python, fastapi, api, sql, arquitetura'
        )
        session.add_all([analysis1, analysis2])
        
        # O flush envia os dados pro banco pra gerar os IDs antes do commit final
        await session.flush()

        print("Inserindo Resultados...")
        result1 = AnalysisResult(analysis_id=analysis1.id, resume_id=resume1.id, score_resume=8.7, feedback_resume='Currículo bem estruturado, boas tecnologias modernas e alinhamento forte com a vaga. Pode melhorar detalhando métricas de resultados.')
        result2 = AnalysisResult(analysis_id=analysis1.id, resume_id=resume2.id, score_resume=7.9, feedback_resume='Perfil técnico sólido para frontend. Recomenda-se aprofundar experiência prática e incluir projetos com impacto mensurável.')
        result3 = AnalysisResult(analysis_id=analysis2.id, resume_id=resume3.id, score_resume=9.2, feedback_resume='Excelente compatibilidade com backend e APIs REST. Experiência consistente com FastAPI e PostgreSQL. Perfil altamente recomendado.')
        session.add_all([result1, result2, result3])

        await session.commit()
        print("✅ Dados inseridos com sucesso!")

if __name__ == "__main__":
    asyncio.run(seed_data())