import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { TrendingUp } from 'lucide-react';

interface NextStepsSectionProps {
  title?: string;
  description?: string;
}

const NextStepsSection: React.FC<NextStepsSectionProps> = ({
  title = "🎉 Relatório Salvo com Sucesso!",
  description = "Seu relatório personalizado foi salvo e está disponível na sua área de progresso."
}) => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6 text-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => window.location.href = '/progress'}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Ver Meus Relatórios
          </Button>
          <Button
            onClick={() => window.location.href = '/apps'}
            variant="outline"
            className="border-slate-300 dark:border-slate-600"
          >
            Explorar Outros Apps
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextStepsSection;
