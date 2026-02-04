import ButtonRanking from "@/app/components/ranking/ButtonRanking";

function Ranking() {
    return (
        <>
            <div className='mt-5 flex'>
                <ButtonRanking tipo='ranking' />
                <ButtonRanking tipo='curso' />

            </div>
            <div  className='py-5'>
                <h1 className='font-semibold text-lg '>Ranking - Geral</h1>
            </div>
        </>
        )
}

export default Ranking;