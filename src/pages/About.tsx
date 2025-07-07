import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Sobre o Seu Auge</h1>
        <p>
          O <strong>Seu Auge</strong> nasceu com a missão de facilitar o acesso a
          conteúdo de qualidade sobre saúde, nutrição e bem-estar. Nossa equipe
          reúne profissionais apaixonados por transformar vidas por meio de
          orientações confiáveis e ferramentas que impulsionam resultados.
        </p>
        <p>
          Aqui você encontrará vídeos, planos personalizados e uma comunidade
          pronta para apoiar cada etapa da sua jornada. Acreditamos que o
          equilíbrio entre mente e corpo é essencial para atingir o máximo
          potencial e queremos estar ao seu lado nesse processo.
        </p>
        <p>
          Junte-se a nós e descubra como pequenos hábitos podem gerar grandes
          mudanças. Estamos comprometidos em oferecer uma experiência segura e
          motivadora para que você alcance seus objetivos com tranquilidade.
        </p>
      </div>
    </div>
  );
};

export default About;
