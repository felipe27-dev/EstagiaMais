import Header from "@/components/layout/Header";
import { CardEditResume } from "@/features/resume/components/CardEditResume";
import { useLocation } from "react-router-dom";
import { resumeService } from "../../../services/resumeServices";
import { useState, useEffect, useCallback } from "react";

export const ResumeEdit = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [curriculo, setCurriculo] = useState(null);

  const handleResumeSelect = useCallback(async() => {
    try{
      if (location.state?.curriculo){
        const { curriculo } = location.state;
        setCurriculo(curriculo);
      }else{
        const data = await resumeService.getById(id);
        setCurriculo(data);
      }
    }catch(e){
      console.error("Erro encontrado:",e)
    }
  }, [])

  useEffect(()=>{
    handleResumeSelect();
  },[handleResumeSelect])
  
  return (
    <>
      <Header fixed={false} />

      {/* Wrapper Principal com scroll suave se a tela for pequena */}
      <div className="min-h-screen flex justify-center items-start bg-background dark:bg-[#09091F] py-10 animate-fade-in">
        <CardEditResume curriculo={curriculo} />
      </div>
    </>
  );
};
