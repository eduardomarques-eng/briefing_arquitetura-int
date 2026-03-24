import { BriefingForm } from '@/components/BriefingForm';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-16 mt-8">
          <p className="text-sm font-semibold tracking-widest text-[#8A8375] uppercase mb-3">
            Arqvertice Arquitetura
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-[#1A1A1A] mb-6 tracking-tight">
            Briefing de Projeto
          </h1>
          <p className="text-lg text-[#5A5A5A] max-w-2xl mx-auto font-light leading-relaxed">
            Queremos entender a sua visão. Preencha o formulário abaixo com o máximo de detalhes possível para que possamos criar um projeto que reflita a sua essência.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <BriefingForm />
        </div>
        
        <footer className="mt-16 text-center pb-8">
          <p className="text-sm text-gray-400 font-light">
            © {new Date().getFullYear()} Arqvertice Arquitetura. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-400 font-light mt-2">
            Desenvolvido por Eduardo Marques
          </p>
        </footer>
      </div>
    </main>
  );
}
