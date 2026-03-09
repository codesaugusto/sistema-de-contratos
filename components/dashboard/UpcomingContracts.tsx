'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Contract } from '@/types/contract';
import { Calendar, AlertCircle } from 'lucide-react';

interface UpcomingContractsProps {
  contracts: Contract[];
}

export function UpcomingContracts({ contracts }: UpcomingContractsProps) {
  const today = new Date();
  const upcoming = contracts
    .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())
    .slice(0, 5);

  const getDaysUntilExpire = (dateString: string) => {
    const date = new Date(dateString);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'expirando':
        return 'bg-yellow-100 text-yellow-800';
      case 'vencido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'expirando':
        return 'Expirando';
      case 'vencido':
        return 'Vencido';
      default:
        return status;
    }
  };

  if (upcoming.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Próximos Vencimentos</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum contrato registrado</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5" />
        <h3 className="font-semibold">Próximos Vencimentos</h3>
      </div>

      <div className="space-y-3">
        {upcoming.map((contract) => {
          const daysLeft = getDaysUntilExpire(contract.dataVencimento);
          const isUrgent = daysLeft <= 15 && daysLeft >= 0;
          const isOverdue = daysLeft < 0;

          return (
            <div
              key={contract.id}
              className={`p-3 rounded-lg border ${
                isOverdue ? 'bg-red-50 border-red-200' : isUrgent ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{contract.empresa}</p>
                  <p className="text-xs text-muted-foreground">{contract.motorista}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(contract.status)}>
                      {getStatusLabel(contract.status)}
                    </Badge>
                    {(isUrgent || isOverdue) && (
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {isOverdue ? 'Vencido há' : 'Vence em'} {Math.abs(daysLeft)} dia{Math.abs(daysLeft) !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold">
                    R$ {contract.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(contract.dataVencimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
