import { Player } from '@/types'
import React from 'react'

const Leaderboard = ({player,rank}:{player:Player;rank:number}) => {
  console.log(rank,player);
  
  return (
    <div>
        <p>#{rank}</p>
        <h1>{player.name}</h1>
        <p>{player.score}</p>
    </div>
  )
}

export default Leaderboard