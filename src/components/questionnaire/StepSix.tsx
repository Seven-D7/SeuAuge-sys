import React, { useEffect } from 'react';
import { StepProps } from './types';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { ArrowLeft, ArrowRight, Target, Heart, Users } from 'lucide-react';

export default function StepSix({ form, onNext, onPrevious, canGoBack, defaultValues }: StepProps) {
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
        {/* Principal Motivação */}
        <FormField
          control={form.control}
          name="motivacao_principal"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-red-500" />
                Principal motivação para emagrecer *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="saude" id="motiv-saude" />
                    <div className="flex-1">
                      <Label htmlFor="motiv-saude" className="cursor-pointer font-medium">
                        ❤️ Melhorar a saúde
                      </Label>
                      <p className="text-sm text-gray-600">Prevenir doenças e ter mais disposição</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="estetica" id="motiv-estetica" />
                    <div className="flex-1">
                      <Label htmlFor="motiv-estetica" className="cursor-pointer font-medium">
                        ✨ Questões estéticas
                      </Label>
                      <p className="text-sm text-gray-600">Melhorar a aparência física</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="autoestima" id="motiv-autoestima" />
                    <div className="flex-1">
                      <Label htmlFor="motiv-autoestima" className="cursor-pointer font-medium">
                        💪 Aumentar autoestima
                      </Label>
                      <p className="text-sm text-gray-600">Sentir-se mais confiante</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="performance" id="motiv-performance" />
                    <div className="flex-1">
                      <Label htmlFor="motiv-performance" className="cursor-pointer font-medium">
                        🏃 Melhorar performance física
                      </Label>
                      <p className="text-sm text-gray-600">Ter mais energia e resistência</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="medica" id="motiv-medica" />
                    <div className="flex-1">
                      <Label htmlFor="motiv-medica" className="cursor-pointer font-medium">
                        🩺 Recomendação médica
                      </Label>
                      <p className="text-sm text-gray-600">Orientação profissional de saúde</p>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tentativas Anteriores */}
        <FormField
          control={form.control}
          name="tentativas_anteriores"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold">
                Tentativas anteriores de emagrecimento *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="primeira" id="tent-primeira" />
                    <Label htmlFor="tent-primeira" className="cursor-pointer">
                      🆕 Esta é minha primeira tentativa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="algumas" id="tent-algumas" />
                    <Label htmlFor="tent-algumas" className="cursor-pointer">
                      🔄 Já tentei algumas vezes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="muitas" id="tent-muitas" />
                    <Label htmlFor="tent-muitas" className="cursor-pointer">
                      🔁 Já tentei muitas vezes
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Maior Dificuldade */}
        <FormField
          control={form.control}
          name="maior_dificuldade"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold">
                Maior dificuldade enfrentada *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="tempo" id="dif-tempo" />
                    <Label htmlFor="dif-tempo" className="cursor-pointer">
                      ⏰ Falta de tempo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="motivacao" id="dif-motivacao" />
                    <Label htmlFor="dif-motivacao" className="cursor-pointer">
                      😴 Falta de motivação
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="conhecimento" id="dif-conhecimento" />
                    <Label htmlFor="dif-conhecimento" className="cursor-pointer">
                      📚 Falta de conhecimento
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="disciplina" id="dif-disciplina" />
                    <Label htmlFor="dif-disciplina" className="cursor-pointer">
                      🎯 Falta de disciplina
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="resultados" id="dif-resultados" />
                    <Label htmlFor="dif-resultados" className="cursor-pointer">
                      📈 Resultados lentos
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Suporte Social */}
        <FormField
          control={form.control}
          name="suporte_social"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Suporte familiar/social *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="muito" id="sup-muito" />
                    <Label htmlFor="sup-muito" className="cursor-pointer">
                      👨‍👩‍👧‍👦 Muito apoio da família/amigos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="moderado" id="sup-moderado" />
                    <Label htmlFor="sup-moderado" className="cursor-pointer">
                      👥 Apoio moderado
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="pouco" id="sup-pouco" />
                    <Label htmlFor="sup-pouco" className="cursor-pointer">
                      👤 Pouco apoio
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="nenhum" id="sup-nenhum" />
                    <Label htmlFor="sup-nenhum" className="cursor-pointer">
                      🚶 Nenhum apoio
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expectativas Realistas */}
        <FormField
          control={form.control}
          name="expectativas_realistas"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold">
                Suas expectativas são realistas? *
              </FormLabel>
              <p className="text-sm text-gray-600">
                Perda saudável: 0,5-1kg por semana
              </p>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="sim" id="exp-sim" />
                    <Label htmlFor="exp-sim" className="cursor-pointer">
                      ✅ Sim, tenho expectativas realistas
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="nao" id="exp-nao" />
                    <Label htmlFor="exp-nao" className="cursor-pointer">
                      ⚡ Não, quero resultados rápidos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700">
                    <RadioGroupItem value="nao_sei" id="exp-nao-sei" />
                    <Label htmlFor="exp-nao-sei" className="cursor-pointer">
                      🤔 Não sei, preciso de orientação
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mensagem motivacional */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2">🎯 Foco no Objetivo</h4>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Entender sua motivação e desafios nos ajuda a criar um plano que realmente funciona para você.
            Lembre-se: pequenos passos consistentes levam a grandes transformações!
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

