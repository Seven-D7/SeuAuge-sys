import React, { useEffect } from 'react';
import { StepProps } from './types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { ArrowLeft, CheckCircle, BarChart3 } from 'lucide-react';

export default function StepSeven({ form, onNext, onPrevious, canGoBack, isLastStep, defaultValues }: StepProps) {
  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach(key => {
        form.setValue(key, defaultValues[key]);
      });
    }
  }, [defaultValues, form]);

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
            Dados Avançados (Opcional)
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Informações adicionais para um plano ainda mais preciso
          </p>
        </div>

        {/* Bioimpedância */}
        <FormField
          control={form.control}
          name="bioimpedancia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resultados de bioimpedância</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Se você tem resultados de bioimpedância (% de gordura, massa muscular, etc.), cole aqui..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <p className="text-sm text-gray-600">
                Exemplo: Gordura corporal: 25%, Massa muscular: 35kg, Água corporal: 55%
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Exames Laboratoriais */}
        <FormField
          control={form.control}
          name="exames_laboratoriais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exames laboratoriais recentes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Resultados de exames de sangue, colesterol, glicemia, etc..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <p className="text-sm text-gray-600">
                Exemplo: Colesterol total: 180mg/dl, Glicemia: 90mg/dl, TSH: 2.5
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Medidas Corporais */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Medidas corporais detalhadas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cintura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cintura (cm)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.5"
                      placeholder="80.0" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quadril"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quadril (cm)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.5"
                      placeholder="95.0" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="braco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Braço (cm)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.5"
                      placeholder="30.0" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coxa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coxa (cm)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.5"
                      placeholder="55.0" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Observações Adicionais */}
        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações adicionais</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Qualquer informação adicional que considere importante para seu plano..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <p className="text-sm text-gray-600">
                Exemplo: Preferências específicas, limitações não mencionadas, objetivos especiais, etc.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Informação sobre dados opcionais */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">📊 Dados Opcionais</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Todos os campos desta etapa são opcionais. Quanto mais informações você fornecer,
            mais preciso e personalizado será seu plano de emagrecimento.
          </p>
        </div>

        {/* Resumo final */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">
            Parabéns! Você está quase terminando!
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300">
            Após finalizar, processaremos todas as suas informações e criaremos um plano
            personalizado completo com treinos, dieta e acompanhamento.
          </p>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between pt-6">
          {canGoBack && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onPrevious}
              className="flex items-center gap-2 h-12 px-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>
          )}
          <Button
            type="submit"
            variant="default"
            className="flex items-center gap-2 h-12 px-8 ml-auto bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {isLastStep ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Finalizar e Gerar Plano
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

