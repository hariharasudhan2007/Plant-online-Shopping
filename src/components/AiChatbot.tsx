import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  Plus, 
  ListChecks, 
  Layers, 
  TrendingUp, 
  Sprout,
  Loader2,
  Minimize2,
  Maximize2
} from "lucide-react";
import { ChatMessage, Task, TaskPriority, TaskCategory, Project, CartItem } from "../types";

interface AiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  projects: Project[];
  cart: CartItem[];
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({
  isOpen,
  onClose,
  tasks,
  projects,
  cart,
  onAddTask,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `Hello! I'm **Flora**, your botanical nursery assistant. 🌿

I'm directly synced with your workspace to help you:
- **Organize Tasks**: Structure weekly hydration, repotting, and nutrient feeds.
- **Prioritize Work**: Triage urgent biological alerts before leaf damage occurs.
- **Summarize Progress**: Generate health analytics reports on your botanical spaces.
- **Plant Guidance**: Help you choose the perfect plant or diagnose care issues.

What would you like to accomplish today?`,
      timestamp: "Just now",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addedActionIndices, setAddedActionIndices] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle auto-triggering when an initialPrompt is passed
  useEffect(() => {
    if (initialPrompt && isOpen) {
      sendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt, isOpen]);

  const sendMessage = async (textToSend: string, actionType?: "organize" | "prioritize" | "summarize") => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          context: {
            tasks,
            projects,
            cart: cart.map((c) => ({ name: c.product.name, qty: c.quantity })),
          },
          actionType: actionType || (textToSend.toLowerCase().includes("priorit") ? "prioritize" : textToSend.toLowerCase().includes("summar") ? "summarize" : textToSend.toLowerCase().includes("organize") ? "organize" : undefined),
        }),
      });

      const data = await response.json();
      const replyContent = data.reply || "I'm tending to your plants and ready for your next request!";

      // Parse JSON actions if present in the response
      let suggestedTasks: ChatMessage["suggestedTasks"] = undefined;
      const jsonActionsMatch = replyContent.match(/```json:actions\s*([\s\S]*?)\s*```/);
      if (jsonActionsMatch && jsonActionsMatch[1]) {
        try {
          const parsed = JSON.parse(jsonActionsMatch[1]);
          if (Array.isArray(parsed)) {
            suggestedTasks = parsed;
          }
        } catch (err) {
          console.warn("Failed to parse suggested tasks JSON:", err);
        }
      }

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        role: "assistant",
        content: replyContent.replace(/```json:actions[\s\S]*?```/g, "").trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedTasks,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("AI chat error:", error);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: "assistant",
        content: "I ran into a temporary hiccup connecting with the botanical server. Your tasks and plants remain safe!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestedTask = (msgId: string, idx: number, taskData: any) => {
    const key = `${msgId}-${idx}`;
    if (addedActionIndices[key]) return;

    onAddTask({
      title: taskData.title,
      description: `Flora AI recommendation for ${taskData.project || "Plant Sanctuary"}.`,
      category: (taskData.category as TaskCategory) || "Watering",
      priority: (taskData.priority as TaskPriority) || "medium",
      status: "todo",
      dueDate: taskData.dueDate || "Today",
      projectName: taskData.project || undefined,
    });

    setAddedActionIndices((prev) => ({ ...prev, [key]: true }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-l border-[#cbd7cf] flex flex-col justify-between animate-in slide-in-from-right duration-200 text-[#1b4332]">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#e2ece5] bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-[#d8f3dc]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base leading-tight">
              Flora Botanical AI
            </h3>
            <span className="text-[10px] text-emerald-200 font-medium">
              Task Organizer & Progress Specialist
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Action Suggestion Chips */}
      <div className="px-4 py-2.5 bg-[#f4f7f5] border-b border-[#e2ece5] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => sendMessage("Organize my plant tasks for this week.", "organize")}
          className="px-2.5 py-1 text-xs font-semibold whitespace-nowrap bg-white text-[#2d6a4f] border border-[#cbd7cf] rounded-lg hover:bg-[#eef4f0] transition-colors cursor-pointer flex items-center gap-1"
        >
          <ListChecks className="w-3 h-3 text-[#2d6a4f]" /> Organize Tasks
        </button>

        <button
          onClick={() => sendMessage("Analyze and prioritize my pending work based on plant needs.", "prioritize")}
          className="px-2.5 py-1 text-xs font-semibold whitespace-nowrap bg-white text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1"
        >
          <Layers className="w-3 h-3 text-rose-600" /> Prioritize Work
        </button>

        <button
          onClick={() => sendMessage("Summarize my plant care progress and milestones.", "summarize")}
          className="px-2.5 py-1 text-xs font-semibold whitespace-nowrap bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1"
        >
          <TrendingUp className="w-3 h-3 text-blue-600" /> Summarize Progress
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
        {messages.map((msg) => {
          const isBot = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isBot ? "items-start" : "items-start flex-row-reverse"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isBot ? "bg-[#2d6a4f] text-[#d8f3dc]" : "bg-[#1b4332] text-white"
                }`}
              >
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] space-y-2`}>
                <div
                  className={`p-3.5 rounded-2xl ${
                    isBot
                      ? "bg-[#f4f7f5] text-[#1b4332] border border-[#e2ece5] rounded-tl-xs"
                      : "bg-[#2d6a4f] text-white rounded-tr-xs"
                  }`}
                >
                  <div className="prose prose-xs max-w-none prose-emerald whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                  <span
                    className={`block text-[9px] mt-1.5 ${
                      isBot ? "text-gray-400" : "text-emerald-200"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Interactive Task Suggestion Cards (if provided by Flora) */}
                {msg.suggestedTasks && msg.suggestedTasks.length > 0 && (
                  <div className="bg-[#eef5f0] border border-[#cbe0d3] rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1b4332]">
                      <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" /> Suggested Tasks Ready to Import
                    </div>

                    <div className="space-y-1.5">
                      {msg.suggestedTasks.map((st, sIdx) => {
                        const isAdded = addedActionIndices[`${msg.id}-${sIdx}`];
                        return (
                          <div
                            key={sIdx}
                            className="bg-white p-2 rounded-lg border border-[#cbd7cf] flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <h5 className="font-semibold text-xs text-[#1b4332] truncate">
                                {st.title}
                              </h5>
                              <span className="text-[10px] text-gray-500">
                                {st.category} • Due {st.dueDate || "Today"}
                              </span>
                            </div>

                            <button
                              onClick={() => handleAddSuggestedTask(msg.id, sIdx, st)}
                              disabled={isAdded}
                              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                                isAdded
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-[#2d6a4f] hover:bg-[#1b4332] text-white shadow-xs"
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Added
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" /> Add Task
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#52796f] p-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#2d6a4f]" />
            <span>Flora is analyzing plant records & organizing response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3.5 border-t border-[#e2ece5] bg-[#f8faf8]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputText);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Flora to organize, prioritize, or summarize..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#cbd7cf] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2d6a4f] text-[#1b4332]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white disabled:opacity-50 transition-colors cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-gray-400 text-center mt-1.5">
          Flora uses live workspace data to optimize your botanical care schedules.
        </p>
      </div>
    </div>
  );
};
