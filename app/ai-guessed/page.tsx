import Image from "next/image";

export default function Home() {
    return(
        <div className="flex flex-col min-h-screen text-center bg-blue-400 pb-5 pt-10">
            <div className="text-lg text-black">The AI identified this character</div>
            <Image src="" alt="Character Image" width={400} height={600} />
            <h1 className="text-black">Charecter name</h1>
            <div className="text-lg m-20 text-black">AI is</div>
            <div className="flex items-center justify-center gap-30 mt-auto">
                <button className="px-8 py-4 bg-gray-100 text-black rounded-xl text-lg">Home</button>
                <button className="px-8 py-4 bg-gray-100 text-black rounded-xl text-lg">Play again</button>
                <button className="px-8 py-4 bg-gray-100 text-black rounded-xl text-lg">Leaderboard</button>
            </div>
        </div>
    )
}
