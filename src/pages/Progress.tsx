import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  Star,
  Target,
  Activity,
  BarChart3,
  Filter,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/SupabaseAuthContext";
import { useReportsStore, getReportTypeLabel, type FitnessReport } from "../stores/reportsStore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Progress: React.FC = () => {
  const { user } = useAuth();
  const { reports, getReportsByUser, setCurrentReport } = useReportsStore();
  const [selectedReport, setSelectedReport] = useState<FitnessReport | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const userReports = user ? getReportsByUser(user.uid) : [];

  const filteredReports = userReports.filter(report => {
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getReportTypeLabel(report.type).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const reportTypes = Array.from(new Set(userReports.map(r => r.type)));

  const handleViewReport = (report: FitnessReport) => {
    setSelectedReport(report);
    setCurrentReport(report);
  };

  const handleDownloadPDF = async (report: FitnessReport) => {
    // Implementação do download PDF será adicionada
    console.log('Download PDF:', report.id);
    alert('Funcionalidade de download PDF será implementada em breve!');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      emagrecimento: '🔥',
      ganho_massa: '💪',
      recomposicao: '🔄',
      performance: '⚡',
      flexibilidade: '🧘',
      corrida: '🏃‍♂️',
    };
    return icons[type] || '📊';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Meus Relatórios
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Acompanhe sua evolução e progresso através dos relatórios personalizados
        </p>
      </div>

      {/* Statistics */}
      {userReports.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {userReports.length}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Relatórios Totais
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {reportTypes.length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Modalidades
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {Math.round(userReports.reduce((acc, r) => acc + r.summary.score, 0) / userReports.length) || 0}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Score Médio
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {userReports.filter(r => r.summary.score >= 80).length}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Alta Performance
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      {userReports.length > 0 && (
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar relatórios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Todos
                </button>
                {reportTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterType === type
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {getTypeIcon(type)} {getReportTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      {userReports.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Nenhum relatório encontrado
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Complete um questionário nos aplicativos fitness para gerar seu primeiro relatório.
            </p>
            <Button
              onClick={() => window.location.href = '/apps'}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              Explorar Aplicativos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="border-0 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{getTypeIcon(report.type)}</div>
                  <Badge className={`${getScoreColor(report.summary.score)} bg-transparent border-current`}>
                    {report.summary.score} pts
                  </Badge>
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-white">
                  {getReportTypeLabel(report.type)}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(report.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Main Metrics Preview */}
                <div className="space-y-2 mb-4">
                  {report.summary.mainMetrics.slice(0, 3).map((metric, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{metric.label}:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {metric.value} {metric.unit}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Recommendations Preview */}
                {report.summary.recommendations.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Principais Recomendações:
                    </h4>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      • {report.summary.recommendations[0]}
                      {report.summary.recommendations.length > 1 && (
                        <span className="text-blue-500 ml-1">
                          +{report.summary.recommendations.length - 1} mais
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleViewReport(report)}
                    size="sm"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    onClick={() => handleDownloadPDF(report)}
                    size="sm"
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredReports.length === 0 && userReports.length > 0 && (
        <Card className="border-2 border-dashed border-slate-300 dark:border-slate-600">
          <CardContent className="p-8 text-center">
            <Filter className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Nenhum relatório encontrado
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Ajuste os filtros ou termos de busca para encontrar seus relatórios.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">
                    {getTypeIcon(selectedReport.type)} {getReportTypeLabel(selectedReport.type)}
                  </CardTitle>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {format(new Date(selectedReport.createdAt), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownloadPDF(selectedReport)}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    onClick={() => setSelectedReport(null)}
                    size="sm"
                    variant="outline"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Score and Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Score de Performance
                  </h3>
                  <div className={`text-3xl font-bold ${getScoreColor(selectedReport.summary.score)}`}>
                    {selectedReport.summary.score}/100
                  </div>
                </div>
                
                {selectedReport.data.explanation && (
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedReport.data.explanation.paragrafo}
                  </p>
                )}
              </div>

              {/* Main Metrics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Métricas Principais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedReport.summary.mainMetrics.map((metric, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {metric.label}
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {metric.value}
                        {metric.unit && <span className="text-lg text-slate-600 dark:text-slate-400 ml-1">{metric.unit}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {selectedReport.summary.recommendations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Recomendações Personalizadas
                  </h3>
                  <div className="space-y-3">
                    {selectedReport.summary.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">
                          {recommendation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              {selectedReport.data.explanation?.bullets && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Detalhes Adicionais
                  </h3>
                  <div className="space-y-2">
                    {selectedReport.data.explanation.bullets.map((bullet, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Progress;
