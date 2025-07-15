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
  Zap,
  Trophy,
  Target,
  Activity,
  Star,
  Construction,
} from "lucide-react";

const PerformanceAtletica: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Performance Atlética
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Maximize seu desempenho esportivo com treinamento científico
          personalizado
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="text-slate-900 dark:text-white">
            Módulo em Desenvolvimento
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Sistema especializado em otimização da performance esportiva baseado
            em ciência do esporte
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                Esporte Específico
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Treinamento personalizado para sua modalidade
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Target className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                Periodização
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Picos de performance para competições
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Activity className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                Análise Biomecânica
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Otimização de movimentos e técnicas
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Em Breve
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Este módulo incluirá análise de movimentos, periodização para
              competições e estratégias de recuperação avançadas.
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

export default PerformanceAtletica;
