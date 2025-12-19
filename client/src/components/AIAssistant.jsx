import React, { useState } from "react";
import axios from "axios";

const AIAssistant = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [interpretation, setInterpretation] = useState("");

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setSummary("");
    setColumns([]);
    setRows([]);
    setInterpretation("");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/ai/ask",
        { question },
        { withCredentials: true }
      );

      const { summary, columns, rows } = res.data.result;
      const { interpretation } = res.data;
      
      setSummary(summary);
      setColumns(columns);
      setRows(rows);
      setInterpretation(interpretation);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      askAI();
    }
  };

  const suggestedQuestions = [
    "Which books are due soon?",
    "Show me overdue books",
    "Currently borrowed books",
    "Which users were notified?",
    "What books are available?",
    "Books that are out of stock",
    "Show me total statistics"
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-3 shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">AI Library Assistant</h3>
          <p className="text-sm text-gray-600">Ask intelligent questions about your library data</p>
        </div>
      </div>

      
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Suggested Questions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setQuestion(q)}
              className="text-xs bg-white hover:bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about books, users, or borrowing statistics..."
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors bg-white"
          />
        </div>
        <button
          onClick={askAI}
          disabled={loading || !question.trim()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Ask AI</span>
            </>
          )}
        </button>
      </div>

      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      
      {summary && (
        <div className="space-y-4">
          
          {interpretation && (
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>{interpretation}</span>
            </div>
          )}

          
          <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
            <p className="text-gray-800 leading-relaxed">{summary}</p>
          </div>

          
          {columns.length > 0 && rows.length > 0 && (
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      {columns.map((c, i) => (
                        <th key={i} className="px-6 py-4 text-left text-sm font-semibold text-white">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rows.map((row, ri) => (
                      <tr key={ri} className="hover:bg-blue-50 transition-colors">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-6 py-4 text-sm text-gray-900">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;