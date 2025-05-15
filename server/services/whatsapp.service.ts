import axios from 'axios';
import { storage } from '../storage';
import { Flow, FlowNode, FlowEdge } from '@shared/schema';

// Interface for WhatsApp message
interface WhatsAppMessage {
  to: string;
  type: 'text' | 'image' | 'video' | 'document' | 'audio' | 'interactive';
  text?: {
    body: string;
  };
  image?: {
    link: string;
  };
  video?: {
    link: string;
  };
  document?: {
    link: string;
  };
  audio?: {
    link: string;
  };
  interactive?: any; // For buttons, lists, etc.
}

// Service for interacting with WhatsApp API
export class WhatsAppService {
  private apiUrl: string;
  private apiKey: string;
  private apiSecret: string;
  private phoneNumber: string;
  
  constructor(integration: { apiKey: string; apiSecret: string; phoneNumber: string }) {
    this.apiUrl = 'https://graph.facebook.com/v17.0';
    this.apiKey = integration.apiKey;
    this.apiSecret = integration.apiSecret;
    this.phoneNumber = integration.phoneNumber;
  }
  
  async sendMessage(message: WhatsAppMessage) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumber}/messages`,
        message,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }
  
  async sendTextMessage(to: string, body: string) {
    const message: WhatsAppMessage = {
      to,
      type: 'text',
      text: { body },
    };
    
    return this.sendMessage(message);
  }
  
  async sendImageMessage(to: string, imageUrl: string) {
    const message: WhatsAppMessage = {
      to,
      type: 'image',
      image: { link: imageUrl },
    };
    
    return this.sendMessage(message);
  }
  
  async sendQuickReplyButtons(to: string, bodyText: string, buttons: { id: string; title: string }[]) {
    const message: WhatsAppMessage = {
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: bodyText },
        action: {
          buttons: buttons.map(button => ({
            type: 'reply',
            reply: {
              id: button.id,
              title: button.title,
            },
          })),
        },
      },
    };
    
    return this.sendMessage(message);
  }
  
  async sendListMessage(to: string, bodyText: string, buttonText: string, sections: { title: string; rows: { id: string; title: string; description?: string }[] }[]) {
    const message: WhatsAppMessage = {
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: { text: bodyText },
        action: {
          button: buttonText,
          sections,
        },
      },
    };
    
    return this.sendMessage(message);
  }
}

// Flow execution service
export class FlowExecutionService {
  private flow: Flow;
  private whatsAppService?: WhatsAppService;
  private currentNodeId?: string;
  private variables: Record<string, string> = {};
  
  constructor(flow: Flow, whatsAppIntegration?: { apiKey: string; apiSecret: string; phoneNumber: string }) {
    this.flow = flow;
    
    if (whatsAppIntegration) {
      this.whatsAppService = new WhatsAppService(whatsAppIntegration);
    }
  }
  
  async executeFlow(contactPhoneNumber: string, initialMessage?: string) {
    if (!this.whatsAppService) {
      throw new Error('WhatsApp integration is required to execute a flow');
    }
    
    // Find the start node
    const startNode = this.flow.nodes.find(node => node.type === 'startTrigger');
    if (!startNode) {
      throw new Error('Flow has no start node');
    }
    
    this.currentNodeId = startNode.id;
    
    // Store contact information in variables
    try {
      const contact = await storage.getContactByPhoneNumber(contactPhoneNumber, this.flow.tenantId);
      if (contact) {
        this.variables = { ...contact.variables };
        
        if (contact.firstName) {
          this.variables.first_name = contact.firstName;
        }
        
        if (contact.lastName) {
          this.variables.last_name = contact.lastName;
        }
        
        this.variables.phone = contactPhoneNumber;
      }
    } catch (error) {
      console.error('Error retrieving contact:', error);
    }
    
    // Execute the flow starting from the start node
    return this.executeNode(startNode, initialMessage);
  }
  
  private async executeNode(node: FlowNode, incomingMessage?: string) {
    // Process the node based on its type
    switch (node.type) {
      case 'startTrigger':
        return this.executeStartTriggerNode(node, incomingMessage);
      case 'textMessage':
        return this.executeTextMessageNode(node);
      case 'mediaMessage':
        return this.executeMediaMessageNode(node);
      case 'quickReplies':
        return this.executeQuickRepliesNode(node);
      case 'listMessage':
        return this.executeListMessageNode(node);
      case 'condition':
        return this.executeConditionNode(node);
      case 'waitResponse':
        return this.executeWaitResponseNode(node, incomingMessage);
      case 'delay':
        return this.executeDelayNode(node);
      case 'httpRequest':
        return this.executeHttpRequestNode(node);
      case 'setVariable':
        return this.executeSetVariableNode(node);
      case 'humanTransfer':
        return this.executeHumanTransferNode(node);
      default:
        throw new Error(`Unsupported node type: ${node.type}`);
    }
  }
  
  private async executeStartTriggerNode(node: FlowNode, incomingMessage?: string) {
    // Find the next node to execute
    const nextNodeId = this.getNextNodeId(node.id);
    if (!nextNodeId) {
      return { complete: true };
    }
    
    const nextNode = this.flow.nodes.find(n => n.id === nextNodeId);
    if (!nextNode) {
      return { complete: true };
    }
    
    this.currentNodeId = nextNode.id;
    return this.executeNode(nextNode, incomingMessage);
  }
  
  private async executeTextMessageNode(node: FlowNode) {
    if (!this.whatsAppService) {
      throw new Error('WhatsApp service not initialized');
    }
    
    const { text, to = this.variables.phone } = node.data;
    
    // Replace variables in text
    const processedText = this.replaceVariables(text);
    
    // Send the message
    await this.whatsAppService.sendTextMessage(to, processedText);
    
    // Find the next node to execute
    const nextNodeId = this.getNextNodeId(node.id);
    if (!nextNodeId) {
      return { complete: true };
    }
    
    const nextNode = this.flow.nodes.find(n => n.id === nextNodeId);
    if (!nextNode) {
      return { complete: true };
    }
    
    this.currentNodeId = nextNode.id;
    return this.executeNode(nextNode);
  }
  
  private async executeMediaMessageNode(node: FlowNode) {
    if (!this.whatsAppService) {
      throw new Error('WhatsApp service not initialized');
    }
    
    const { mediaType, mediaUrl, to = this.variables.phone } = node.data;
    
    // Process the media URL (replace variables if any)
    const processedUrl = this.replaceVariables(mediaUrl);
    
    // Send the media message based on type
    if (mediaType === 'image') {
      await this.whatsAppService.sendImageMessage(to, processedUrl);
    } else {
      // In a real implementation, handle other media types
      throw new Error(`Unsupported media type: ${mediaType}`);
    }
    
    // Find the next node to execute
    const nextNodeId = this.getNextNodeId(node.id);
    if (!nextNodeId) {
      return { complete: true };
    }
    
    const nextNode = this.flow.nodes.find(n => n.id === nextNodeId);
    if (!nextNode) {
      return { complete: true };
    }
    
    this.currentNodeId = nextNode.id;
    return this.executeNode(nextNode);
  }
  
  private async executeQuickRepliesNode(node: FlowNode) {
    if (!this.whatsAppService) {
      throw new Error('WhatsApp service not initialized');
    }
    
    const { text, buttons, to = this.variables.phone } = node.data;
    
    // Replace variables in text
    const processedText = this.replaceVariables(text);
    
    // Send the quick reply buttons
    await this.whatsAppService.sendQuickReplyButtons(to, processedText, buttons);
    
    // In a real implementation, we would wait for the user's response
    // and determine the next node based on which button was pressed
    
    // For simplicity, we'll just return that the node execution is complete
    return { complete: true, waitingForResponse: true, nodeId: node.id };
  }
  
  private async executeListMessageNode(node: FlowNode) {
    if (!this.whatsAppService) {
      throw new Error('WhatsApp service not initialized');
    }
    
    const { text, buttonText, sections, to = this.variables.phone } = node.data;
    
    // Replace variables in text
    const processedText = this.replaceVariables(text);
    
    // Send the list message
    await this.whatsAppService.sendListMessage(to, processedText, buttonText, sections);
    
    // In a real implementation, we would wait for the user's response
    // and determine the next node based on which item was selected
    
    // For simplicity, we'll just return that the node execution is complete
    return { complete: true, waitingForResponse: true, nodeId: node.id };
  }
  
  private async executeConditionNode(node: FlowNode) {
    const { condition } = node.data;
    
    // Evaluate the condition
    const result = this.evaluateCondition(condition);
    
    // Find the next node based on the condition result
    const nextNodeId = this.getNextNodeId(node.id, result ? 'true' : 'false');
    if (!nextNodeId) {
      return { complete: true };
    }
    
    const nextNode = this.flow.nodes.find(n => n.id === nextNodeId);
    if (!nextNode) {
      return { complete: true };
    }
    
    this.currentNodeId = nextNode.id;
    return this.executeNode(nextNode);
  }
  
  private async executeWaitResponseNode(node: FlowNode, incomingMessage?: string) {
    if (!incomingMessage) {
      // If there's no incoming message, we need to wait for one
      return { complete: false, waitingForResponse: true, nodeId: node.id };
    }
    
    // Store the response in the specified variable
    const { variableName } = node.data;
    if (variableName) {
      this.variables[variableName] = incomingMessage;
      
      // Update the contact's variables
      if (this.variables.phone) {
        try {
          const contact = await storage.getContactByPhoneNumber(this.variables.phone, this.flow.tenantId);
          if (contact) {
            await storage.updateContactVariables(contact.id, this.flow.tenantId, { [variableName]: incomingMessage });
          }
        } catch (error) {
          console.error('Error updating contact variables:', error);
        }
      }
    }
    
    // Find the next node to execute
    const nextNodeId = this.getNextNodeId(node.id);
    if (!nextNodeId) {
      return { complete: true };
    }
    
    const nextNode = this.flow.nodes.find(n => n.id === nextNodeId);
    if (!nextNode) {
      return { complete: true };
    }
    
    this.currentNodeId = nextNode.id;
    return this.executeNode(nextNode);
  }
  
  private async executeDelayNode(node: FlowNode) {
    const { delaySeconds } = node.data;
    
    // In a real implementation, we would schedule the next node execution
    // after the specified delay, rather than actually waiting
    
    // For simplicity, we'll just return that the node execution is complete
    return { complete: true, delaySeconds, nodeId: node.id };
  }
  
  private async executeHttpRequestNode(node: FlowNode) {
    const { url, method, headers, body, responseVariable } = node.data;
    
    try {
      // Replace variables in the request
      const processedUrl = this.replaceVariables(url);
      const processedHeaders = headers ? JSON.parse(this.replaceVariables(JSON.stringify(headers))) : {};
      const processedBody = body ? JSON.parse(this.replaceVariables(JSON.stringify(body))) : undefined;
      
      // Make the HTTP request
      const response = await axios({
        method: method.toLowerCase(),
        url: processedUrl,
        headers: processedHeaders,
        data: processedBody,
      });
      
      // Store the response in the specified variable
      if (responseVariable) {
        this.variables[responseVariable] = JSON.stringify(response.data);
      }
      
      // Find the next node to execute
      const nextNodeId = this.getNextNodeId(node.id, 'success');
      if (!nextNodeId) {
        return { complete: true };
      }
      
      const nextNode = this.flow.nodes.find(n => n.id === nextNodeId);
      if (!nextNode) {
        return { complete: true };
      }
      
      this.currentNodeId = nextNode.id;
      return this.executeNode(nextNode);
    } catch (error) {
      // In case of error, follow the error edge
      const errorNodeId = this.getNextNodeId(node.id, 'error');
      if (!errorNodeId) {
        return { complete: true, error: error.message };
      }
      
      const errorNode = this.flow.nodes.find(n => n.id === errorNodeId);
      if (!errorNode) {
        return { complete: true, error: error.message };
      }
      
      this.currentNodeId = errorNode.id;
      return this.executeNode(errorNode);
    }
  }
  
  private async executeSetVariableNode(node: FlowNode) {
    const { variableName, value } = node.data;
    
    // Process the value (replace variables if any)
    const processedValue = this.replaceVariables(value);
    
    // Set the variable
    this.variables[variableName] = processedValue;
    
    // Update the contact's variables
    if (this.variables.phone) {
      try {
        const contact = await storage.getContactByPhoneNumber(this.variables.phone, this.flow.tenantId);
        if (contact) {
          await storage.updateContactVariables(contact.id, this.flow.tenantId, { [variableName]: processedValue });
        }
      } catch (error) {
        console.error('Error updating contact variables:', error);
      }
    }
    
    // Find the next node to execute
    const nextNodeId = this.getNextNodeId(node.id);
    if (!nextNodeId) {
      return { complete: true };
    }
    
    const nextNode = this.flow.nodes.find(n => n.id === nextNodeId);
    if (!nextNode) {
      return { complete: true };
    }
    
    this.currentNodeId = nextNode.id;
    return this.executeNode(nextNode);
  }
  
  private async executeHumanTransferNode(node: FlowNode) {
    if (!this.whatsAppService) {
      throw new Error('WhatsApp service not initialized');
    }
    
    const { message, to = this.variables.phone } = node.data;
    
    // Replace variables in message
    const processedMessage = this.replaceVariables(message);
    
    // Send a message to the user explaining they're being transferred
    await this.whatsAppService.sendTextMessage(to, processedMessage);
    
    // In a real implementation, we would notify an agent about the transfer
    // ...
    
    // For simplicity, we'll just return that the node execution is complete
    return { complete: true, humanTransfer: true, to, variables: this.variables };
  }
  
  private getNextNodeId(currentNodeId: string, handle?: string) {
    const edges = this.flow.edges.filter(edge => edge.source === currentNodeId);
    
    if (handle) {
      const edge = edges.find(e => e.sourceHandle === handle);
      return edge?.target;
    }
    
    // If no specific handle is requested, return the first edge's target
    return edges[0]?.target;
  }
  
  private replaceVariables(text: string): string {
    if (!text) return '';
    
    return text.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
      return this.variables[variableName.trim()] || match;
    });
  }
  
  private evaluateCondition(condition: string): boolean {
    // Simple condition evaluation for the MVP
    // In a real implementation, this would be more robust
    
    try {
      // Replace variables in the condition
      const processedCondition = condition.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
        const value = this.variables[variableName.trim()];
        return typeof value === 'string' ? `"${value}"` : value || 'undefined';
      });
      
      // Evaluate the condition
      return eval(processedCondition);
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }
}
