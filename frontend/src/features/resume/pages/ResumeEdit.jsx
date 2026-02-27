import Header from "@/components/layout/Header";
import { CardEditResume } from "@/features/resume/components/CardEditResume";

export const ResumeEdit = () => {
  return (
    <>
      <Header fixed={false} />

      {/* Wrapper Principal com scroll suave se a tela for pequena */}
      <div className="min-h-screen flex justify-center items-start bg-background py-10 animate-fade-in">
        <CardEditResume />
      </div>
    </>
  );
};
