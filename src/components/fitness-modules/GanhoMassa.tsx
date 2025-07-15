import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Dumbbell,
  TrendingUp,
  Target,
  Activity,
  Star,
  Construction,
} from "lucide-react";

const GanhoMassa: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ganho de Massa Muscular
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Sistema avançado de hipertrofia com algoritmos de IA para maximizar
          seu ganho muscular
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-slate-900 dark:text-white">
            Módulo em Desenvolvimento
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Este módulo avançado está sendo desenvolvido com as mais recentes
            pesquisas em hipertrofia
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                Progressão Otimizada
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Algoritmos que adaptam cargas e volume automaticamente
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                Foco Muscular
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Periodização específica para cada grupo muscular
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                Recuperação
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Monitoramento inteligente da recuperação muscular
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Em Breve
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Este módulo incluirá análise genética simulada, periodização
              automatizada e planos nutricionais específicos para hipertrofia.
            </p>
            <Button
              disabled
              className="bg-slate-300 text-slate-500 cursor-not-allowed"
            >
              Aguarde o Lançamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GanhoMassa;
