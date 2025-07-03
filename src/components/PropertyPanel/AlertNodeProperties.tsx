import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MessageCircle, MessageSquare } from 'lucide-react';
import type { AlertNodeData, NodeData } from '../../types/nodes';

interface AlertNodePropertiesProps {
  data: NodeData;
  onUpdate: (updates: Partial<NodeData>) => void;
}

export const AlertNodeProperties: React.FC<AlertNodePropertiesProps> = ({ data, onUpdate }) => {
  const alertData = data as AlertNodeData;

  const renderTelegramProperties = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Bot Token</Label>
        <Input
          type="text"
          placeholder="Enter your Telegram bot token"
          value={alertData.botToken || ''}
          onChange={(e) => onUpdate({ botToken: e.target.value })}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Get from @BotFather on Telegram
        </p>
      </div>

      <div>
        <Label className="text-sm font-medium">Chat ID</Label>
        <Input
          type="text"
          placeholder="Enter chat ID or @username"
          value={alertData.chatId || ''}
          onChange={(e) => onUpdate({ chatId: e.target.value })}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use @userinfobot to get your chat ID
        </p>
      </div>
    </div>
  );

  const renderDiscordProperties = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Webhook URL</Label>
        <Input
          type="text"
          placeholder="Enter Discord webhook URL"
          value={alertData.webhookUrl || ''}
          onChange={(e) => onUpdate({ webhookUrl: e.target.value })}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Create webhook in Discord server settings
        </p>
      </div>
    </div>
  );

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Platform-specific configuration */}
          {alertData.alertType === 'telegram' && renderTelegramProperties()}
          {alertData.alertType === 'discord' && renderDiscordProperties()}

          {/* Common configuration */}
          <div>
            <Label className="text-sm font-medium">Message Template</Label>
            <Textarea
              placeholder="Enter your alert message..."
              value={alertData.message || ''}
              onChange={(e) => onUpdate({ message: e.target.value })}
              className="mt-1"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use variables: {'{status}'}, {'{amount}'}, {'{asset}'}, {'{error}'}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Trigger Condition</Label>
            <Select 
              value={alertData.triggerCondition || 'success'} 
              onValueChange={(value: 'success' | 'failure' | 'always') => onUpdate({ triggerCondition: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success">On Success</SelectItem>
                <SelectItem value="failure">On Failure</SelectItem>
                <SelectItem value="always">Always</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Message Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted rounded-lg text-sm">
            {alertData.message || 'Enter a message template above to see preview...'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};