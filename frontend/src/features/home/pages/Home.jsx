import Header from "@/components/layout/Header";
import CardHome from '@/features/home/components/CardHome'

export const Home = () => {
    return (
        <>
            <Header />
            {/* Remova bg-background e dark:bg-[#09091F]. Deixe apenas a estrutura! */}
            <div className="h-screen flex justify-center items-center">
                <CardHome />
            </div>
        </>
    )
}