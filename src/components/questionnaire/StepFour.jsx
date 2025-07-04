import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { ArrowLeft, ArrowRight, Dumbbell, Home, Building } from 'lucide-react';

const tiposExercicio = [
  { id: 'musculacao', label: 'Musculação', icon: '🏋️' },
  { id: 'cardio', label: 'Cardio (corrida, bike)', icon: '🏃' },
  { id: 'funcional', label: 'Treino funcional', icon: '🤸' },
  { id: 'yoga', label: 'Yoga/Pilates', icon: '🧘' },
  { id: 'natacao', label: 'Natação', icon: '🏊' },
  { id: 'esportes', label: 'Esportes', icon: '⚽' },
];

const equipamentos = [
  { id: 'academia', label: 'Acesso à academia', icon: '🏢' },
  { id: 'halteres', label: 'Halteres em casa', icon: '🏋️' },
  { id: 'elasticos', label: 'Elásticos/faixas', icon: '🎯' },
  { id: 'peso_corporal', label: 'Apenas peso corporal', icon: '💪' },
];

export default function StepFour({ form, onNext, onPrevious, canGoBack, defaultValues }) {
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
        {/* Nível Atual de Atividade */}
        <FormField
          control={form.control}
          name="nivel_atividade"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-blue-500" />
                Nível atual de atividade física *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="sedentario" id="nivel-sedentario" />
                    <div className="flex-1">
                      <Label htmlFor="nivel-sedentario" className="cursor-pointer font-medium">
                        Sedentário (não pratico exercícios)
                      </Label>
                      <p className="text-sm text-gray-600">Pouca ou nenhuma atividade física</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="iniciante" id="nivel-iniciante" />
                    <div className="flex-1">
                      <Label htmlFor="nivel-iniciante" className="cursor-pointer font-medium">
                        Iniciante (1-2x por semana)
                      </Label>
                      <p className="text-sm text-gray-600">Exercícios leves e esporádicos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="intermediario" id="nivel-intermediario" />
                    <div className="flex-1">
                      <Label htmlFor="nivel-intermediario" className="cursor-pointer font-medium">
                        Intermediário (3-4x por semana)
                      </Label>
                      <p className="text-sm text-gray-600">Exercícios regulares e moderados</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="avancado" id="nivel-avancado" />
                    <div className="flex-1">
                      <Label htmlFor="nivel-avancado" className="cursor-pointer font-medium">
                        Avançado (5+ vezes por semana)
                      </Label>
                      <p className="text-sm text-gray-600">Exercícios intensos e frequentes</p>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipos de Exercício Preferidos */}
        <FormField
          control={form.control}
          name="tipos_exercicio"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Tipos de exercício preferidos *
              </FormLabel>
              <p className="text-sm text-gray-600 mb-3">Selecione todos que você gosta ou tem interesse</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tiposExercicio.map((tipo) => (
                  <FormField
                    key={tipo.id}
                    control={form.control}
                    name="tipos_exercicio"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={tipo.id}
                          className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(tipo.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                return checked
                                  ? field.onChange([...currentValue, tipo.id])
                                  : field.onChange(currentValue.filter((value) => value !== tipo.id));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                            <span className="text-lg">{tipo.icon}</span>
                            {tipo.label}
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

        {/* Experiência com Academia */}
        <FormField
          control={form.control}
          name="experiencia_academia"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Building className="w-5 h-5 text-green-500" />
                Experiência com academia *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="nunca" id="exp-nunca" />
                    <Label htmlFor="exp-nunca" className="cursor-pointer">
                      Nunca frequentei
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="pouca" id="exp-pouca" />
                    <Label htmlFor="exp-pouca" className="cursor-pointer">
                      Pouca experiência
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="moderada" id="exp-moderada" />
                    <Label htmlFor="exp-moderada" className="cursor-pointer">
                      Experiência moderada
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="muita" id="exp-muita" />
                    <Label htmlFor="exp-muita" className="cursor-pointer">
                      Muita experiência
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Equipamentos Disponíveis */}
        <FormField
          control={form.control}
          name="equipamentos"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Equipamentos disponíveis *
              </FormLabel>
              <p className="text-sm text-gray-600 mb-3">Selecione todos que você tem acesso</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {equipamentos.map((equipamento) => (
                  <FormField
                    key={equipamento.id}
                    control={form.control}
                    name="equipamentos"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={equipamento.id}
                          className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(equipamento.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                return checked
                                  ? field.onChange([...currentValue, equipamento.id])
                                  : field.onChange(currentValue.filter((value) => value !== equipamento.id));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                            <span className="text-lg">{equipamento.icon}</span>
                            {equipamento.label}
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

        {/* Local Preferido */}
        <FormField
          control={form.control}
          name="local_preferido"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Home className="w-5 h-5 text-purple-500" />
                Local preferido para exercitar-se *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="casa" id="local-casa" />
                    <Label htmlFor="local-casa" className="cursor-pointer">
                      🏠 Em casa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="academia" id="local-academia" />
                    <Label htmlFor="local-academia" className="cursor-pointer">
                      🏢 Academia
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="ar_livre" id="local-ar-livre" />
                    <Label htmlFor="local-ar-livre" className="cursor-pointer">
                      🌳 Ao ar livre
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="combinacao" id="local-combinacao" />
                    <Label htmlFor="local-combinacao" className="cursor-pointer">
                      🔄 Combinação
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dica sobre exercícios */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">💪 Dica de Treino</h4>
          <p className="text-sm text-blue-700">
            Não se preocupe se você é iniciante! Nosso plano será adaptado ao seu nível atual e 
            evoluirá gradualmente conforme você progride.
          </p>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between pt-6">
          {canGoBack && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onPrevious}
              className="flex items-center gap-2 h-12 px-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>
          )}
          <Button 
            type="submit" 
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

