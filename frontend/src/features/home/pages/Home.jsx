import Header from "@/components/layout/Header";
import CardHome from '@/features/home/components/CardHome'

export const Home = () => {
    return (
        <>
            <Header />
            <div className="h-screen flex justify-center items-center bg-background dark:bg-[#09091F]">
                <CardHome />
            </div>
        </>
    )
}
