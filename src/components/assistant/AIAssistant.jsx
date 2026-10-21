
import React, { useEffect, useRef, useState } from "react";

const AIAssistant = () => {
    const [sessionId] = useState(() => crypto.randomUUID());

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hi! Welcome to Arfat's portfolio. 👋 May I know your name?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, isLoading]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
            playPopupSound();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const playPopupSound = () => {
        try {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) return;

            const audioContext = new AudioContextClass();

            audioContext.resume().then(() => {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();

                oscillator.type = "sine";
                oscillator.frequency.value = 880;

                gain.gain.setValueAtTime(
                    0.001,
                    audioContext.currentTime
                );
                gain.gain.linearRampToValueAtTime(
                    0.06,
                    audioContext.currentTime + 0.04
                );
                gain.gain.linearRampToValueAtTime(
                    0.001,
                    audioContext.currentTime + 0.25
                );

                oscillator.connect(gain);
                gain.connect(audioContext.destination);

                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.26);

                oscillator.onended = () => audioContext.close();
            }).catch(() => { });
        } catch (error) {
            console.log("Popup sound unavailable:", error);
        }
    };

    const sendMessage = async (event) => {
        event.preventDefault();

        const text = input.trim();

        if (!text || isLoading) return;

        setMessages((previous) => [
            ...previous,
            { role: "user", text },
        ]);

        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5001/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sessionId: sessionId,
                        message: text,
                        history: messages
                            .filter(
                                (msg) =>
                                    msg.role === "user" ||
                                    msg.role === "assistant"
                            )
                            .map((msg) => ({
                                role:
                                    msg.role === "assistant"
                                        ? "model"
                                        : "user",
                                parts: [{ text: msg.text }],
                            })),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to get AI response");
            }

            const data = await response.json();

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    text:
                        data.reply ||
                        "Sorry, I couldn't generate a reply.",
                },
            ]);
        } catch (error) {
            console.error("AI chat error:", error);

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    text: "Sorry, I couldn't connect right now. Please try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-4 sm:right-6 z-50 font-sans">

            {/* PREMIUM GLASS CHAT WINDOW */}
            {isOpen ? (
                <section
                    aria-label="AI Assistant chat"
                    className="flex w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-[26px] border border-lime-300/20 bg-[#071009]/95 text-white shadow-[0_20px_80px_rgba(0,0,0,0.65),0_0_35px_rgba(124,255,91,0.09)] backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                    {/* GLASS HEADER */}
                    <header className="relative overflow-hidden border-b border-lime-300/15 bg-gradient-to-br from-[#17351b]/90 via-[#0d1b10]/95 to-[#081009] p-4">
                        <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full bg-lime-400/10 blur-3xl" />

                        <div className="relative flex items-center gap-3">
                            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-lime-300/30 bg-gradient-to-br from-[#294e2c] to-[#0b170d] text-2xl shadow-[0_0_22px_rgba(124,255,91,0.12)]">
                                ✨
                                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-[3px] border-[#0d1b10] bg-lime-400" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-base font-semibold tracking-wide text-white">
                                    AI Assistant
                                </h3>
                                <p className="mt-1 flex items-center gap-1.5 text-xs text-green-100/65">
                                    <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(124,255,91,0.8)]" />
                                    Here to help you
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close assistant"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-green-100/70 transition duration-200 hover:border-lime-300/30 hover:bg-lime-300/10 hover:text-lime-200 active:scale-90"
                            >
                                ×
                            </button>
                        </div>
                    </header>

                    {/* CHAT MESSAGES */}
                    <div
                        className="flex h-[min(350px,45vh)] min-h-[220px] flex-col gap-4 overflow-y-auto bg-gradient-to-b from-[#09120a]/90 to-[#050906]/95 p-4 [scrollbar-color:#345b35_transparent] [scrollbar-width:thin]"
                        aria-live="polite"
                    >
                        <p className="text-center text-[10px] font-medium uppercase tracking-[0.22em] text-green-100/35">
                            Your portfolio guide
                        </p>

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex max-w-[90%] flex-col gap-1 ${message.role === "user"
                                        ? "self-end items-end"
                                        : "self-start items-start"
                                    }`}
                            >
                                <span className="px-1 text-[10px] tracking-wide text-green-100/40">
                                    {message.role === "user"
                                        ? "You"
                                        : "AI Assistant"}
                                </span>

                                <div
                                    className={`whitespace-pre-wrap break-words rounded-2xl border px-3.5 py-3 text-sm leading-relaxed ${message.role === "user"
                                            ? "rounded-br-md border-lime-300/25 bg-gradient-to-br from-[#28572b] to-[#17371c] text-white shadow-[0_5px_18px_rgba(0,0,0,0.2)]"
                                            : "rounded-bl-md border-white/[0.09] bg-white/[0.045] text-green-50/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-xl"
                                        }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div
                                role="status"
                                aria-label="AI is typing"
                                className="self-start rounded-2xl rounded-bl-md border border-lime-300/15 bg-[#142318]/80 px-4 py-3"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-green-100/65">
                                        Thinking
                                    </span>
                                    {[0, 1, 2].map((dot) => (
                                        <span
                                            key={dot}
                                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime-300"
                                            style={{
                                                animationDelay: `${dot * 150}ms`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* MESSAGE INPUT */}
                    <form
                        onSubmit={sendMessage}
                        className="border-t border-lime-300/10 bg-[#080e09]/95 p-3"
                    >
                        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-1.5 transition-all duration-300 focus-within:border-lime-300/35 focus-within:shadow-[0_0_20px_rgba(124,255,91,0.07)]">
                            <input
                                ref={inputRef}
                                id="assistant-message"
                                name="assistantMessage"
                                type="text"
                                autoComplete="off"
                                value={input}
                                onChange={(event) =>
                                    setInput(event.target.value)
                                }
                                placeholder="Write a message..."
                                aria-label="Your message"
                                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-green-100/30"
                            />

                            <button
                                type="submit"
                                aria-label="Send message"
                                disabled={isLoading || !input.trim()}
                                className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-lime-300/20 bg-gradient-to-br from-[#356b32] to-[#1b4221] px-3 text-sm font-semibold text-lime-50 shadow-[0_3px_12px_rgba(0,0,0,0.25)] transition duration-200 hover:border-lime-200/40 hover:from-[#427e3b] hover:to-[#28552a] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Send
                                <span aria-hidden="true">↗</span>
                            </button>
                        </div>

                        <p className="mt-3 text-center text-[10px] tracking-wide text-green-100/35">
                            <span className="text-lime-300/70">✦</span>
                            {" "}Powered by AI · Built for curious minds
                        </p>
                    </form>
                </section>
            ) : (
                /* FLOATING GLASS BUTTON */
                <button
                    type="button"
                    onClick={() => {
                        playPopupSound();
                        setIsOpen(true);
                    }}
                    aria-label="Open AI Assistant"
                    className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-lime-300/30 bg-[#08110a]/90 px-3.5 py-3 text-white shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_22px_rgba(124,255,91,0.09)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-lime-300/65 hover:shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_30px_rgba(124,255,91,0.2)] active:scale-95"
                >
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-lime-300/[0.06] via-transparent to-green-300/[0.06] opacity-70 transition-opacity group-hover:opacity-100" />

                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lime-300/30 bg-gradient-to-br from-[#254a29] to-[#0b170d] text-xl shadow-[inset_0_0_12px_rgba(124,255,91,0.08)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
                        ✨
                        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0b170d] bg-lime-400 shadow-[0_0_8px_rgba(124,255,91,0.65)]" />
                    </span>

                    <span className="relative text-sm font-semibold tracking-wide transition-colors group-hover:text-lime-200">
                        Chat with AI
                    </span>

                    <span className="relative h-2 w-2 shrink-0 rounded-full bg-lime-400 shadow-[0_0_9px_rgba(124,255,91,0.75)]" />
                </button>
            )}
        </div>
    );
};

export default AIAssistant;
