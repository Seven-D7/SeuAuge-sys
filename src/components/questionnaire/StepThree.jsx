import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Slider } from '../ui/slider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { ArrowLeft, ArrowRight, Clock, Moon, Zap } from 'lucide-react';

const horariosExercicio = [
  { id: 'manha', label: 'Manhã (6h-10h)' },
  { id: 'almoco', label: 'Almoço (11h-14h)' },
  { id: 'tarde', label: 'Tarde (15h-18h)' },
  { id: 'noite', label: 'Noite (19h-22h)' },
];

const habitosSociais = [
  { id: 'alcool_social', label: 'Álcool socialmente' },
  { id: 'alcool_regular', label: 'Álcool regularmente' },
  { id: 'fumante', label: 'Fumante' },
  { id: 'nenhum', label: 'Nenhum dos anteriores' },
];

export default function StepThree({ form, onNext, onPrevious, canGoBack, defaultValues }) {
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

  const stressValue = form.watch('nivel_stress') || [5];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Tipo de Trabalho */}
        <FormField
          control={form.control}
          name="tipo_trabalho"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Tipo de trabalho *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="sedentario" id="trabalho-sedentario" />
                    <div className="flex-1">
                      <Label htmlFor="trabalho-sedentario" className="cursor-pointer font-medium">
                        Sedentário (escritório, computador)
                      </Label>
                      <p className="text-sm text-gray-600">Maior parte do dia sentado</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="moderado" id="trabalho-moderado" />
                    <div className="flex-1">
                      <Label htmlFor="trabalho-moderado" className="cursor-pointer font-medium">
                        Moderadamente ativo
                      </Label>
                      <p className="text-sm text-gray-600">Algumas atividades em pé ou caminhando</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="ativo" id="trabalho-ativo" />
                    <div className="flex-1">
                      <Label htmlFor="trabalho-ativo" className="cursor-pointer font-medium">
                        Muito ativo (trabalho físico)
                      </Label>
                      <p className="text-sm text-gray-600">Trabalho que exige esforço físico</p>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Horários Disponíveis */}
        <FormField
          control={form.control}
          name="horarios_exercicio"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Horários disponíveis para exercício *
              </FormLabel>
              <p className="text-sm text-gray-600 mb-3">Selecione todos os horários que funcionam para você</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {horariosExercicio.map((horario) => (
                  <FormField
                    key={horario.id}
                    control={form.control}
                    name="horarios_exercicio"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={horario.id}
                          className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(horario.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                return checked
                                  ? field.onChange([...currentValue, horario.id])
                                  : field.onChange(currentValue.filter((value) => value !== horario.id));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {horario.label}
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

        {/* Nível de Stress */}
        <FormField
          control={form.control}
          name="nivel_stress"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Nível de stress (1-10) *
              </FormLabel>
              <div className="px-4">
                <FormControl>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={field.value || [5]}
                    onValueChange={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>1 (Baixo)</span>
                  <span className="font-medium text-lg text-blue-600">
                    {stressValue[0]}
                  </span>
                  <span>10 (Alto)</span>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Qualidade do Sono */}
        <FormField
          control={form.control}
          name="qualidade_sono"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Moon className="w-5 h-5 text-purple-500" />
                Qualidade do sono *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="excelente" id="sono-excelente" />
                    <Label htmlFor="sono-excelente" className="cursor-pointer">
                      Excelente (7-9h, sem interrupções)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="boa" id="sono-boa" />
                    <Label htmlFor="sono-boa" className="cursor-pointer">
                      Boa (6-8h, poucas interrupções)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="regular" id="sono-regular" />
                    <Label htmlFor="sono-regular" className="cursor-pointer">
                      Regular (5-7h, algumas interrupções)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="ruim" id="sono-ruim" />
                    <Label htmlFor="sono-ruim" className="cursor-pointer">
                      Ruim (menos de 5h, muitas interrupções)
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hábitos Sociais */}
        <FormField
          control={form.control}
          name="habitos_sociais"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Hábitos sociais</FormLabel>
              <p className="text-sm text-gray-600 mb-3">Selecione os que se aplicam (opcional)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {habitosSociais.map((habito) => (
                  <FormField
                    key={habito.id}
                    control={form.control}
                    name="habitos_sociais"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={habito.id}
                          className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(habito.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (habito.id === 'nenhum') {
                                  return field.onChange(checked ? ['nenhum'] : []);
                                } else {
                                  const filteredValue = currentValue.filter(v => v !== 'nenhum');
                                  return checked
                                    ? field.onChange([...filteredValue, habito.id])
                                    : field.onChange(filteredValue.filter((value) => value !== habito.id));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {habito.label}
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

        {/* Dica sobre estilo de vida */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">🌱 Dica de Bem-estar</h4>
          <p className="text-sm text-green-700">
            Um bom sono e gerenciamento do stress são fundamentais para o sucesso na perda de peso. 
            Nosso plano incluirá dicas específicas para seu estilo de vida.
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

