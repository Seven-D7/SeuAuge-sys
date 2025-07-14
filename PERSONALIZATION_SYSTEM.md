# Sistema de Personalização Avançada - Meu Auge

## 🎯 Visão Geral

O sistema de personalização foi completamente reformulado para entregar recomendações precisas baseadas nas preferências, restrições e condições de saúde do usuário. O algoritmo agora considera fatores como veganismo, intolerância à lactose, diabetes, e outras condições para nunca recomendar algo inadequado.

## ✅ **Melhorias Implementadas:**

### 🔓 **1. Acesso Total Liberado**

- **Modo desenvolvimento**: Todos os usuários têm **Plano D (Auge)** automaticamente
- **Acesso completo**: Todas as funcionalidades premium disponíveis para teste
- **Sem restrições**: Apps, vídeos e recursos liberados

### 🧬 **2. Sistema de Preferências Inteligente**

**Store Completo (`preferencesStore.ts`):**

- ✅ Restrições alimentares (vegano, vegetariano, sem lactose, sem glúten, etc.)
- ✅ Alergias alimentares personalizadas
- ✅ Condições médicas (diabetes, hipertensão, hipotireoidismo, etc.)
- ✅ Medicamentos em uso
- ✅ Preferências de treino e experiência
- ✅ Orçamento e habilidades culinárias

**Interface de Configuração:**

- ✅ Wizard em 6 etapas guiadas
- ✅ Validação inteligente de dados
- ✅ Explicações contextuais
- ✅ Persistência automática

### 🤖 **3. Algoritmo Personalizado de Emagrecimento**

**Arquivo:** `src/lib/fitness/personalizedWeightLoss.ts`

**Inteligência Implementada:**

```typescript
// ❌ NUNCA vai recomendar:
if (isVegan) {
  // Não sugere: whey protein, ovos, leite, carne
  // Sugere: proteína vegetal, tofu, leguminosas
}

if (isLactoseIntolerant) {
  // Não sugere: leite, queijo, iogurte
  // Sugere: leite de amêndoas, queijo vegano
}

if (hasDiabetes) {
  // Não sugere: açúcar, carboidratos refinados
  // Sugere: baixo IG, stevia, monitoramento glicêmico
}
```

### 🍽️ **4. Planos Alimentares Inteligentes**

**Personalização por Restrição:**

```typescript
// Café da manhã VEGANO
nome: "Bowl de Aveia Vegano com Frutas";
ingredientes: ["aveia", "leite de amêndoas", "banana", "chia"];
alternativas: ["leite de aveia", "proteína de ervilha"];
alertas: []; // Nenhum alerta para veganos

// Café da manhã SEM GLÚTEN
nome: "Tapioca com Ovo e Queijo";
ingredientes: ["tapioca", "ovo", "queijo minas"];
alertas: ["✅ Livre de glúten"];
```

### 🏥 **5. Ajustes Médicos Automáticos**

**Condições Consideradas:**

- **Diabetes**: Déficit máximo 300 kcal, baixo IG, monitoramento glicêmico
- **Hipertensão**: Sódio <2g/dia, temperos naturais
- **Hipotireoidismo**: TMB reduzida em 10%, mais exercícios
- **SOP**: TMB reduzida em 15%, controle hormonal

### 💊 **6. Suplementação Personalizada**

```typescript
// Para VEGANOS
suplementos: [
  { nome: "Vitamina B12", razao: "Deficiência comum em veganos" },
  { nome: "Proteína Vegetal", alternativas: ["ervilha", "arroz", "hemp"] },
];

// Para DIABÉTICOS
suplementos: [{ nome: "Cromo", razao: "Auxilia controle glicêmico" }];
```

### ⚠️ **7. Sistema de Alertas Inteligentes**

**Alertas Nutricionais:**

- 🌱 **Veganos**: "Atenção especial à B12, ferro e ômega-3"
- 🩺 **Diabéticos**: "Monitore glicemia antes/depois das refeições"
- 🧂 **Hipertensos**: "Evite excesso de sódio (<2g/dia)"
- ⚠️ **Alérgicos**: "ALERGIA: Evite completamente [ingrediente]"

