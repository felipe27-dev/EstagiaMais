import asyncio
from sqlalchemy import text  # 👈 1. Importe a função 'text' do SQLAlchemy
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from code.settings import settings
# from code.db.models.domain import User, Resume, Analysis, AnalysisResult

async def seed_data():
    print("Conectando ao banco de dados...")
    engine = create_async_engine(str(settings.db_url))
    AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

    async with AsyncSessionLocal() as session:
        print("Limpando a tabela e resetando o contador de IDs...")
        
        # 👈 2. Envolva o comando SQL dentro de text()
        await session.execute(text("TRUNCATE TABLE resumes RESTART IDENTITY CASCADE;"))
        
        await session.commit()
        print("Tabela limpa com sucesso! O próximo ID será o 1.")
        
    # 👈 3. Boa prática: fechar a conexão com o banco quando o script terminar
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_data())