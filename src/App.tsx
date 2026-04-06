import { useState, useEffect } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Wand2, 
  Layout, 
  Smartphone, 
  Monitor, 
  Download, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight,
  Code2,
  Eye,
  History,
  Trash2,
  Plus
} from "lucide-react";
import { cn } from "./lib/utils";
import LandingPagePreview from "./components/LandingPagePreview";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface GenerationHistory {
  id: string;
  prompt: string;
  code: string;
  timestamp: number;
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lp_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("lp_history", JSON.stringify(history));
  }, [history]);

  const generateLandingPage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a modern, beautiful, and responsive landing page for: "${prompt}".
        
        Requirements:
        1. Use Tailwind CSS classes for styling.
        2. Include sections: Hero, Features, Testimonials, Pricing (optional), and Footer.
        3. Use modern design principles: whitespace, typography, subtle gradients.
        4. Use Lucide icons (represent them with <i> tags or descriptive placeholders if needed, but for this preview, use standard HTML/SVG or emojis for icons).
        5. Add subtle animations using Tailwind's animate-* classes or just clean transitions.
        6. Ensure it's fully responsive.
        7. Use high-quality placeholder images from Unsplash (https://images.unsplash.com/...).
        8. Return ONLY the HTML code inside the <body> tag. Do not include <html>, <head>, or <body> tags themselves.
        
        The output should be a single string of HTML.`,
        config: {
          temperature: 0.7,
        }
      });

      const code = response.text || "";
      setGeneratedCode(code);
      
      const newEntry: GenerationHistory = {
        id: Math.random().toString(36).substr(2, 9),
        prompt,
        code,
        timestamp: Date.now(),
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 10));
      setViewMode("preview");
    } catch (error) {
      console.error("Generation failed", error);
      alert("Failed to generate landing page. Please check your API key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getFullHtml = (bodyCode: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Landing Page</title>
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; }
    </style>
</head>
<body>
    ${bodyCode}
</body>
</html>`;

  const copyToClipboard = () => {
    const fullHtml = getFullHtml(generatedCode);
    navigator.clipboard.writeText(fullHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const fullHtml = getFullHtml(generatedCode);
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "landing-page.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("lp_history");
  };

  const loadFromHistory = (item: GenerationHistory) => {
    setGeneratedCode(item.code);
    setPrompt(item.prompt);
    setShowHistory(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <Layout className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight">LanderAI</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">AI Landing Page Generator</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              "p-2 rounded-full transition-colors relative",
              showHistory ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-100 text-slate-600"
            )}
          >
            <History className="w-5 h-5" />
            {history.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          
          <div className="h-6 w-px bg-slate-200 mx-2" />
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setDeviceMode("desktop")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                deviceMode === "desktop" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setDeviceMode("mobile")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                deviceMode === "mobile" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode("preview")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5",
                viewMode === "preview" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button 
              onClick={() => setViewMode("code")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5",
                viewMode === "code" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code
            </button>
          </div>

          <button 
            disabled={!generatedCode}
            onClick={downloadCode}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Sidebar / Input Area */}
        <aside className="w-80 border-r border-slate-200 bg-white p-6 flex flex-col shrink-0">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              What are you building?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A landing page for a modern coffee shop called 'Bean & Brew' with a minimalist aesthetic..."
              className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm leading-relaxed"
            />
            
            <div className="mt-6 space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggestions</p>
              {[
                "SaaS for project management",
                "Portfolio for a UI/UX designer",
                "E-commerce for organic skincare",
                "Fitness app landing page"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-sm text-slate-600 flex items-center justify-between group"
                >
                  {suggestion}
                  <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateLandingPage}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Page
              </>
            )}
          </button>
        </aside>

        {/* Preview Area */}
        <div className="flex-1 p-8 bg-slate-100 overflow-auto flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!generatedCode && !isGenerating ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-full text-center max-w-md"
              >
                <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">Ready to build?</h2>
                <p className="text-slate-500 leading-relaxed">
                  Enter a prompt on the left to generate a stunning, responsive landing page in seconds.
                </p>
                <div className="mt-8 flex items-center gap-2 text-indigo-600 font-medium text-sm">
                  Start typing <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ) : isGenerating ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-indigo-100 rounded-full animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wand2 className="w-8 h-8 text-indigo-600 animate-bounce" />
                  </div>
                </div>
                <p className="mt-6 text-slate-600 font-medium animate-pulse">Crafting your landing page...</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "transition-all duration-500 ease-in-out h-full w-full max-w-7xl",
                  deviceMode === "mobile" ? "max-w-[375px]" : "w-full"
                )}
              >
                {viewMode === "preview" ? (
                  <LandingPagePreview code={generatedCode} />
                ) : (
                  <div className="w-full h-full bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-800 relative group">
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <button 
                        onClick={copyToClipboard}
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg backdrop-blur-md transition-all"
                        title="Copy Code"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <pre className="p-8 text-slate-300 font-mono text-sm overflow-auto h-full scrollbar-hide">
                      <code>{getFullHtml(generatedCode)}</code>
                    </pre>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History Overlay */}
        <AnimatePresence>
          {showHistory && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHistory(false)}
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-20"
              />
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 w-96 h-full bg-white shadow-2xl z-30 flex flex-col"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg">History</h3>
                  <button 
                    onClick={clearHistory}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Clear History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-3">
                  {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <History className="w-12 h-12 text-slate-200 mb-4" />
                      <p className="text-slate-400 text-sm">No generation history yet.</p>
                    </div>
                  ) : (
                    history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                      >
                        <p className="text-sm font-medium text-slate-700 line-clamp-2 mb-2 group-hover:text-indigo-600">
                          {item.prompt}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
