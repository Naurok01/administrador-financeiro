
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const analyzeFinances = async (transactions: Transaction[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const dataSummary = transactions.map(t => `${t.date}: ${t.type} - ${t.category} - R$${t.amount}`).join('\n');

  const prompt = `
    Aja como um consultor financeiro sênior. Analise a seguinte lista de transações de um usuário e forneça:
    1. Um resumo rápido da saúde financeira (está gastando mais do que ganha?).
    2. Identifique as 3 maiores categorias de gastos.
    3. Dê 3 dicas práticas e personalizadas para economizar baseadas nos dados.
    4. Seja motivador e direto.
    
    Transações:
    ${dataSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Erro ao conectar com a inteligência artificial.";
  }
};
