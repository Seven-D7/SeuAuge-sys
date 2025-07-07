import React, { useEffect } from 'react';
import { StepProps } from './types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react';

const condicoesMedicas = [
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'hipertensao', label: 'Hipertensão' },
  { id: 'colesterol', label: 'Colesterol alto' },
  { id: 'tireoide', label: 'Problemas de tireoide' },
  { id: 'nenhuma', label: 'Nenhuma' },
];

export default function StepTwo({ form, onNext, onPrevious, canGoBack, defaultValues }: StepProps) {
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
        {/* Condições Médicas */}
        <FormField
          control={form.control}
          name="condicoes_medicas"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2 dark:text-gray-200">
                <Heart className="w-5 h-5 text-red-500" />
                Possui alguma condição médica? *
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {condicoesMedicas.map((condicao) => (
                  <FormField
                    key={condicao.id}
                    control={form.control}
                    name="condicoes_medicas"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={condicao.id}
                          className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(condicao.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (condicao.id === 'nenhuma') {
                                  // Se "nenhuma" for selecionada, limpar outras opções
                                  return field.onChange(checked ? ['nenhuma'] : []);
                                } else {
                                  // Se outra opção for selecionada, remover "nenhuma"
                                  const filteredValue = currentValue.filter(v => v !== 'nenhuma');
                                  return checked
                                    ? field.onChange([...filteredValue, condicao.id])
                                    : field.onChange(filteredValue.filter((value) => value !== condicao.id));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {condicao.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Medicamentos */}
        <FormField
          control={form.control}
          name="medicamentos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicamentos em uso</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Liste os medicamentos que você usa regularmente (opcional)"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Histórico de Lesões */}
        <FormField
          control={form.control}
          name="lesoes"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold dark:text-gray-200">Histórico de lesões? *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="nenhuma" id="lesoes-nenhuma" />
                    <Label htmlFor="lesoes-nenhuma" className="cursor-pointer">
                      Nenhuma lesão
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="leves" id="lesoes-leves" />
                    <Label htmlFor="lesoes-leves" className="cursor-pointer">
                      Lesões leves (já recuperadas)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="atual" id="lesoes-atual" />
                    <Label htmlFor="lesoes-atual" className="cursor-pointer">
                      Lesão atual ou limitação
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Detalhes sobre lesões */}
        <FormField
          control={form.control}
          name="detalhes_lesoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalhes sobre lesões (se houver)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva suas lesões ou limitações físicas (opcional)"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Acompanhamento Médico */}
        <FormField
          control={form.control}
          name="acompanhamento_medico"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold dark:text-gray-200">Acompanhamento médico atual? *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="regular" id="acomp-regular" />
                    <Label htmlFor="acomp-regular" className="cursor-pointer">
                      Sim, tenho acompanhamento regular
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="esporadico" id="acomp-esporadico" />
                    <Label htmlFor="acomp-esporadico" className="cursor-pointer">
                      Esporádico
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="nenhum" id="acomp-nenhum" />
                    <Label htmlFor="acomp-nenhum" className="cursor-pointer">
                      Não tenho acompanhamento
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Informação importante */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
          <h4 className="font-medium text-amber-900 dark:text-amber-200 mb-2">⚠️ Importante</h4>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Se você tem alguma condição médica ou lesão, recomendamos consultar um profissional de saúde antes de iniciar qualquer programa de exercícios.
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
            size="sm"
            className="flex items-center gap-2 h-12 px-8 ml-auto"
          >
            Próximo
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

