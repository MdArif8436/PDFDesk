export type ToolCategory =
  | 'all'
  | 'organize'
  | 'optimize'
  | 'convert-to'
  | 'convert-from'
  | 'edit'
  | 'image'
  | 'security'
  | 'intelligence'
  | 'workflow';

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  badge?: string;
  iconName: string;
  accentColor: string; // Tailwind color class
  accepts: string[]; // e.g. ['.pdf'], ['.jpg', '.png']
  maxFiles: number;
  apiEndpoint?: string;
  premiumOnly?: boolean;
}

export interface ProcessedTask {
  id: string;
  toolId: string;
  toolName: string;
  inputFileName: string;
  outputFileName: string;
  originalSize: number;
  resultSize?: number;
  timestamp: string;
  status: 'completed' | 'failed';
  downloadUrl?: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  email?: string;
  plan: 'free' | 'premium';
  credits: number;
  authMethod?: 'password' | 'biometric' | 'sso';
}

export interface CalendarEventPayload {
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DDTHH:mm:ss
  endDate: string;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'none';
}
