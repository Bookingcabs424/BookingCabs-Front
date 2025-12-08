import React, { useState, useEffect, useRef } from "react";

const botReplies: Record<string, string> = {
  hello: "Hi there! How can I help you with cab booking?",
  hi: "Hello! How can I assist you today?",
  "book a cab": "Sure! Please tell me your pickup and drop location.",
  "how to book a cab":
    "Just type 'book a cab' and share your pickup/drop point.",
  "what are your working hours": "We operate 24/7, every day!",
  "how to contact support":
    "You can call us at 1800-123-456 or email support@bookingcabs.com",
  "check booking status": "Please enter your booking ID to check the status.",
  "cancel my booking": "Please provide your booking ID to cancel.",
  "available car types": "We offer Sedans, SUVs, Hatchbacks, and Luxury Cabs.",
  "how much does it cost":
    "Cab fares depend on distance and type. Please enter pickup and drop locations.",
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    const botMessage =
      botReplies[userMessage.toLowerCase()] ||
      "🤖 Sorry, I didn’t understand that. Please contact support.";

    setMessages((prev) => [...prev, { user: userMessage, bot: botMessage }]);
    setInput("");
  };

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all z-50"
        title="Chat with us"
      >
        💬
      </div>
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border rounded-xl shadow-xl p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-black">
              🚖 BookingCabs Chat
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-red-500 text-xl"
              aria-label="Close chat"
            >
              ✖
            </button>
          </div>

          <div className="h-64 overflow-y-auto bg-gray-100 p-3 rounded-lg mb-3 space-y-2 text-sm">
            {messages.map((msg, index) => (
              <div key={index} className="space-y-1">
                <div className="text-right text-blue-800 bg-blue-100 p-2 rounded-md max-w-[80%] ml-auto">
                  <strong>You:</strong> {msg.user}
                </div>
                <div className="text-left text-green-800 bg-green-100 p-2 rounded-md max-w-[80%]">
                  <strong>Bot:</strong> {msg.bot}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={input}
              placeholder="Ask something..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-grow min-w-0 border border-gray-300 p-2 rounded text-black text-sm"
            />
            <button
              onClick={handleSend}
              className="flex-shrink-0 bg-blue-500 text-white px-4 py-2 text-sm rounded hover:bg-blue-600 whitespace-nowrap"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
