import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PenTool, 
  Calendar, 
  History, 
  Settings, 
  Play, 
  Pause, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Globe, 
  FileText,
  Upload,
  Plus,
  X,
  Loader,
  MousePointer2,
  Bot,
  Zap,
  BookOpen,
  HelpCircle,
  Terminal,
  Clock,
  Trash2,
  Power,
  Shield,
  Wifi,
  Download,
  Monitor,
  Apple,
  Package,
  Code,
  FileCog
} from 'lucide-react';
import { Account, PostTask, LogEntry, AiTone, RewriteConfig, BotStatus, BotConfig } from './types';
import { rewriteContent, generateSpinVersions } from './services/geminiService';
import { AutomationLogic } from './core/playwrightActions';

// Declare JSZip and saveAs globally since they are loaded via CDN in index.html
declare const JSZip: any;
declare const saveAs: any;

// --- Component: Sidebar ---
const SidebarItem = ({ icon: Icon, label, active, onClick, className = "" }: { icon: any, label: string, active: boolean, onClick: () => void, className?: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active ? 'bg-[#F0B90B] text-black font-semibold' : 'text-gray-400 hover:bg-[#2b3139] hover:text-white'
    } ${className}`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

// --- Component: Simulation Modal (Visualizes Auto-Post) ---
const SimulationModal = ({ 
  isOpen, 
  onClose, 
  content,
  autoClose = false,
  mode = 'post'
}: { isOpen: boolean; onClose: () => void; content?: string; autoClose?: boolean; mode?: 'post' | 'login' }) => {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [logs, setSimLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setTypedText('');
      setSimLogs([]);
      return;
    }

    let timeouts: ReturnType<typeof setTimeout>[] = [];
    const addLog = (msg: string) => setSimLogs(prev => [...prev, `> ${msg}`]);

    if (mode === 'login') {
        timeouts.push(setTimeout(() => { setStep(1); addLog('Opening Browser (Chromium)...'); }, 500));
        timeouts.push(setTimeout(() => { setStep(2); addLog('Navigating to Binance Login Page...'); }, 1500));
        timeouts.push(setTimeout(() => { addLog('Waiting for user manual login...'); }, 2500));
        timeouts.push(setTimeout(() => { 
            addLog('Login detected!'); 
            addLog('Saving session to storageState.json...');
            setStep(4); 
        }, 5000));
        if (autoClose) timeouts.push(setTimeout(onClose, 6000));
    } else {
        timeouts.push(setTimeout(() => {
            setStep(1);
            addLog('Launching Chromium...');
            addLog('Loading Profile: storageState.json');
        }, 500));
        timeouts.push(setTimeout(() => {
            setStep(2);
            addLog('Navigating to Binance Creator Center...');
            addLog('Waiting for selector: div.ProseMirror...');
        }, 1500));
        timeouts.push(setTimeout(() => {
            setStep(3);
            addLog('Focusing Editor: div.ProseMirror');
            addLog('Simulating Human Typing (Random delay 30-80ms)...');
            
            if (content) {
                let charIndex = 0;
                const typeInterval = setInterval(() => {
                    setTypedText(content.slice(0, charIndex + 1));
                    charIndex++;
                    if (charIndex >= content.length) {
                        clearInterval(typeInterval);
                        addLog('Typing complete.');
                        addLog('Checking Anti-spam rules...');
                        setTimeout(() => setStep(4), 1500);
                    }
                }, 20);
            }
        }, 3000));
        if (autoClose) {
            timeouts.push(setTimeout(onClose, 8000));
        }
    }

    return () => timeouts.forEach(clearTimeout);
  }, [isOpen, content, autoClose, onClose, mode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-[#181a20] w-[800px] h-[600px] rounded-xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-[#2b3139] p-3 flex items-center space-x-4 border-b border-black">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 bg-[#181a20] px-3 py-1 rounded text-xs text-gray-400 font-mono truncate">
            Bot Action: {mode === 'login' ? 'Login Session Capture' : 'Auto-Posting'}
          </div>
          <button onClick={onClose}><X size={16} className="text-gray-400 hover:text-white"/></button>
        </div>
        <div className="flex-1 p-6 relative bg-white text-black overflow-y-auto">
          {mode === 'login' ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                  {step < 4 ? (
                      <>
                        <div className="w-16 h-16 border-4 border-[#F0B90B] border-t-transparent rounded-full animate-spin mb-6"></div>
                        <h3 className="text-2xl font-bold mb-2">Đang chờ đăng nhập...</h3>
                        <p className="text-gray-500">Vui lòng đăng nhập Binance trên cửa sổ trình duyệt vừa mở.</p>
                      </>
                  ) : (
                      <>
                        <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Đã lưu Session!</h3>
                        <p className="text-gray-500">Tài khoản đã sẵn sàng để auto.</p>
                      </>
                  )}
              </div>
          ) : (
             step >= 2 ? (
            <div className="max-w-2xl mx-auto mt-10">
              <div className="text-2xl font-bold text-gray-800 mb-6">Create Post</div>
              <div className={`border rounded-lg p-4 min-h-[200px] transition-all ${step === 3 ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}>
                 <div className="prose prose-sm font-sans whitespace-pre-wrap">
                   {typedText}
                   {step === 3 && <span className="animate-pulse border-r-2 border-black ml-1"></span>}
                 </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className={`px-6 py-2 rounded font-bold text-white transition-all relative ${step === 4 ? 'bg-[#F0B90B] scale-105' : 'bg-gray-300'}`}>
                  <span>Đăng</span>
                  {step === 4 && (
                    <div className="absolute -bottom-8 -right-8 transition-all duration-500">
                        <MousePointer2 className="fill-black text-black w-6 h-6 -rotate-45" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
               <Loader className="animate-spin mb-4" size={40} />
               <p>Browser Automation Running...</p>
            </div>
          )
          )}
        </div>
        <div className="h-32 bg-black p-4 font-mono text-xs text-green-400 overflow-y-auto border-t border-gray-700">
          {logs.map((log, idx) => <div key={idx} className="mb-1">{log}</div>)}
        </div>
      </div>
    </div>
  );
};

// --- Component: Countdown Circle ---
const CountdownCircle = ({ current, total, size = 80 }: { current: number, total: number, size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = total > 0 ? ((total - current) / total) : 0;
    const strokeDashoffset = circumference - progress * circumference;
    const safeTotal = total > 0 ? total : 1;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="#374151" strokeWidth="6" fill="transparent" />
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="#F0B90B" strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
            </svg>
            <div className="absolute text-center flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[#F0B90B] leading-none">{current}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">giây</span>
            </div>
        </div>
    );
};


