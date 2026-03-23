"use client"
import { Badge } from "@/components/ui/badge"
import React from 'react'
import { 
  Trophy, 
  Star, 
  MessageSquare, 
  Award, 
  Github, 
  Linkedin, 
  Edit3, 
  Mail, 
  ExternalLink,
  Target,
  Brain,
  Rocket,
  Zap,
  LucideIcon 
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth_store"




const userData = {
  handle: "@arthur_pavan",
  avatar: "", 
  bio: "sou o arthur né cria.",
  pontos: 12850,
  rankingPos: 1,
  stats: { duvidas: 12, respostas: 45, missoes: 28 },
  conquistas: [
    { icon: Trophy, nome: "Top 1 Semanal", color: "text-yellow-500" },
    { icon: Rocket, nome: "Early Adopter", color: "text-blue-500" },
    { icon: Brain, nome: "Expert em Logic", color: "text-purple-500" },
  ],
  atividades: [
    { icon: MessageSquare, title: "Respondeu uma dúvida em Engenharia de Software", time: "Há 2 horas" },
    { icon: Target, title: "Completou a missão semanal 'Mentor do Mês'", time: "Há 5 horas" },
    { icon: Zap, title: "Iniciou um novo tópico sobre Next.js 15", time: "Ontem" },
  ],
  
}

export default function PerfilPage() {
  
  const name = useAuthStore(state => state.name)
  const course_year = useAuthStore(state => state.course_year)
  const course = useAuthStore(state => state.course)

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      
      <div className="relative bg-card border border-border overflow-hidden shadow-sm ">
        <div className = "h-32   opacity-20" /> {/**aqui eu posso colocar uma cor para o banner caso for necessario */ }
        
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] border-4 border-card shadow-xl bg-muted flex items-center justify-center overflow-hidden">
                {userData.avatar ? (
                   <img src={userData.avatar} alt="Avatar" className="object-cover w-full h-full" />
                ) : (
                   <Brain size={48} className="text-muted-foreground" /> 
                )}
              </div>
              <Button size="icon" className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">
                <Edit3 size={16} />
              </Button>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tighter">{name}</h1>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/20 text-xs font-black px-3 py-1 rounded-full uppercase">
                  RANK #{userData.rankingPos}
                </Badge>
              </div>
              <p className="text-muted-foreground font-medium">
                {userData.handle} • {course} • {course_year}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 rounded-2xl font-bold text-xs uppercase tracking-widest">
                <ExternalLink size={14} /> Compartilhar 
              </Button>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest">
                <Edit3 size={14} /> Editar Perfil 
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="space-y-8">
          <div className="bg-card border border-border p-8 relative overflow-hidden group ">
            <Trophy size={80} className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform" />
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Pontuação Total</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter text-yellow-500">
                {userData.pontos.toLocaleString()}
              </span>
              <span className="text-sm font-bold opacity-70">pts</span>
            </div>
          </div>

          <div className="bg-card border border-border p-8 space-y-6 ">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Estatísticas</h3>
            <div className="space-y-4">
              {[
                { label: "Dúvidas Criadas", val: userData.stats.duvidas, icon: MessageSquare, color: "text-blue-500" },
                { label: "Respostas dadas", val: userData.stats.respostas, icon: Star, color: "text-amber-500" },
                { label: "Missões Totais", val: userData.stats.missoes, icon: Target, color: "text-red-500" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <s.icon size={18} className={s.color} />
                    <span className="text-sm font-bold">{s.label}</span>
                  </div>
                  <span className="font-black text-lg">{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border p-8 ">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Conquistas Desbloqueadas</h3>
              <Button className="text-xs font-black text-primary hover:underline">VER TODAS</Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {userData.conquistas.map((c, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-6 bg-muted/20 border border-transparent hover:border-primary/20 hover:bg-primary/5 rounded-[2rem] transition-all group">
                  <c.icon size={32} className={`mb-3 group-hover:scale-110 transition-transform ${c.color}`} />
                  <span className="text-[10px] font-black text-center uppercase tracking-tighter leading-tight">{c.nome}</span>
                </div>
              ))}
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-[2rem] opacity-30">
                <Award size={24} className="mb-2" />
                <span className="text-[10px] font-bold">BLOQUEADO</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-8 ">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-8">Atividade Recente</h3>
            <div className="space-y-6">
              {userData.atividades.map((item, i) => (
                <div key={i} className="flex gap-4 items-start group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1 border-b border-border pb-4 group-last:border-0">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}