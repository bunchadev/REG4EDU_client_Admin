'use client'

import { useSession } from "next-auth/react"

const HomeApp=()=>{
    const {data:session} = useSession()
    return(
        <div style={{width:'100%',display:'flex',gap:10,marginBottom:700}}>
           <div style={{fontSize:30 }}>Welcome:</div>
           <div style={{fontSize:30 }}>{session?.user.userName}!</div>
        </div>
    )
}
export default HomeApp