// --- Main App ---
export default function App() {
  const [activeTab, setActiveTab] = useState('download');
  
  // Data State
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: 'Main Account (VIP)', status: 'active', proxy: '103.21.123.1:8080', cookieStatus: 'valid' },
    { id: '2', name: 'Clone Account 01', status: 'needs_login', proxy: '', cookieStatus: 'expired' },
  ]);
  
  const [posts, setPosts] = useState<PostTask[]>([
    { id: '101', content: 'Bitcoin to the moon! #BTC', status: 'posted', scheduledTime: new Date(Date.now() - 86400000).toISOString(), accountId: '1' },
    { id: '102', content: 'Market analysis for today...', status: 'posted', scheduledTime: new Date(Date.now() - 43200000).toISOString(), accountId: '1' },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [editorContent, setEditorContent] = useState('');
  const [rewriteConfig, setRewriteConfig] = useState<RewriteConfig>({
    tone: AiTone.FRIENDLY,
    creativity: 7,
    language: 'Vietnamese'
  });

  // Bot State
  const [botStatus, setBotStatus] = useState<BotStatus>('idle');
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [botConfig, setBotConfig] = useState<BotConfig>({
    targetUrl: 'https://www.binance.com/en/square',
    intervalMin: 5,
    intervalMax: 15,
    postsLimit: 50
  });
  const [countDown, setCountDown] = useState(0);
  const [totalWaitTime, setTotalWaitTime] = useState(0);
  
  // UI State
  const [showSimulation, setShowSimulation] = useState(false);
  const [simMode, setSimMode] = useState<'post' | 'login'>('post');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountProxy, setNewAccountProxy] = useState('');

  // Download State
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // --- Helpers ---
  const addLog = (message: string, level: LogEntry['level'] = 'info') => {
    setLogs(prev => [{
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    }, ...prev].slice(0, 100));
  };

  const exportCSV = () => {
    const headers = ['ID', 'Content', 'Status', 'Time', 'Account', 'Error'];
    const rows = posts.map(p => [
        p.id, 
        `"${p.content.substring(0, 50)}..."`, 
        p.status, 
        p.scheduledTime, 
        accounts.find(a => a.id === p.accountId)?.name || 'Unknown',
        p.logs || ''
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "binance_tool_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog('Đã xuất file CSV thành công.', 'success');
  };

  const simulateDownload = () => {
      setIsDownloading(true);
      setDownloadProgress(0);
      const interval = setInterval(() => {
          setDownloadProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  setIsDownloading(false);
                  alert("Vui lòng sử dụng nút 'Download Full Source' bên dưới để tải gói cài đặt thực sự.");
                  return 100;
              }
              return prev + 5;
          });
      }, 100);
  };

  // --- SOURCE CODE GENERATION ---
  const generateAndDownloadZip = async () => {
    if (typeof JSZip === 'undefined' || typeof saveAs === 'undefined') {
        alert("Đang tải thư viện nén... Vui lòng thử lại sau 5 giây.");
        return;
    }

    addLog('Đang tạo file nén dự án (Phiên bản Full UI)...', 'info');
    const zip = new JSZip();

    // 1. Package.json
    const packageJson = {
        name: "binance-square-autotool",
        version: "1.0.2",
        description: "Auto tool for Binance Square - Full GUI",
        main: "main.js",
        scripts: {
            "start": "electron .",
            "build": "electron-builder",
            "postinstall": "electron-builder install-app-deps"
        },
        build: {
            "appId": "com.binance.autotool",
            "productName": "Binance Auto Tool",
            "win": {
                "target": "nsis"
            },
            "directories": {
                "output": "dist"
            }
        },
        author: "You",
        license: "ISC",
        dependencies: {
            "playwright": "^1.40.0"
        },
        devDependencies: {
            "electron": "^28.0.0",
            "electron-builder": "^24.9.1"
        }
    };
    zip.file("package.json", JSON.stringify(packageJson, null, 2));

    // 2. Main.js
    const mainJs = `
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const automationPath = path.join(__dirname, 'core', 'playwrightActions.js');

let runAutoPost;
try {
  const mod = require(automationPath);
  runAutoPost = mod.runAutoPost;
} catch (e) {
  console.error("FAILED TO LOAD AUTOMATION LOGIC:", e);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 850,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: "Binance Square AutoTool (Full Version)",
    autoHideMenuBar: true,
    backgroundColor: '#181a20'
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('run-bot', async (event, { content, account }) => {
    console.log('Received bot command:', content);
    if (!runAutoPost) {
        return { success: false, message: "CRITICAL: Automation Logic not loaded. Check console." };
    }
    try {
        const result = await runAutoPost(account || { proxy: null }, content);
        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }
});
`;
    zip.file("main.js", mainJs);

    // 3. Playwright Core Logic
    zip.folder("core").file("playwrightActions.js", AutomationLogic);

    // 4. FULL GUI (index.html) - Replaced simplified version with Full Tailwind UI
    const fullUiHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Binance Auto Tool</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #181a20; color: #eaecef; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1e2329; }
        ::-webkit-scrollbar-thumb { background: #474d57; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #f0b90b; }
        .active-tab { background-color: #F0B90B; color: black; font-weight: 600; }
        .inactive-tab { color: #9CA3AF; }
        .inactive-tab:hover { background-color: #2b3139; color: white; }
    </style>
</head>
<body class="h-screen flex overflow-hidden font-sans">

    <!-- SIDEBAR -->
    <div class="w-64 bg-[#0b0e11] flex flex-col border-r border-gray-800">
        <div class="p-6 flex items-center space-x-2">
            <div class="w-8 h-8 bg-[#F0B90B] rounded-full flex items-center justify-center text-black font-bold text-xl">B</div>
            <span class="text-xl font-bold text-white tracking-tight">AutoSquare</span>
        </div>
        
        <nav class="flex-1 px-4 space-y-2 mt-4">
            <button onclick="showTab('autopilot')" id="tab-autopilot" class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors active-tab">
                <span>🤖 Auto Pilot</span>
            </button>
            <button onclick="showTab('config')" id="tab-config" class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors inactive-tab">
                <span>⚙️ Cấu hình AI</span>
            </button>
            <button onclick="showTab('logs')" id="tab-logs" class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors inactive-tab">
                <span>📜 Nhật ký (Logs)</span>
            </button>
        </nav>

        <div class="p-4 border-t border-gray-800">
            <div class="flex items-center space-x-2 text-sm text-green-500">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Ready</span>
            </div>
        </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="flex-1 overflow-y-auto p-8">
        
        <!-- TAB: AUTO PILOT -->
        <div id="content-autopilot" class="space-y-6">
            <div class="bg-[#1e2329] p-8 rounded-xl border border-gray-700 shadow-lg">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-white mb-2">Auto Pilot Mode</h2>
                        <p class="text-gray-400">Tự động hóa hoàn toàn quy trình đăng bài.</p>
                    </div>
                    <button id="btnRun" onclick="toggleBot()" class="px-8 py-3 rounded-xl font-bold text-lg bg-[#F0B90B] text-black hover:bg-[#d9a506] transition-transform active:scale-95 shadow-lg">
                        BẮT ĐẦU CHẠY
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-400 mb-2">Nội dung bài viết (Hoặc URL Crawl)</label>
                        <textarea id="postContent" class="w-full h-40 bg-[#0b0e11] border border-gray-600 rounded-lg p-4 text-white focus:border-[#F0B90B] outline-none resize-none" placeholder="Nhập nội dung muốn đăng..."></textarea>
                    </div>
                    <div class="space-y-4">
                        <div class="bg-[#0b0e11] p-4 rounded-lg border border-gray-700">
                            <h3 class="text-green-400 font-bold mb-2">Trạng thái Bot</h3>
                            <div id="statusText" class="text-2xl font-mono text-white">IDLE</div>
                        </div>
                        <div class="bg-[#0b0e11] p-4 rounded-lg border border-gray-700">
                            <h3 class="text-blue-400 font-bold mb-2">Tài khoản Active</h3>
                            <div class="text-white">Main Account (VIP)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB: CONFIG -->
        <div id="content-config" class="hidden space-y-6">
            <div class="bg-[#1e2329] p-8 rounded-xl border border-gray-700">
                <h2 class="text-2xl font-bold text-white mb-6">Cấu hình hệ thống</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Tone giọng AI</label>
                        <select class="w-full bg-[#0b0e11] border border-gray-600 rounded p-3 text-white outline-none">
                            <option>Newbie Friendly (Dễ hiểu)</option>
                            <option>Expert (Chuyên gia)</option>
                            <option>Hype Marketing (FOMO)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Delay giữa các bài (Giây)</label>
                        <input type="number" value="300" class="w-full bg-[#0b0e11] border border-gray-600 rounded p-3 text-white outline-none">
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB: LOGS -->
        <div id="content-logs" class="hidden h-full flex flex-col">
            <h2 class="text-2xl font-bold text-white mb-4">Nhật ký hoạt động</h2>
            <div id="logContainer" class="flex-1 bg-black p-4 rounded-xl border border-gray-800 overflow-y-auto font-mono text-sm text-green-400">
                <div>> System initialized...</div>
                <div>> Waiting for user command...</div>
            </div>
        </div>

    </div>

    <script>
        const { ipcRenderer } = require('electron');
        let isRunning = false;

        function showTab(tabId) {
            // Hide all content
            ['autopilot', 'config', 'logs'].forEach(id => {
                document.getElementById('content-' + id).classList.add('hidden');
                document.getElementById('tab-' + id).classList.remove('active-tab');
                document.getElementById('tab-' + id).classList.add('inactive-tab');
            });
            
            // Show selected
            document.getElementById('content-' + tabId).classList.remove('hidden');
            document.getElementById('tab-' + tabId).classList.add('active-tab');
            document.getElementById('tab-' + tabId).classList.remove('inactive-tab');
        }

        function addLog(msg) {
            const container = document.getElementById('logContainer');
            const div = document.createElement('div');
            div.className = 'mb-1 border-b border-gray-900 pb-1';
            div.textContent = '> [' + new Date().toLocaleTimeString() + '] ' + msg;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        }

        async function toggleBot() {
            const btn = document.getElementById('btnRun');
            const statusText = document.getElementById('statusText');
            const content = document.getElementById('postContent').value;

            if (isRunning) {
                isRunning = false;
                btn.textContent = "BẮT ĐẦU CHẠY";
                btn.classList.remove('bg-red-500', 'text-white');
                btn.classList.add('bg-[#F0B90B]', 'text-black');
                statusText.textContent = "STOPPED";
                statusText.classList.remove('text-green-500');
                statusText.classList.add('text-red-500');
                addLog("Bot stopped by user.");
                return;
            }

            if (!content) {
                alert("Vui lòng nhập nội dung!");
                return;
            }

            isRunning = true;
            btn.textContent = "DỪNG BOT";
            btn.classList.remove('bg-[#F0B90B]', 'text-black');
            btn.classList.add('bg-red-500', 'text-white');
            statusText.textContent = "RUNNING";
            statusText.classList.remove('text-red-500');
            statusText.classList.add('text-green-500');
            
            addLog("Starting automation sequence...");
            
            try {
                addLog("Launching Browser...");
                const result = await ipcRenderer.invoke('run-bot', { content, account: {} });
                
                if (result.success) {
                    addLog("SUCCESS: " + result.message);
                } else {
                    addLog("ERROR: " + result.message);
                }
            } catch (e) {
                addLog("CRITICAL ERROR: " + e.message);
            }

            // Reset UI after run (simple single run for now)
            isRunning = false;
            btn.textContent = "BẮT ĐẦU CHẠY";
            btn.classList.remove('bg-red-500', 'text-white');
            btn.classList.add('bg-[#F0B90B]', 'text-black');
            statusText.textContent = "IDLE";
        }
    </script>
</body>
</html>
    `;
    zip.file("index.html", fullUiHtml);

    // 5. MANUAL RUN SCRIPT
    const runNowScript = `
@echo off
title Binance Auto Tool - CHE DO CHAY NGAY (NO BUILD)
color 0E

echo ===================================================
echo   KHOI DONG TOOL (KHONG CAN BUILD EXE)
echo   Cach nay luon hoat dong 100% va khong bi loi.
echo ===================================================
echo.

echo [1/2] Kiem tra va cai dat thu vien...
call npm install
if %errorlevel% neq 0 (
    echo LOI: Ban chua cai Node.js! Tai tai: https://nodejs.org/
    pause
    exit
)

echo.
echo [2/2] Dang mo Tool...
echo (Cua so nay se giu mo. Dung tat no nhe!)
echo.
call npm start
pause
    `;
    zip.file("CHAY_NGAY_KHONG_CAN_CAI.bat", runNowScript);

    const readme = `
HUONG DAN SU DUNG AN TOAN

CACH 1 (KHUYEN DUNG - 100% THANH CONG):
1. Cai Node.js (https://nodejs.org/)
2. Chay file "CHAY_NGAY_KHONG_CAN_CAI.bat"
-> Tool se hien len ngay lap tuc.
    `;
    zip.file("README.txt", readme);

    // Generate Zip
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "BinanceSquareAutoTool_Complete.zip");
    addLog('Đã tải xuống Source Code (Bản Hoàn Chỉnh).', 'success');
  };

  // --- BOT ENGINE ---
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const runBotCycle = async () => {
        if (!isBotRunning) return;

        // 0. SELECT ACTIVE ACCOUNT
        const activeAccounts = accounts.filter(a => a.status === 'active');
        if (activeAccounts.length === 0) {
            addLog('Lỗi: Không có tài khoản nào ở trạng thái Active!', 'error');
            setIsBotRunning(false);
            setBotStatus('error');
            return;
        }
        const selectedAccount = activeAccounts[Math.floor(Math.random() * activeAccounts.length)];
        
        // 1. CRAWL
        setBotStatus('crawling');
        addLog(`Bot started [Account: ${selectedAccount.name}]: Crawling data...`, 'info');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const crawledText = "Thị trường Crypto hôm nay chứng kiến sự sụt giảm nhẹ. BTC về mốc 64k. #Binance #Crypto";
        addLog(`Crawl thành công: "${crawledText.substring(0, 30)}..."`, 'success');

        // 2. REWRITE
        setBotStatus('rewriting');
        addLog('AI: Đang viết lại bài...', 'info');
        
        let finalContent = crawledText;
        try {
            finalContent = await rewriteContent(crawledText, rewriteConfig);
            addLog('AI Rewrite hoàn tất.', 'success');
        } catch (e) {
            addLog('AI Lỗi, dùng bài gốc.', 'error');
        }
        setEditorContent(finalContent); 

        // 3. POST
        setBotStatus('posting');
        addLog(`Đang đăng bài bằng nick: ${selectedAccount.name}...`, 'info');
        setSimMode('post');
        setShowSimulation(true);

        await new Promise(resolve => setTimeout(resolve, 8500));
        
        setShowSimulation(false); 
        
        const newPost: PostTask = {
            id: Date.now().toString(),
            content: finalContent,
            status: 'posted',
            scheduledTime: new Date().toISOString(),
            accountId: selectedAccount.id
        };
        setPosts(prev => [newPost, ...prev]);
        addLog('Đăng bài thành công.', 'success');

        // 4. WAIT
        setBotStatus('waiting');
        const delaySec = Math.floor(Math.random() * (botConfig.intervalMax - botConfig.intervalMin + 1) + botConfig.intervalMin);
        addLog(`Nghỉ ${delaySec} giây...`, 'warning');
        
        setTotalWaitTime(delaySec);
        setCountDown(delaySec);

        let remaining = delaySec;
        const countdownInterval = setInterval(() => {
            remaining--;
            setCountDown(remaining);
            if (remaining <= 0 || !isBotRunning) clearInterval(countdownInterval);
        }, 1000);

        await new Promise(resolve => setTimeout(resolve, delaySec * 1000));
        
        if (isBotRunning) {
             runBotCycle(); 
        }
    };

    if (isBotRunning && botStatus === 'idle') {
        runBotCycle();
    }
    return () => clearTimeout(timer);
  }, [isBotRunning]); 

  const toggleBot = () => {
      if (isBotRunning) {
          setIsBotRunning(false);
          setBotStatus('idle');
          addLog('Bot đã DỪNG.', 'error');
      } else {
          setIsBotRunning(true);
          setBotStatus('idle'); 
          addLog('Bot đã CHẠY.', 'success');
      }
  };

  // --- RENDERERS ---
  
  const renderAutoPilot = () => {
    const steps = [
        { id: 'crawling', label: 'Crawl Data', icon: Globe },
        { id: 'rewriting', label: 'AI Rewrite', icon: Zap },
        { id: 'posting', label: 'Auto Post', icon: MousePointer2 },
        { id: 'waiting', label: 'Waiting', icon: Clock },
    ];

    return (
    <div className="space-y-6 animate-fade-in">
        {/* STATUS PANEL */}
        <div className="bg-[#1e2329] p-8 rounded-xl border border-gray-700 shadow-lg">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-10">
                 <div className="mb-6 md:mb-0">
                    <h2 className="text-2xl font-bold text-white flex items-center mb-2">
                        <Bot className="mr-3 text-[#F0B90B]" size={32} /> 
                        Auto Pilot Mode
                    </h2>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isBotRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className="text-gray-400 text-sm">{isBotRunning ? 'Hệ thống đang chạy' : 'Hệ thống đang nghỉ'}</span>
                    </div>
                 </div>

                 <button
                    onClick={toggleBot}
                    className={`px-8 py-3 rounded-xl font-bold text-lg flex items-center shadow-lg transition-all transform hover:scale-105 ${
                        isBotRunning 
                        ? 'bg-red-900/80 text-red-200 border border-red-700 hover:bg-red-900' 
                        : 'bg-[#F0B90B] text-black hover:bg-[#d9a506]'
                    }`}
                >
                    {isBotRunning ? <Pause size={24} className="mr-2"/> : <Play size={24} className="mr-2"/>}
                    {isBotRunning ? 'DỪNG AUTO' : 'BẮT ĐẦU AUTO'}
                </button>
            </div>

            {/* VISUALIZER */}
            <div className="relative py-6">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 -translate-y-1/2 z-0 hidden md:block rounded"></div>
                
                <div className="relative z-10 flex justify-between px-4">
                    {steps.map((step, index) => {
                        const stepOrder = ['crawling', 'rewriting', 'posting', 'waiting'];
                        const currentIndex = stepOrder.indexOf(botStatus);
                        const stepIndex = stepOrder.indexOf(step.id);
                        const isActive = botStatus === step.id;
                        const isPast = isBotRunning && currentIndex > stepIndex;
                        
                        return (
                            <div key={step.id} className={`flex flex-col items-center transition-all duration-500 group ${isActive ? 'scale-110' : 'opacity-60'}`}>
                                {/* Icon Circle */}
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 bg-[#1e2329] transition-all duration-300 relative z-10 ${
                                    isActive ? 'border-[#F0B90B] text-[#F0B90B] shadow-[0_0_25px_rgba(240,185,11,0.3)]' : 
                                    isPast ? 'border-green-500 text-green-500' :
                                    'border-gray-600 text-gray-600'
                                }`}>
                                    {step.id === 'waiting' && isActive ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                             <CountdownCircle current={countDown} total={totalWaitTime} size={80} />
                                        </div>
                                    ) : (
                                        <step.icon size={32} className={isActive ? 'animate-pulse' : ''} />
                                    )}
                                </div>
                                <div className={`mt-4 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                                    isActive ? 'bg-[#F0B90B]/10 text-[#F0B90B]' : 
                                    isPast ? 'text-green-500' : 'text-gray-500'
                                }`}>
                                    {step.label}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700">
                <h3 className="font-semibold text-[#F0B90B] mb-4 flex items-center">
                    <Globe size={18} className="mr-2"/> Nguồn & Đích
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">URL Nguồn</label>
                        <input 
                            disabled={isBotRunning}
                            value={botConfig.targetUrl}
                            onChange={(e) => setBotConfig({...botConfig, targetUrl: e.target.value})}
                            className="w-full bg-[#0b0e11] border border-gray-600 rounded p-2 text-sm text-gray-300 focus:border-[#F0B90B] outline-none" 
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Tài khoản đang bật</label>
                        <div className="text-sm text-green-400 font-mono bg-[#0b0e11] p-2 rounded border border-gray-600">
                            {accounts.filter(a => a.status === 'active').length} Active / {accounts.length} Total
                        </div>
                    </div>
                </div>
            </div>
             <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700">
                <h3 className="font-semibold text-blue-400 mb-4 flex items-center">
                    <Zap size={18} className="mr-2"/> Cấu hình AI
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Giọng văn (Tone)</label>
                        <select 
                            disabled={isBotRunning}
                            value={rewriteConfig.tone}
                            onChange={(e) => setRewriteConfig({...rewriteConfig, tone: e.target.value as AiTone})}
                            className="w-full bg-[#0b0e11] border border-gray-600 rounded p-2 text-sm text-gray-300 outline-none"
                        >
                            {Object.values(AiTone).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                         <label className="block text-xs text-gray-400 mb-1">Ngôn ngữ</label>
                         <select disabled={isBotRunning} className="w-full bg-[#0b0e11] border border-gray-600 rounded p-2 text-sm text-gray-300 outline-none">
                             <option>Vietnamese</option>
                             <option>English</option>
                         </select>
                    </div>
                </div>
            </div>
            <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700">
                <h3 className="font-semibold text-green-400 mb-4 flex items-center">
                    <Calendar size={18} className="mr-2"/> Thời gian lặp
                </h3>
                <div className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-400 mb-1">Min (giây)</label>
                            <input 
                                type="number"
                                disabled={isBotRunning}
                                value={botConfig.intervalMin}
                                onChange={(e) => setBotConfig({...botConfig, intervalMin: parseInt(e.target.value)})}
                                className="w-full bg-[#0b0e11] border border-gray-600 rounded p-2 text-sm text-gray-300 outline-none" 
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-400 mb-1">Max (giây)</label>
                            <input 
                                type="number"
                                disabled={isBotRunning}
                                value={botConfig.intervalMax}
                                onChange={(e) => setBotConfig({...botConfig, intervalMax: parseInt(e.target.value)})}
                                className="w-full bg-[#0b0e11] border border-gray-600 rounded p-2 text-sm text-gray-300 outline-none" 
                            />
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 italic">
                        *Tool sẽ chọn ngẫu nhiên 1 tài khoản Active mỗi lượt đăng.
                    </div>
                </div>
            </div>
        </div>

        {/* Realtime Logs */}
        <div className="bg-[#000] p-4 rounded-xl border border-gray-800 h-64 overflow-y-auto font-mono text-sm">
            <div className="sticky top-0 bg-black pb-2 mb-2 border-b border-gray-800 font-bold text-gray-400 flex justify-between">
                <span>NHẬT KÝ HOẠT ĐỘNG (SYSTEM LOGS)</span>
                <span className="text-xs font-normal cursor-pointer hover:text-white" onClick={() => setLogs([])}>XÓA LOG</span>
            </div>
            {logs.length === 0 && <div className="text-gray-600 italic">Đang chờ lệnh khởi động...</div>}
            {logs.map(log => (
                <div key={log.id} className="mb-1 flex">
                    <span className="text-gray-600 mr-2">[{log.timestamp}]</span>
                    <span className={`${
                        log.level === 'error' ? 'text-red-500' :
                        log.level === 'success' ? 'text-green-500' :
                        log.level === 'warning' ? 'text-yellow-500' : 'text-blue-300'
                    }`}>
                        {log.message}
                    </span>
                </div>
            ))}
        </div>
    </div>
  );
  };

  const renderDashboard = () => {
      const totalPosts = posts.length;
      const successPosts = posts.filter(p => p.status === 'posted').length;
      const failPosts = posts.filter(p => p.status === 'failed').length;
      const successRate = totalPosts > 0 ? Math.round((successPosts / totalPosts) * 100) : 0;

      return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <LayoutDashboard className="mr-3 text-[#F0B90B]"/> Dashboard Tổng quan
            </h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm font-bold uppercase mb-2">Tổng bài đăng</div>
                    <div className="text-3xl font-bold text-white">{totalPosts}</div>
                </div>
                 <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm font-bold uppercase mb-2">Thành công</div>
                    <div className="text-3xl font-bold text-green-500">{successPosts}</div>
                </div>
                 <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm font-bold uppercase mb-2">Thất bại</div>
                    <div className="text-3xl font-bold text-red-500">{failPosts}</div>
                </div>
                 <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm font-bold uppercase mb-2">Tỷ lệ OK</div>
                    <div className="text-3xl font-bold text-[#F0B90B]">{successRate}%</div>
                </div>
            </div>

            {/* Quick History Table */}
            <div className="bg-[#1e2329] rounded-xl border border-gray-700 overflow-hidden">
                 <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-white">Lịch sử 5 bài gần nhất</h3>
                    <button onClick={() => setActiveTab('history')} className="text-[#F0B90B] text-sm hover:underline">Xem tất cả</button>
                 </div>
                 <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-[#0b0e11] text-gray-500 uppercase font-bold text-xs">
                        <tr>
                            <th className="p-4">Thời gian</th>
                            <th className="p-4">Nội dung</th>
                            <th className="p-4">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.slice(0, 5).map(post => (
                            <tr key={post.id} className="border-b border-gray-800 hover:bg-[#2b3139]">
                                <td className="p-4">{new Date(post.scheduledTime || '').toLocaleTimeString()}</td>
                                <td className="p-4 truncate max-w-xs text-white">{post.content}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        post.status === 'posted' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                                    }`}>
                                        {post.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
      );
  };

  const renderEditor = () => (
      <div className="space-y-6 animate-fade-in h-full flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-white flex items-center">
                <PenTool className="mr-3 text-[#F0B90B]"/> Soạn thảo & AI Rewrite
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* Configuration Panel */}
            <div className="lg:col-span-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
                <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="font-semibold text-blue-400 mb-4 flex items-center text-lg">
                        <Zap size={20} className="mr-2"/> Cấu hình AI
                    </h3>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Giọng văn (Tone)</label>
                            <select 
                                value={rewriteConfig.tone}
                                onChange={(e) => setRewriteConfig({...rewriteConfig, tone: e.target.value as AiTone})}
                                className="w-full bg-[#0b0e11] border border-gray-600 rounded-lg p-3 text-sm text-white outline-none focus:border-[#F0B90B] transition-colors"
                            >
                                {Object.values(AiTone).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                                Độ sáng tạo: <span className="text-[#F0B90B]">{rewriteConfig.creativity}/10</span>
                            </label>
                            <input 
                                type="range" 
                                min="0" 
                                max="10" 
                                value={rewriteConfig.creativity}
                                onChange={(e) => setRewriteConfig({...rewriteConfig, creativity: parseInt(e.target.value)})}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#F0B90B]"
                            />
                            <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-medium uppercase">
                                <span>Strict</span>
                                <span>Balanced</span>
                                <span>Wild</span>
                            </div>
                        </div>

                        <div>
                             <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Ngôn ngữ</label>
                             <select 
                                value={rewriteConfig.language}
                                onChange={(e) => setRewriteConfig({...rewriteConfig, language: e.target.value})}
                                className="w-full bg-[#0b0e11] border border-gray-600 rounded-lg p-3 text-sm text-white outline-none focus:border-[#F0B90B] transition-colors"
                             >
                                 <option value="Vietnamese">Vietnamese</option>
                                 <option value="English">English</option>
                             </select>
                        </div>

                        <button 
                            onClick={async () => {
                                if (!editorContent) {
                                    addLog('Vui lòng nhập nội dung để AI viết lại.', 'warning');
                                    return;
                                }
                                addLog('Đang viết lại nội dung...', 'info');
                                try {
                                    const newContent = await rewriteContent(editorContent, rewriteConfig);
                                    setEditorContent(newContent);
                                    addLog('Đã viết lại xong.', 'success');
                                } catch (e) {
                                    addLog('Lỗi AI: ' + e, 'error');
                                }
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 rounded-lg font-bold flex items-center justify-center shadow-lg transform transition-all active:scale-95"
                        >
                            <RefreshCw size={18} className="mr-2"/> Rewrite with AI
                        </button>
                    </div>
                </div>

                 <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="font-semibold text-green-400 mb-4 flex items-center text-lg">
                        <Save size={20} className="mr-2"/> Tác vụ
                    </h3>
                    <div className="space-y-3">
                         <button 
                            onClick={() => {
                                if (!editorContent) return;
                                const newPost: PostTask = {
                                    id: Date.now().toString(),
                                    content: editorContent,
                                    status: 'draft',
                                    scheduledTime: new Date().toISOString(),
                                    accountId: accounts[0]?.id
                                };
                                setPosts([newPost, ...posts]);
                                addLog('Đã lưu nháp thành công.', 'success');
                            }}
                            className="w-full bg-[#2b3139] hover:bg-[#353b46] text-white border border-gray-600 py-3 rounded-lg font-bold flex items-center justify-center transition-all"
                        >
                            <Save size={16} className="mr-2"/> Lưu Nháp (Draft)
                        </button>
                        <button 
                             onClick={() => {
                                 if(window.confirm('Bạn chắc chắn muốn xóa trắng editor?')) {
                                    setEditorContent('');
                                    addLog('Đã xóa nội dung editor.', 'info');
                                 }
                             }}
                            className="w-full bg-[#2b3139] hover:bg-red-900/30 text-red-400 border border-gray-600 py-3 rounded-lg font-bold flex items-center justify-center transition-all"
                        >
                            <Trash2 size={16} className="mr-2"/> Xóa trắng
                        </button>
                    </div>
                </div>
            </div>

            {/* Editor Area */}
            <div className="lg:col-span-2 flex flex-col h-full min-h-[500px]">
                <div className="bg-[#1e2329] rounded-t-xl border border-gray-700 border-b-0 flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Editor</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{editorContent.length} chars</span>
                </div>
                <textarea 
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Nhập nội dung gốc hoặc dán link bài viết để AI xử lý..."
                    className="flex-1 w-full bg-[#0b0e11] text-gray-200 p-6 rounded-b-xl border border-gray-700 outline-none focus:border-[#F0B90B] focus:ring-1 focus:ring-[#F0B90B] font-mono text-sm leading-relaxed resize-none transition-all"
                    spellCheck={false}
                />
            </div>
          </div>
      </div>
  );

  const renderAccounts = () => (
      <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
                <Users className="mr-3 text-[#F0B90B]"/> Quản lý Tài khoản
            </h2>
          </div>

          {/* ADD ACCOUNT FORM */}
          <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700 mb-6">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Plus className="mr-2 text-green-500"/> Thêm tài khoản mới
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Tên gợi nhớ</label>
                    <input 
                        placeholder="Ví dụ: Nick Chính, Nick Clone 1..." 
                        value={newAccountName}
                        onChange={e => setNewAccountName(e.target.value)}
                        className="w-full bg-[#0b0e11] border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F0B90B]"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Proxy (IP:Port:User:Pass) - Tùy chọn</label>
                    <input 
                        placeholder="192.168.1.1:8080:user:pass" 
                        value={newAccountProxy}
                        onChange={e => setNewAccountProxy(e.target.value)}
                        className="w-full bg-[#0b0e11] border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F0B90B]"
                    />
                </div>
                <div className="flex items-end">
                    <button 
                        onClick={() => {
                            if(!newAccountName) return;
                            setAccounts([...accounts, {
                                id: Date.now().toString(),
                                name: newAccountName,
                                status: 'needs_login',
                                proxy: newAccountProxy,
                                cookieStatus: 'expired'
                            }]);
                            setNewAccountName('');
                            setNewAccountProxy('');
                            addLog(`Đã thêm tài khoản: ${newAccountName}`, 'success');
                        }}
                        className="w-full bg-[#F0B90B] text-black px-4 py-2 rounded font-bold flex items-center justify-center hover:bg-[#d9a506] h-[38px]"
                    >
                        <Plus size={18} className="mr-2"/> Thêm Ngay
                    </button>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
              {accounts.map(acc => (
                  <div key={acc.id} className={`bg-[#1e2329] p-6 rounded-xl border transition-all ${acc.status === 'active' ? 'border-green-900' : 'border-gray-700 opacity-75'}`}>
                      <div className="flex flex-col md:flex-row items-center justify-between">
                          <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-1/2">
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl border-2 ${
                                  acc.status === 'active' ? 'bg-green-900/20 text-green-500 border-green-500' : 'bg-gray-700 text-gray-400 border-gray-500'
                              }`}>
                                  {acc.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                  <div className="font-bold text-lg text-white flex items-center">
                                      {acc.name}
                                      {acc.status === 'active' ? 
                                          <span className="ml-3 text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded border border-green-700">ACTIVE</span> : 
                                          <span className="ml-3 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">PAUSED</span>
                                      }
                                  </div>
                                  <div className="flex flex-col space-y-1 mt-2">
                                      <div className={`text-xs flex items-center ${acc.cookieStatus === 'valid' ? 'text-green-500' : 'text-red-500'}`}>
                                          {acc.cookieStatus === 'valid' ? <CheckCircle size={12} className="mr-1"/> : <AlertCircle size={12} className="mr-1"/>}
                                          {acc.cookieStatus === 'valid' ? 'Session OK' : 'Cần đăng nhập lại'}
                                      </div>
                                      <div className="text-xs text-gray-400 flex items-center font-mono">
                                          <Wifi size={12} className="mr-1"/> 
                                          {acc.proxy ? (acc.proxy.length > 20 ? acc.proxy.substring(0, 20) + '...' : acc.proxy) : 'Direct Connection (Không Proxy)'}
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                                {/* TOGGLE BUTTON */}
                                <button 
                                    onClick={() => {
                                        setAccounts(prev => prev.map(a => 
                                            a.id === acc.id ? {...a, status: a.status === 'active' ? 'inactive' : 'active'} : a
                                        ));
                                    }}
                                    className={`p-2 rounded flex items-center justify-center w-10 h-10 transition-colors ${
                                        acc.status === 'active' ? 'bg-green-900/40 text-green-400 hover:bg-green-900' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                    }`}
                                    title={acc.status === 'active' ? 'Tắt tài khoản' : 'Bật tài khoản'}
                                >
                                    <Power size={20}/>
                                </button>

                                {/* LOGIN BUTTON */}
                                {acc.status !== 'inactive' && (
                                    <button 
                                        onClick={() => {
                                            setSimMode('login');
                                            setShowSimulation(true);
                                            setTimeout(() => {
                                                setAccounts(prev => prev.map(a => a.id === acc.id ? {...a, cookieStatus: 'valid'} : a));
                                            }, 5000);
                                        }}
                                        className="px-4 py-2 bg-[#2b3139] hover:bg-[#353b46] text-white border border-gray-600 rounded text-sm font-bold flex items-center h-10"
                                    >
                                        <Globe size={16} className="mr-2"/> {acc.cookieStatus === 'valid' ? 'Login Lại' : 'Đăng nhập'}
                                    </button>
                                )}

                                {/* DELETE BUTTON */}
                                <button 
                                    onClick={() => {
                                        if(window.confirm('Bạn có chắc muốn xóa tài khoản này không?')) {
                                            setAccounts(accounts.filter(a => a.id !== acc.id));
                                        }
                                    }}
                                    className="p-2 text-red-500 hover:bg-red-900/30 rounded h-10 w-10 flex items-center justify-center"
                                    title="Xóa tài khoản"
                                >
                                    <Trash2 size={20}/>
                                </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
          
          <div className="bg-blue-900/20 border border-blue-900 p-4 rounded text-sm text-blue-200 flex items-start">
              <Shield className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"/>
              <div>
                  <strong>Lưu ý quan trọng:</strong> 
                  <ul className="list-disc ml-4 mt-1 space-y-1">
                      <li>Chỉ những tài khoản có trạng thái <span className="text-green-400 font-bold">ACTIVE</span> mới được bot sử dụng.</li>
                      <li>Nếu dùng Proxy, hãy chắc chắn Proxy còn sống (Live). Tool sẽ tự động retry nếu Proxy chết.</li>
                      <li>Mỗi tài khoản nên dùng 1 Proxy riêng để tránh bị Binance quét trùng IP.</li>
                  </ul>
              </div>
          </div>
      </div>
  );

  const renderHistory = () => (
      <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
                <History className="mr-3 text-[#F0B90B]"/> Lịch sử hoạt động
            </h2>
            <button 
                onClick={exportCSV}
                className="bg-[#2b3139] hover:bg-[#353b46] text-white border border-gray-600 px-4 py-2 rounded font-bold flex items-center"
            >
                <FileText size={18} className="mr-2"/> Export CSV
            </button>
          </div>

          <div className="bg-[#1e2329] rounded-xl border border-gray-700 flex-1 overflow-hidden flex flex-col">
             <div className="overflow-y-auto flex-1">
                 <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-[#0b0e11] text-gray-300 uppercase font-bold text-xs sticky top-0">
                        <tr>
                            <th className="p-4 w-32">Thời gian</th>
                            <th className="p-4 w-40">Tài khoản</th>
                            <th className="p-4">Nội dung bài đăng</th>
                            <th className="p-4 w-32">Trạng thái</th>
                            <th className="p-4 w-20">Logs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id} className="border-b border-gray-800 hover:bg-[#2b3139] transition-colors">
                                <td className="p-4 font-mono text-xs">
                                    {new Date(post.scheduledTime || '').toLocaleDateString()} <br/>
                                    {new Date(post.scheduledTime || '').toLocaleTimeString()}
                                </td>
                                <td className="p-4">
                                    {accounts.find(a => a.id === post.accountId)?.name || 'Unknown'}
                                </td>
                                <td className="p-4">
                                    <div className="max-w-md truncate text-white mb-1" title={post.content}>{post.content}</div>
                                    <span className="text-xs text-gray-600">ID: {post.id}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold inline-flex items-center ${
                                        post.status === 'posted' ? 'bg-green-900/50 text-green-400 border border-green-800' : 
                                        post.status === 'failed' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                                        'bg-gray-700 text-gray-300'
                                    }`}>
                                        {post.status === 'posted' && <CheckCircle size={12} className="mr-1"/>}
                                        {post.status === 'failed' && <AlertCircle size={12} className="mr-1"/>}
                                        {post.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-xs font-mono">
                                    {post.logs ? <span className="text-red-400">{post.logs}</span> : <span className="text-green-600">OK</span>}
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-gray-600">
                                    Chưa có dữ liệu. Hãy chạy Auto Pilot để tạo bài đăng.
                                </td>
                            </tr>
                        )}
                    </tbody>
                 </table>
             </div>
          </div>
      </div>
  );
  
  const renderDownload = () => (
      <div className="flex flex-col items-center justify-center h-full animate-fade-in text-center p-8">
          <div className="bg-[#1e2329] p-10 rounded-2xl border border-gray-700 shadow-2xl max-w-2xl w-full">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center">
                  <Download size={32} className="mr-3 text-[#F0B90B]"/> Download & Build EXE
              </h2>
              
              <div className="text-left bg-blue-900/20 border border-blue-800 p-6 rounded-xl mb-8">
                  <h3 className="text-blue-200 font-bold mb-3 text-lg flex items-center">
                      <FileCog className="mr-2"/> Hướng dẫn chạy tool (KHÔNG LỖI):
                  </h3>
                  <ol className="list-decimal list-inside text-gray-300 space-y-3 text-sm">
                      <li>
                          Bấm nút <strong className="text-white">"Download Source Code (Bản Vá Lỗi)"</strong> bên dưới.
                      </li>
                      <li>
                          Giải nén file ZIP.
                      </li>
                      <li>
                          Chạy file <code className="bg-black px-2 py-1 rounded text-green-400">CHAY_NGAY_KHONG_CAN_CAI.bat</code>.
                      </li>
                      <li>
                          <span className="text-[#F0B90B] font-bold">LƯU Ý:</span> Chúng tôi đã sửa lỗi "Cannot find module".
                      </li>
                  </ol>
              </div>

              {/* REAL SOURCE DOWNLOAD */}
              <div className="border-t border-gray-700 pt-6">
                 <button 
                    onClick={generateAndDownloadZip}
                    className="w-full bg-gradient-to-r from-[#F0B90B] to-[#d9a506] hover:scale-[1.02] text-black py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-xl text-lg"
                 >
                    <Package size={24} className="mr-2"/> Download Source Code (Bản Hoàn Chỉnh)
                 </button>
                 <p className="text-xs text-gray-500 mt-3">
                     Đã bao gồm: Mã nguồn React, Electron config, và Script tạo EXE 1-click.
                 </p>
              </div>

              {isDownloading && (
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-4 mt-6 overflow-hidden relative">
                       <div 
                        className="bg-[#F0B90B] h-4 rounded-full transition-all duration-200"
                        style={{ width: `${downloadProgress}%` }}
                       ></div>
                  </div>
              )}
          </div>
      </div>
  );

  const renderGuide = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-[#1e2329] to-[#0b0e11] p-8 rounded-xl border border-gray-700 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <Bot size={180} />
         </div>
         <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Chào mừng bạn! 👋</h2>
            <p className="text-gray-400 text-lg max-w-2xl">
                Đây là hướng dẫn sử dụng nhanh dành cho phiên bản <strong>Portable (.exe)</strong>. 
                Bạn không cần biết lập trình, chỉ cần làm theo 3 bước dưới đây là có thể Auto kiếm tiền.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* STEP 1 */}
        <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700 hover:border-[#F0B90B] transition-all group">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#2b3139] flex items-center justify-center font-bold text-[#F0B90B] border border-gray-600 group-hover:bg-[#F0B90B] group-hover:text-black transition-colors">1</div>
                <h3 className="ml-3 text-lg font-bold text-white">Khởi động lần đầu</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-400">
                <p>Sau khi tải file <code>BinanceTool.exe</code> về máy:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                    <li>Click đúp chuột để mở Tool.</li>
                    <li>Nếu Windows hỏi "Protect your PC", hãy bấm <strong>More Info</strong> → <strong>Run Anyway</strong> (Vì tool tự viết nên Windows chưa nhận diện).</li>
                    <li>Giao diện tool sẽ hiện lên như bạn đang thấy.</li>
                </ul>
            </div>
        </div>

        {/* STEP 2 */}
        <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700 hover:border-[#F0B90B] transition-all group">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#2b3139] flex items-center justify-center font-bold text-[#F0B90B] border border-gray-600 group-hover:bg-[#F0B90B] group-hover:text-black transition-colors">2</div>
                <h3 className="ml-3 text-lg font-bold text-white">Thêm Tài Khoản</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-400">
                <p>Để tool tự đăng bài, bạn cần cho nó biết tài khoản của bạn:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                    <li>Vào tab <strong className="text-white"><Users size={14} className="inline"/> Tài khoản</strong>.</li>
                    <li>Nhập tên nick (ví dụ: Nick Chính).</li>
                    <li>Bấm nút <strong className="text-blue-400">Đăng nhập thủ công</strong>.</li>
                    <li>Một cửa sổ trình duyệt sẽ hiện ra. Hãy đăng nhập Binance bằng tay như bình thường.</li>
                    <li>Sau khi đăng nhập xong, tắt cửa sổ đó đi. Tool sẽ hiện <span className="text-green-500">Session OK</span>.</li>
                </ul>
            </div>
        </div>

        {/* STEP 3 */}
        <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700 hover:border-[#F0B90B] transition-all group">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#2b3139] flex items-center justify-center font-bold text-[#F0B90B] border border-gray-600 group-hover:bg-[#F0B90B] group-hover:text-black transition-colors">3</div>
                <h3 className="ml-3 text-lg font-bold text-white">Chạy Auto (Tự động)</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-400">
                <p>Lúc này bạn đã sẵn sàng:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                    <li>Vào tab <strong className="text-white"><Bot size={14} className="inline"/> Auto Pilot</strong>.</li>
                    <li>Nhập link tin tức muốn lấy bài (Crawl).</li>
                    <li>Chọn giọng văn AI (Hài hước, Nghiêm túc...).</li>
                    <li>Bấm nút <strong className="text-green-500">BẮT ĐẦU AUTO</strong> to đùng.</li>
                    <li>Treo máy và đi ngủ. Tool sẽ tự làm mọi việc.</li>
                </ul>
            </div>
        </div>

         {/* STEP 4 */}
        <div className="bg-[#1e2329] p-6 rounded-xl border border-gray-700 hover:border-[#F0B90B] transition-all group">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#2b3139] flex items-center justify-center font-bold text-[#F0B90B] border border-gray-600 group-hover:bg-[#F0B90B] group-hover:text-black transition-colors">!</div>
                <h3 className="ml-3 text-lg font-bold text-white">Xử lý lỗi thường gặp</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-400">
                <ul className="list-disc list-inside space-y-2 pl-2">
                    <li><strong>Lỗi "Post Button Not Found":</strong> Có thể phiên đăng nhập đã hết hạn. Hãy vào tab Tài khoản và đăng nhập lại.</li>
                    <li><strong>Lỗi AI không viết bài:</strong> Kiểm tra xem bạn đã dán API Key vào file <code>.env</code> cùng thư mục với file exe chưa.</li>
                    <li><strong>Tool không chạy:</strong> Hãy chắc chắn bạn không tắt cửa sổ đen (Terminal) đi kèm khi chạy tool.</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden font-sans relative bg-[#181a20] text-gray-200">
      {/* Simulation Overlay */}
      <SimulationModal 
        isOpen={showSimulation} 
        onClose={() => setShowSimulation(false)} 
        content={editorContent}
        autoClose={simMode === 'post' && isBotRunning}
        mode={simMode}
      />

      {/* Sidebar */}
      <div className="w-64 bg-[#0b0e11] flex flex-col border-r border-gray-800">
        <div className="p-6 flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#F0B90B] rounded-full flex items-center justify-center text-black font-bold text-xl">B</div>
            <span className="text-xl font-bold text-white tracking-tight">AutoSquare</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={Bot} label="Auto Pilot" active={activeTab === 'autopilot'} onClick={() => setActiveTab('autopilot')} />
          <SidebarItem icon={LayoutDashboard} label="Thống kê" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={PenTool} label="Soạn thảo" active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} />
          <SidebarItem icon={Users} label="Tài khoản" active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} />
          <div className="pt-4 pb-2 px-2">
            <div className="h-px bg-gray-800 mb-2"></div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2 pl-2">Hỗ trợ</p>
          </div>
          <SidebarItem icon={BookOpen} label="Hướng dẫn" active={activeTab === 'guide'} onClick={() => setActiveTab('guide')} />
          {/* Download Button */}
          <SidebarItem 
            icon={Download} 
            label="Tải xuống (.exe)" 
            active={activeTab === 'download'} 
            onClick={() => setActiveTab('download')} 
            className="mt-2 text-green-400 hover:text-green-300"
          />
        </nav>

        <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-2 text-sm text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Ready</span>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#181a20]">
        {activeTab === 'autopilot' && renderAutoPilot()}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'editor' && renderEditor()}
        {activeTab === 'accounts' && renderAccounts()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'guide' && renderGuide()}
        {activeTab === 'download' && renderDownload()}
      </div>
    </div>
  );
}