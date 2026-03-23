import { CircleUserRound, Crown, Mail, Star } from "lucide-react"
import { Badge } from "../ui/badge"

interface UserHallProps {
  name: string
  pontos: number
  email: string
}

export function UserHall({ name, pontos, email }: UserHallProps) {
  return (
    <div className="group relative bg-card hover:bg-muted/50 flex flex-col items-center text-center max-w-xs p-6 gap-3 hover:scale-105 transition-all duration-500 shadow-lg border border-border hover:border-yellow-400/50 overflow-hidden">
      
      {/* Efeito de luz no topo ao passar o mouse */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl group-hover:bg-yellow-400/20 transition-colors" />

      
      <div className="text-yellow-500 bg-yellow-500/10 p-2 rounded-full mb-1 animate-bounce-subtle">
        <Crown size={20} className="fill-current" />
      </div>

      
      <div className="relative">
        <div className="bg-muted p-1 rounded-full border-2 border-yellow-400/30 group-hover:border-yellow-400 transition-colors">
          {/** isso vai se tranformar na imagem do usuario */}<CircleUserRound size={60} className="text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
        </div>
        
      </div>

      
      <div className="mt-2">
        <h1 className="text-xl font-display font-black uppercase italic tracking-tighter text-foreground">
          {name}
        </h1>
        <div className="flex items-center justify-center gap-1 text-muted-foreground">
            <Mail size={12} />
            <p className="text-xs truncate max-w-[150px]">{email}</p>
        </div>
      </div>

      
      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-none font-bold">
        <Star size={12} className="mr-1 fill-current" />
        5x campeao {/**quantidade de vitoria que vira do store  */}
      </Badge>
      
      
      <div className="mt-4 pt-4 border-t border-border w-full">
        <p className="text-3xl font-black text-yellow-500 drop-shadow-sm">
          {pontos.toLocaleString()} {/**pontos viram do backend tbmmm */}
        </p>
        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
          Pontos Acumulados
        </p>
      </div>
    </div>
  )
}

