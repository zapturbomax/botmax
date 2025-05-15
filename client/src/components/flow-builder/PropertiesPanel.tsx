import { useState, useEffect } from 'react';
import { ChevronRight, X, ArrowUp, ArrowDown, Trash, Plus } from 'lucide-react';
import { useFlowBuilder } from '@/hooks/use-flow-builder';
import { FlowNode } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { nodeTypes } from './FlowNodeTypes';

interface PropertiesPanelProps {
  node: FlowNode;
  onClose: () => void;
  open: boolean;
  onToggle: () => void;
}

const PropertiesPanel = ({ node, onClose, open, onToggle }: PropertiesPanelProps) => {
  const { updateNodeData } = useFlowBuilder();
  const [localData, setLocalData] = useState<Record<string, any>>(node.data || {});
  
  // Find the node type configuration
  const nodeType = nodeTypes.find(type => type.type === node.type);
  
  // When the node changes, update the local data
  useEffect(() => {
    setLocalData(node.data || {});
  }, [node]);
  
  const handleChange = (key: string, value: any) => {
    setLocalData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleApplyChanges = () => {
    updateNodeData(node.id, localData);
  };
  
  const handleAddButton = () => {
    const buttons = [...(localData.buttons || [])];
    buttons.push({
      id: `button-${Date.now()}`,
      title: `Button ${buttons.length + 1}`,
      payload: `BUTTON_${buttons.length + 1}`,
    });
    handleChange('buttons', buttons);
  };
  
  const handleButtonChange = (index: number, key: string, value: string) => {
    const buttons = [...(localData.buttons || [])];
    buttons[index] = { ...buttons[index], [key]: value };
    handleChange('buttons', buttons);
  };
  
  const handleButtonMove = (index: number, direction: 'up' | 'down') => {
    const buttons = [...(localData.buttons || [])];
    if (direction === 'up' && index > 0) {
      [buttons[index - 1], buttons[index]] = [buttons[index], buttons[index - 1]];
    } else if (direction === 'down' && index < buttons.length - 1) {
      [buttons[index], buttons[index + 1]] = [buttons[index + 1], buttons[index]];
    }
    handleChange('buttons', buttons);
  };
  
  const handleButtonDelete = (index: number) => {
    const buttons = [...(localData.buttons || [])];
    buttons.splice(index, 1);
    handleChange('buttons', buttons);
  };

  // Render fields based on node type
  const renderFields = () => {
    if (!nodeType) return null;
    
    switch (node.type) {
      case 'startTrigger':
        return (
          <>
            <div className="space-y-3">
              <div>
                <Label>Trigger Type</Label>
                <Select 
                  value={localData.triggerType || 'firstMessage'} 
                  onValueChange={(value) => handleChange('triggerType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="firstMessage">First Message</SelectItem>
                    <SelectItem value="keyword">Keyword</SelectItem>
                    <SelectItem value="menuOption">Menu Option</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {localData.triggerType === 'keyword' && (
                <div>
                  <Label>Keyword (optional)</Label>
                  <Input 
                    value={localData.keyword || ''} 
                    onChange={(e) => handleChange('keyword', e.target.value)}
                    placeholder="e.g. start, help"
                  />
                </div>
              )}
            </div>
          </>
        );
      
      case 'textMessage':
        return (
          <>
            <div>
              <Label>Message Text</Label>
              <Textarea 
                value={localData.text || ''} 
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Enter your message here..."
                rows={3}
              />
            </div>
            <div>
              <Label>Variables</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange(
                    'text', 
                    (localData.text || '') + " {{first_name}}"
                  )}
                >
                  {"{{"+"first_name"+"}}"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange(
                    'text', 
                    (localData.text || '') + " {{last_name}}"
                  )}
                >
                  {"{{"+"last_name"+"}}"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange(
                    'text', 
                    (localData.text || '') + " {{phone}}"
                  )}
                >
                  {"{{"+"phone"+"}}"}
                </Button>
              </div>
            </div>
          </>
        );
      
      case 'mediaMessage':
        return (
          <>
            <div>
              <Label>Media Type</Label>
              <Select 
                value={localData.mediaType || 'image'} 
                onValueChange={(value) => handleChange('mediaType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Media URL</Label>
              <Input 
                value={localData.mediaUrl || ''} 
                onChange={(e) => handleChange('mediaUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label>Caption (Optional)</Label>
              <Textarea 
                value={localData.caption || ''} 
                onChange={(e) => handleChange('caption', e.target.value)}
                placeholder="Enter caption here..."
                rows={2}
              />
            </div>
          </>
        );
      
      case 'quickReplies':
        return (
          <>
            <div>
              <Label>Message Text</Label>
              <Textarea 
                value={localData.text || ''} 
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Enter your message here..."
                rows={2}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Buttons</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddButton} 
                  className="h-7 px-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {(localData.buttons || []).map((button: any, index: number) => (
                  <div key={button.id} className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-medium truncate flex-1">{button.title}</span>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleButtonMove(index, 'up')}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleButtonMove(index, 'down')}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-red-500" 
                        onClick={() => handleButtonDelete(index)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {(localData.buttons || []).length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Button Settings
                    </h4>
                    {(localData.buttons || []).map((button: any, index: number) => (
                      <div key={`settings-${button.id}`} className="mb-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                        <div className="p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
                          <span className="text-xs font-medium">Button {index + 1}</span>
                        </div>
                        <div className="p-2 space-y-2">
                          <div>
                            <Label className="text-xs">Button Text</Label>
                            <Input 
                              value={button.title} 
                              onChange={(e) => handleButtonChange(index, 'title', e.target.value)}
                              className="h-7 text-xs mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Payload Value</Label>
                            <Input 
                              value={button.payload} 
                              onChange={(e) => handleButtonChange(index, 'payload', e.target.value)}
                              className="h-7 text-xs mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        );
      
      case 'condition':
        return (
          <>
            <div>
              <Label>Condition</Label>
              <Textarea 
                value={localData.condition || ''} 
                onChange={(e) => handleChange('condition', e.target.value)}
                placeholder="{{variable}} === 'value'"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use JavaScript syntax. Example: <code>{"{{variable}} === 'value'"}</code>
              </p>
            </div>
          </>
        );
      
      case 'waitResponse':
        return (
          <>
            <div>
              <Label>Variable Name</Label>
              <Input 
                value={localData.variableName || ''} 
                onChange={(e) => handleChange('variableName', e.target.value)}
                placeholder="e.g. user_response"
              />
              <p className="text-xs text-gray-500 mt-1">
                The user's response will be stored in this variable
              </p>
            </div>
            <div>
              <Label>Timeout (hours)</Label>
              <div className="flex">
                <Input 
                  type="number" 
                  value={localData.timeoutHours || 24} 
                  onChange={(e) => handleChange('timeoutHours', parseInt(e.target.value))}
                  min={1}
                  max={72}
                />
              </div>
            </div>
          </>
        );
      
      case 'delay':
        return (
          <>
            <div>
              <Label>Delay Time</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Hours</Label>
                  <Input 
                    type="number" 
                    value={localData.delayHours || 0} 
                    onChange={(e) => handleChange('delayHours', parseInt(e.target.value))}
                    min={0}
                  />
                </div>
                <div>
                  <Label className="text-xs">Minutes</Label>
                  <Input 
                    type="number" 
                    value={localData.delayMinutes || 0} 
                    onChange={(e) => handleChange('delayMinutes', parseInt(e.target.value))}
                    min={0}
                    max={59}
                  />
                </div>
              </div>
            </div>
          </>
        );
      
      case 'httpRequest':
        return (
          <>
            <div>
              <Label>URL</Label>
              <Input 
                value={localData.url || ''} 
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div>
              <Label>Method</Label>
              <Select 
                value={localData.method || 'GET'} 
                onValueChange={(value) => handleChange('method', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Response Variable Name</Label>
              <Input 
                value={localData.responseVariable || ''} 
                onChange={(e) => handleChange('responseVariable', e.target.value)}
                placeholder="e.g. api_response"
              />
            </div>
          </>
        );
      
      case 'setVariable':
        return (
          <>
            <div>
              <Label>Variable Name</Label>
              <Input 
                value={localData.variableName || ''} 
                onChange={(e) => handleChange('variableName', e.target.value)}
                placeholder="e.g. user_name"
              />
            </div>
            <div>
              <Label>Value</Label>
              <Input 
                value={localData.value || ''} 
                onChange={(e) => handleChange('value', e.target.value)}
                placeholder="Value or {{another_variable}}"
              />
            </div>
          </>
        );
      
      case 'humanTransfer':
        return (
          <>
            <div>
              <Label>Message</Label>
              <Textarea 
                value={localData.message || ''} 
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Enter message to show before transfer..."
                rows={3}
              />
            </div>
            <div>
              <Label>Notification Email</Label>
              <Input 
                value={localData.notificationEmail || ''} 
                onChange={(e) => handleChange('notificationEmail', e.target.value)}
                placeholder="agent@example.com"
              />
            </div>
          </>
        );
      
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            No properties available for this node type
          </div>
        );
    }
  };
  
  return (
    <div className={`w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 ${open ? '' : 'w-0 border-l-0'}`}>
      {open && (
        <>
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Properties</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Node Information</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Node Name</Label>
                    <Input 
                      value={localData.name || ''} 
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Node name"
                    />
                  </div>
                  <div>
                    <Label>Node Description</Label>
                    <Input 
                      value={localData.description || ''} 
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Optional description"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {nodeType?.label || 'Node'} Settings
                </h4>
                <div className="space-y-3">
                  {renderFields()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              className="w-full" 
              onClick={handleApplyChanges}
            >
              Apply Changes
            </Button>
          </div>
        </>
      )}
      
      {!open && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle} 
          className="absolute top-1/2 -left-6 h-12 w-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-md shadow-md"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default PropertiesPanel;
