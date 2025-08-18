import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  RefreshCw,
  AlertTriangle,
  Users,
  Target
} from 'lucide-react';
import { 
  UserExperienceTestRunner, 
  runQuickTest, 
  validateSystemIntegrity,
  generateTestReport,
  TEST_SCENARIOS,
  TestSummary,
  TestResult
} from '../../utils/testHelpers';

const TestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResults, setLastResults] = useState<TestSummary | null>(null);
  const [systemIntegrity, setSystemIntegrity] = useState<{isValid: boolean; issues: string[]} | null>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const results = await runQuickTest();
      setLastResults(results);
    } catch (error) {
      console.error('Erro ao executar testes:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleValidateIntegrity = async () => {
    try {
      const integrity = await validateSystemIntegrity();
      setSystemIntegrity(integrity);
    } catch (error) {
      console.error('Erro ao validar integridade:', error);
    }
  };

  const handleDownloadReport = () => {
    if (!lastResults) return;

    const report = generateTestReport(lastResults);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-testes-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusBadge = (passed: boolean) => {
    return (
      <Badge variant={passed ? "default" : "destructive"}>
        {passed ? 'PASSOU' : 'FALHOU'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testes de Experiência do Usuário</h1>
          <p className="text-gray-600">Validação completa dos fluxos do sistema</p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleValidateIntegrity}
            variant="outline"
            size="sm"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Validar Integridade
          </Button>
          
          <Button
            onClick={handleRunTests}
            disabled={isRunning}
            className="bg-primary hover:bg-primary-dark"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Executar Testes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* System Integrity Card */}
      {systemIntegrity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Integridade do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              {getStatusIcon(systemIntegrity.isValid)}
              <span className="font-medium">
                {systemIntegrity.isValid ? 'Sistema íntegro' : 'Problemas detectados'}
              </span>
            </div>
            
            {systemIntegrity.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-700">Problemas encontrados:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {systemIntegrity.issues.map((issue, index) => (
                    <li key={index} className="text-sm text-red-600">{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Test Scenarios Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Cenários de Teste
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEST_SCENARIOS.map((scenario, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-gray-900">{scenario.name}</h3>
                <p className="text-sm text-gray-600">{scenario.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  {scenario.user.name} ({scenario.user.plan || 'Gratuito'})
                </div>
                <div className="text-xs text-gray-500">
                  {scenario.actions.length} ações • {scenario.expectedResults.length} validações
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {lastResults && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Resultados dos Testes
            </CardTitle>
            
            <Button
              onClick={handleDownloadReport}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{lastResults.totalTests}</div>
                <div className="text-sm text-gray-600">Total de Testes</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{lastResults.passedTests}</div>
                <div className="text-sm text-gray-600">Passaram</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{lastResults.failedTests}</div>
                <div className="text-sm text-gray-600">Falharam</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {lastResults.successRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Taxa de Sucesso</div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detalhes dos Testes</h3>
              
              {lastResults.results.map((result, index) => (
                <Card key={index} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{result.scenarioName}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.passed)}
                        {getStatusBadge(result.passed)}
                      </div>
                    </div>
                    {result.error && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        <strong>Erro:</strong> {result.error}
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      {result.details.map((detail, detailIndex) => (
                        <div 
                          key={detailIndex}
                          className="flex items-start gap-2 text-sm"
                        >
                          {detail.success ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{detail.actionDescription}</div>
                            <div className="text-gray-600">{detail.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Como Usar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600">
            <p><strong>Validar Integridade:</strong> Verifica se todos os sistemas estão funcionando corretamente.</p>
            <p><strong>Executar Testes:</strong> Roda uma suite completa de testes simulando diferentes usuários e cenários.</p>
            <p><strong>Baixar Relatório:</strong> Gera um relatório detalhado em formato Markdown dos resultados.</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Dica:</strong> Execute os testes regularmente para garantir que todas as funcionalidades 
              estão funcionando corretamente após atualizações.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestRunner;
