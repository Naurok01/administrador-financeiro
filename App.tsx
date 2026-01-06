
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType } from './types';
import { CATEGORIES } from './constants';
import Dashboard from './components/Dashboard';
import { analyzeFinances } from './services/geminiService';

// Initial Mock Data
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Salário', amount: 5000, date: '2024-03-01', category: 'Salário', type: TransactionType.INCOME },
  { id: '2', description: 'Aluguel', amount: 1500, date: '2024-03-02', category: 'Moradia', type: TransactionType.EXPENSE },
  { id: '3', description: 'Supermercado', amount: 800, date: '2024-03-05', category: 'Alimentação', type: TransactionType.EXPENSE },
  { id: '4', description: 'Freelance Design', amount: 1200, date: '2024-03-10', category: 'Freelance', type: TransactionType.INCOME },
  { id: '5', description: 'Restaurante', amount: 250, date: '2024-03-12', category: 'Lazer', type: TransactionType.EXPENSE },
];

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES.EXPENSE[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      amount: parseFloat(amount),
      date,
      category,
      type,
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setDescription('');
    setAmount('');
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const analysis = await analyzeFinances(transactions);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              FinanSmart AI
            </h1>
          </div>
          <button 
            onClick={handleAiAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? 'Analisando...' : '✨ Análise IA'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* IA Section */}
        {aiAnalysis && (
          <div className="mb-8 bg-indigo-600 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>Insight da Inteligência Artificial</span>
                </h2>
                <button onClick={() => setAiAnalysis(null)} className="text-indigo-200 hover:text-white">✕</button>
              </div>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-indigo-50 text-sm leading-relaxed">
                {aiAnalysis}
              </div>
            </div>
          </div>
        )}

        <Dashboard transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Add Transaction Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Nova Transação</h2>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tipo</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setType(TransactionType.EXPENSE); setCategory(CATEGORIES.EXPENSE[0]); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${type === TransactionType.EXPENSE ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
                    >
                      Despesa
                    </button>
                    <button
                      type="button"
                      onClick={() => { setType(TransactionType.INCOME); setCategory(CATEGORIES.INCOME[0]); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${type === TransactionType.INCOME ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
                    >
                      Receita
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Descrição</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Ex: Almoço, Salário..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Valor (R$)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Data</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                  >
                    {type === TransactionType.INCOME 
                      ? CATEGORIES.INCOME.map(c => <option key={c} value={c}>{c}</option>)
                      : CATEGORIES.EXPENSE.map(c => <option key={c} value={c}>{c}</option>)
                    }
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                >
                  Adicionar Transação
                </button>
              </form>
            </div>
          </div>

          {/* Transaction List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg font-bold">Histórico Recente</h2>
                <span className="text-xs font-medium text-slate-400">{transactions.length} transações</span>
              </div>
              <div className="divide-y divide-slate-50">
                {transactions.map((t) => (
                  <div key={t.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {t.type === TransactionType.INCOME ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{t.description}</p>
                        <p className="text-xs text-slate-400">{t.category} • {new Date(t.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {transactions.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-slate-400">Nenhuma transação encontrada.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
        </button>
      </div>
    </div>
  );
};

export default App;
