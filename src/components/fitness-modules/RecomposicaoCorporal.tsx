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
  RotateCcw,
  Scale,
  Target,
  Activity,
  Star,
  Construction,
} from "lucide-react";

const RecomposicaoCorporal: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Recomposição Corporal
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Perca gordura e ganhe músculo simultaneamente com estratégias
          científicas avançadas
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-800">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-slate-900 dark:text-white">
            Módulo em Desenvolvimento
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Sistema avançado baseado em pesquisas sobre recomposição corporal
            simultânea
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Scale className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                Duplo Objetivo
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Perda de gordura e ganho muscular simultâneos
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Target className="w-8 h-8 text-teal-500 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                Ciclagem Calórica
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Estratégias avançadas de periodização nutricional
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                Treino Híbrido
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Combinação otimizada de força e cardio
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-6">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Em Breve
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Este módulo incluirá ciclagem calórica automatizada, timing de
              nutrientes e monitoramento de composição corporal.
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

export default RecomposicaoCorporal;
