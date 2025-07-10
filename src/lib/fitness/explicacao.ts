import type { UserData } from '@/components/EmagrecimentoAvancado';
import type { WeightLossResults } from '@/components/EmagrecimentoAvancado';

export function gerarContextoExplicacao(results: WeightLossResults, user: UserData) {
  return {
    nome: user.nome,
    idade: user.idade,
    sexo: user.sexo,
    tipoGenetico: results.perfil_genetico.dominantType,
    powerScore: results.perfil_genetico.powerScore,
    enduranceScore: results.perfil_genetico.enduranceScore,
    probabilidade: results.probabilidade_sucesso,
    calorias: results.calorias_diarias,
    tipoTreino: results.plano_treino.tipo_principal,
    frequencia: results.plano_treino.frequencia_semanal,
    intensidade: results.plano_treino.intensidade,
    experiencia: user.experiencia_exercicio,
    confianca: user.confianca_exercicio,
    recomendacoes: results.recomendacoes_personalizadas,
  };
}

export async function gerarExplicacaoFinal(contexto: ReturnType<typeof gerarContextoExplicacao>): Promise<{ paragrafo: string, bullets: string[] }> {
  const bullets = [
    `Seu tipo genético dominante é "${contexto.tipoGenetico}" com score ${contexto.powerScore}/${contexto.enduranceScore}`,
    `Seu treino foca em ${contexto.tipoTreino} com frequência de ${contexto.frequencia}x por semana`,
    `A intensidade sugerida é ${contexto.intensidade}, ideal para seu nível de experiência (${contexto.experiencia})`,
    `A meta calórica foi definida em ${contexto.calorias} kcal/dia com base no seu perfil`,
    ...contexto.recomendacoes
  ];

  const prompt = `
Crie um parágrafo motivacional explicando por que este plano é ideal para ${contexto.nome}, considerando que ela tem ${contexto.idade} anos, sexo ${contexto.sexo}, confiança ${contexto.confianca}/10, tipo genético ${contexto.tipoGenetico}, e um plano com treino ${contexto.tipoTreino}, ${contexto.frequencia}x/semana.
Evite termos técnicos demais. Seja empático e realista.
Probabilidade de sucesso estimada: ${(contexto.probabilidade * 100).toFixed(0)}%
`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const json = await res.json();
    const paragrafo = json.choices?.[0]?.message?.content || '';
    return { paragrafo, bullets };
  } catch (err) {
    console.error('Erro ao gerar explicação com LLM:', err);
    return {
      paragrafo: 'Não foi possível gerar uma explicação completa no momento.',
      bullets
    };
  }
}