### 🎯 **8. Recomendações de Treino Personalizadas**

**Baseado em Condições:**

```typescript
// Para HIPERTENSOS
treino: {
  tipo: "Caminhada",
  modificacoes: ["Monitore frequência cardíaca", "Pare se sentir tontura"]
}

// Para DIABÉTICOS
treino: {
  tipo: "Musculação",
  modificacoes: ["Monitore glicemia antes/depois", "Tenha sempre um lanche"]
}
```

### 📊 **9. Marcos e Gamificação Personalizada**

**Probabilidade de Sucesso Calculada:**

- ✅ Base 70% + ajustes baseados em perfil
- ✅ Experiência: +10%
- ✅ Tempo disponível: +10%
- ✅ Meta realista: +10%
- ❌ Muitas condições médicas: -10%
- ❌ Meta agressiva: -15%

## 🛠️ **Como Usar o Sistema:**

### **1. Configurar Preferências**

1. Acesse "Perfil" → "Configurações"
2. Clique em "Personalização"
3. Complete o wizard de 6 etapas:
   - Informações Básicas (idade, peso, meta)
   - Objetivos (emagrecimento, ganho de massa, etc.)
   - Atividade Física (nível, tempo disponível)
   - Alimentação (restrições, alergias, habilidade culinária)
   - Saúde (condições médicas, medicamentos)
   - Preferências (orçamento, alertas)

### **2. Usar Apps Personalizados**

1. Acesse qualquer app fitness
2. O sistema automaticamente:
   - Filtra recomendações inadequadas
   - Sugere alternativas apropriadas
   - Ajusta cálculos para condições médicas
   - Personaliza suplementação

### **3. Verificar Alertas**

- ⚠️ Alertas aparecem automaticamente quando há conflitos
- 🔄 Alternativas são sugeridas automaticamente
- 📋 Recomendações médicas específicas são mostradas

## 🔬 **Tecnologia Implementada:**

### **Stores Zustand:**

- `preferencesStore.ts` - Preferências e restrições
- `levelStore.ts` - Sistema XP integrado
- `goalsStore.ts` - Metas personalizadas

### **Algoritmos:**

- `PersonalizedWeightLossCalculator` - Emagrecimento inteligente
- Filtragem automática de ingredientes
- Cálculo de TMB ajustado por condições médicas
- Geração de alternativas contextuais

### **Componentes:**

- `PreferencesSetup` - Wizard de configuração
- Integração com sistema XP existente
- Alertas visuais automáticos

## 🎮 **Exemplos Práticos:**

### **Usuário Vegano + Diabético:**

```
❌ NUNCA sugere: Whey protein, leite, açúcar refinado
✅ SEMPRE sugere: Proteína vegetal, leite de amêndoas, stevia
📊 Ajustes: TMB normal, déficit máximo 300 kcal
⚠️ Alertas: B12, controle glicêmico, monitoramento
```

### **Usuário Hipertenso + Intolerante à Lactose:**

```
❌ NUNCA sugere: Queijo, leite, sal em excesso, embutidos
✅ SEMPRE sugere: Queijo vegano, temperos naturais, ervas
📊 Ajustes: Sódio <2g/dia, exercícios moderados
⚠️ Alertas: Pressão arterial, ingredientes com lactose
```

## 🚀 **Benefícios do Sistema:**

1. **Zero Recomendações Inadequadas**: Nunca sugere o que o usuário não pode consumir
2. **Alternativas Automáticas**: Sempre oferece substituições apropriadas
3. **Segurança Médica**: Considera condições de saúde nos cálculos
4. **Experiência Personalizada**: Cada usuário tem um plano único
5. **Gamificação Integrada**: XP e níveis conectados às metas pessoais

---

**Status**: ✅ **SISTEMA TOTALMENTE FUNCIONAL E TESTÁVEL**

O sistema está pronto para uso e teste completo. Todos os usuários em modo desenvolvimento têm acesso total (Plano D) para explorar todas as funcionalidades de personalização.
