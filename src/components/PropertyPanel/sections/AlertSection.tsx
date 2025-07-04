// src/components/PropertyPanel/sections/AlertSection.tsx
import React from 'react';
import { FormRenderer } from '../components/FormRenderer';
import { alertConfigs } from '../configs/formConfigs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { 
  MessageCircle, 
  MessageSquare 
} from 'lucide-react';
import type { AlertNodeData, NodeData } from '../../../types/nodes';

interface AlertSectionProps {
  data: NodeData;
  onUpdate: (updates: Partial<NodeData>) => void;
}

export const AlertSection: React.FC<AlertSectionProps> = ({ 
  data, 
  onUpdate 
}) => {
  const alertData = data as AlertNodeData;
  const config = alertConfigs[alertData.alertType] || [];

  const getIcon = () => {
    switch (alertData.alertType) {
      case 'telegram': return <MessageCircle className="w-4 h-4" />;
      case 'discord': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getTitle = () => {
    switch (alertData.alertType) {
      case 'telegram': return 'Telegram Alert Configuration';
      case 'discord': return 'Discord Alert Configuration';
      default: return 'Alert Configuration';
    }
  };

  const getDescription = () => {
    switch (alertData.alertType) {
     case 'telegram': return 'Send notifications to Telegram';
     case 'discord': return 'Send notifications to Discord webhook';
     default: return 'Configure alert notifications';
   }
 };

 // Preview section for message template
 const renderPreview = () => {
   if (!alertData.message) return null;

   const previewMessage = alertData.message
     .replace('{status}', 'Success')
     .replace('{amount}', '1000')
     .replace('{asset}', 'USDC')
     .replace('{error}', 'N/A');

   return (
     <Card className="property-panel-section">
       <CardHeader className="pb-3">
         <CardTitle className="text-sm">Message Preview</CardTitle>
       </CardHeader>
       <CardContent>
         <div 
           className="p-3 rounded-lg text-sm font-mono"
           style={{ 
             backgroundColor: 'var(--property-panel-field-bg)',
             borderColor: 'var(--property-panel-border)',
             color: 'var(--property-panel-text)'
           }}
         >
           {previewMessage}
         </div>
       </CardContent>
     </Card>
   );
 };

 return (
   <div className="space-y-4">
     <Card className="property-panel-section">
       <CardHeader className="pb-3">
         <div className="flex items-center justify-between">
           <CardTitle className="text-sm flex items-center gap-2">
             <div 
               className="p-1.5 rounded-md"
               style={{ backgroundColor: 'var(--category-alert)' }}
             >
               {React.cloneElement(getIcon(), { className: "w-4 h-4 text-white" })}
             </div>
             <div className="flex flex-col">
               <span>{getTitle()}</span>
               <span 
                 className="text-xs font-normal"
                 style={{ color: 'var(--property-panel-text-muted)' }}
               >
                 {getDescription()}
               </span>
             </div>
           </CardTitle>
           <Badge 
             variant="outline" 
             className="category-badge-alert text-xs"
           >
             {alertData.alertType}
           </Badge>
         </div>
       </CardHeader>
       
       <Separator style={{ borderColor: 'var(--property-panel-border)' }} />
       
       <CardContent className="pt-4">
         <FormRenderer 
           fields={config} 
           data={data} 
           onUpdate={onUpdate}
         />
       </CardContent>
     </Card>
     
     {renderPreview()}
   </div>
 );
};