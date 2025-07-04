import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { ArrowLeft, ArrowRight, UtensilsCrossed, Droplets } from 'lucide-react';

const restricoes = [
  { id: 'lactose', label: 'Intolerância à lactose' },
  { id: 'gluten', label: 'Intolerância ao glúten' },
  { id: 'nozes', label: 'Alergia a nozes' },
  { id: 'frutos_mar', label: 'Alergia a frutos do mar' },
  { id: 'nenhuma', label: 'Nenhuma restrição' },
];

const habitosAlimentares = [
  { id: 'cozinho_casa', label: 'Cozinho em casa regularmente' },
  { id: 'delivery', label: 'Peço delivery frequentemente' },
  { id: 'como_fora', label: 'Como fora regularmente' },
  { id: 'fast_food', label: 'Fast food ocasionalmente' },
];

export default function StepFive({ form, onNext, onPrevious, canGoBack, defaultValues }) {
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
        {/* Preferências Alimentares */}
        <FormField
          control={form.control}
          name="preferencias_alimentares"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-green-500" />
                Preferências alimentares *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="onivoro" id="pref-onivoro" />
                    <Label htmlFor="pref-onivoro" className="cursor-pointer">
                      🍖 Onívoro (como de tudo)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="vegetariano" id="pref-vegetariano" />
                    <Label htmlFor="pref-vegetariano" className="cursor-pointer">
                      🥬 Vegetariano
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="vegano" id="pref-vegano" />
                    <Label htmlFor="pref-vegano" className="cursor-pointer">
                      🌱 Vegano
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="pescetariano" id="pref-pescetariano" />
                    <Label htmlFor="pref-pescetariano" className="cursor-pointer">
                      🐟 Pescetariano
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Restrições e Alergias */}
        <FormField
          control={form.control}
          name="restricoes"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Restrições e alergias
              </FormLabel>
              <p className="text-sm text-gray-600 mb-3">Selecione todas que se aplicam</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {restricoes.map((restricao) => (
                  <FormField
                    key={restricao.id}
                    control={form.control}
                    name="restricoes"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={restricao.id}
                          className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(restricao.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (restricao.id === 'nenhuma') {
                                  return field.onChange(checked ? ['nenhuma'] : []);
                                } else {
                                  const filteredValue = currentValue.filter(v => v !== 'nenhuma');
                                  return checked
                                    ? field.onChange([...filteredValue, restricao.id])
                                    : field.onChange(filteredValue.filter((value) => value !== restricao.id));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {restricao.label}
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

        {/* Número de Refeições */}
        <FormField
          control={form.control}
          name="refeicoes_dia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantas refeições faz por dia? *</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min="2"
                  max="8"
                  placeholder="3" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                  className="h-12 max-w-xs"
                />
              </FormControl>
              <p className="text-sm text-gray-600">Incluindo lanches principais</p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hábitos Alimentares */}
        <FormField
          control={form.control}
          name="habitos_alimentares"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Hábitos alimentares atuais *
              </FormLabel>
              <p className="text-sm text-gray-600 mb-3">Selecione todos que se aplicam</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {habitosAlimentares.map((habito) => (
                  <FormField
                    key={habito.id}
                    control={form.control}
                    name="habitos_alimentares"
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
                                return checked
                                  ? field.onChange([...currentValue, habito.id])
                                  : field.onChange(currentValue.filter((value) => value !== habito.id));
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

        {/* Orçamento para Alimentação */}
        <FormField
          control={form.control}
          name="orcamento_alimentacao"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-semibold">
                Orçamento mensal para alimentação *
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="baixo" id="orc-baixo" />
                    <div className="flex-1">
                      <Label htmlFor="orc-baixo" className="cursor-pointer font-medium">
                        💰 Baixo (até R$ 400)
                      </Label>
                      <p className="text-sm text-gray-600">Foco em alimentos básicos e econômicos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="medio" id="orc-medio" />
                    <div className="flex-1">
                      <Label htmlFor="orc-medio" className="cursor-pointer font-medium">
                        💰💰 Médio (R$ 400 - R$ 800)
                      </Label>
                      <p className="text-sm text-gray-600">Variedade moderada de alimentos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="alto" id="orc-alto" />
                    <div className="flex-1">
                      <Label htmlFor="orc-alto" className="cursor-pointer font-medium">
                        💰💰💰 Alto (acima de R$ 800)
                      </Label>
                      <p className="text-sm text-gray-600">Ampla variedade e alimentos premium</p>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Consumo de Água */}
        <FormField
          control={form.control}
          name="agua_dia"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                Quantos litros de água bebe por dia? *
              </FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  placeholder="2.0" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                  className="h-12 max-w-xs"
                />
              </FormControl>
              <p className="text-sm text-gray-600">Recomendado: 2-3 litros por dia</p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dica nutricional */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">🥗 Dica Nutricional</h4>
          <p className="text-sm text-green-700">
            Uma alimentação equilibrada é 70% do sucesso na perda de peso. Nosso plano será 
            personalizado considerando suas preferências e restrições.
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

