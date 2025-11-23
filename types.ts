export interface Account {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error' | 'needs_login';
  proxy?: string;
  lastActive?: string;
}

export interface PostTask {
  id: string;
  content: string;
  originalContent?: string;
  images?: string[];
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  scheduledTime?: string; // ISO string
  accountId?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export enum AiTone {
  EXPERT = 'Expert (Chuyên gia)',
  NEWS = 'News (Tin tức)',
  FRIENDLY = 'Newbie Friendly (Dễ hiểu)',
  HYPE = 'Hype Marketing (FOMO)',
  SUMMARY = 'Summary (Tóm tắt)',
}

export interface RewriteConfig {
  tone: AiTone;
  creativity: number; // 0-10
  language: string;
}

export type BotStatus = 'idle' | 'crawling' | 'rewriting' | 'posting' | 'waiting' | 'error';

export interface BotConfig {
  targetUrl: string;
  intervalMin: number;
  intervalMax: number;
  postsLimit: number;
}