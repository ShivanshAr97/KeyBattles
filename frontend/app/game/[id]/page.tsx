"use client"

import ActualGame from '@/components/game';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react'

const GameRoom = ({ searchParams, params }: { searchParams: { name?: string }; params: { id: string } }) => {

    const router = useRouter()
    const [name, setName] = useState("")

    const appendName = (e: FormEvent) => {
        e.preventDefault();
        if (!name) return;
        router.push(`/game/${params.id}?name=${name}`);
    }

    if (!searchParams.name) {
        return (
            <div className='border gap-4 h-screen text-2xl flex -mt-[8rem] items-center justify-center'>
                <input className='p-4 border rounded-md' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' name="" id="" />
                <button className='rounded-md border px-6 py-4 text-white bg-blue-600' onClick={appendName}>Join game</button>
            </div>
        )
    }
    return (
        <ActualGame gameId={params.id} name={searchParams.name} />
    )
}

export default GameRoom
