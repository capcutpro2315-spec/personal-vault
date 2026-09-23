import React from 'react';
import { AlertTriangle, Clock, Calendar, ChevronRight, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DocumentItem } from '../../types';

interface ExpiringDocsProps {
  onViewDoc: (docName: string) => void;
}

export const ExpiringDocs: React.FC<ExpiringDocsProps> = ({ onViewDoc }) => {
  const expiringItems = [
    {
      name: 'Health Insurance Policy',
      category: 'Insurance',
      expiryText: 'Expires in 32 days',
      urgency: 'high',
      badgeColor: 'orange',
    },
    {
      name: 'PAN Card',
      category: 'Identity',
      expiryText: 'Expires in 8 months',
      urgency: 'medium',
      badgeColor: 'violet',
    },
    {
      name: 'Passport',
      category: 'Identity',
      expiryText: 'Expires in 2 years',
      urgency: 'low',
      badgeColor: 'cyan',
    },
  ];

  return (
    <Card glowColor="orange" className="p-6">
      <CardHeader className="mb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-bold font-display text-white">
            <AlertTriangle className="text-[#FF7A50]" size={20} /> Attention Required — Document Expiries
          </CardTitle>
          <CardDescription>Documents requiring verification or renewal</CardDescription>
        </div>
        <Badge variant="orange" size="sm">
          3 Items Near Expiry
        </Badge>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {expiringItems.map((item) => (
          <div
            key={item.name}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant={item.badgeColor as any} size="sm">
                  {item.category}
                </Badge>
                <span className="text-[10px] font-mono text-yellow-400 font-bold flex items-center gap-1">
                  <Clock size={10} /> {item.expiryText}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">{item.name}</h4>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4 text-xs"
              onClick={() => onViewDoc(item.name)}
              rightIcon={<ChevronRight size={14} />}
            >
              View Document
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
