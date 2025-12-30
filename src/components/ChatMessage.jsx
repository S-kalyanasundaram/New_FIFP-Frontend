import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessage({ sender, text }) {
  const isUser = sender === "user";

  let report = null;
  let forecast = null;
  let alternative = null;

  // Extract Current Financial Analysis JSON
  try {
    const jsonMatch = text.match(/{[\s\S]*"final_report"[\s\S]*}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      report = parsed.final_report;
    }
  } catch (e) {}

  // Extract Future Forecasting JSON
  try {
    const jsonMatch = text.match(/{[\s\S]*"response"[\s\S]*}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      forecast = parsed.response;
    }
  } catch (e) {}

  // Extract Alternative Funds JSON
  try {
    const jsonMatch = text.match(/{[\s\S]*"client_name"[\s\S]*}/);
    if (jsonMatch) {
      alternative = JSON.parse(jsonMatch[0]);
    }
  } catch (e) {}

  const ALL = ["Current Analysis", "Future Forecasting", "Alternative"];

  const getRemaining = () => {
    if (report) return ["Future Forecasting", "Alternative"];
    if (forecast) return ["Current Analysis", "Alternative"];
    if (alternative) return ["Current Analysis", "Future Forecasting"];
    return [];
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`p-3 max-w-[75%] rounded-2xl ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-100"
        }`}
      >
        {!report && !forecast && !alternative && (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {text}
          </ReactMarkdown>
        )}
        {/* Current Financial Analysis */}
        {report && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl">
              <h2 className="font-semibold">{report.greeting}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="text-green-700 font-semibold mb-2">✅ Strengths</h3>
                {report.overall_financial_condition?.strengths?.map((s, i) => (
                  <div key={i} className="bg-white p-2 mb-2 rounded shadow text-sm">
                    ✔ {s}
                  </div>
                ))}
              </div>

              <div className="bg-red-50 p-4 rounded-xl">
                <h3 className="text-red-700 font-semibold mb-2">⚠ Risks</h3>
                {report.overall_financial_condition?.risks?.map((r, i) => (
                  <div key={i} className="bg-white p-2 mb-2 rounded shadow text-sm">
                    ❗ {r}
                  </div>
                ))}
              </div>

            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="text-blue-700 font-semibold mb-2">🚀 Action Steps</h3>
              {report.action_steps?.map((a, i) => (
                <div key={i} className="bg-white p-2 mb-2 rounded shadow text-sm">
                  👉 {a}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Future Forecasting */}
        {forecast && (
          <div className="space-y-5">

            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-xl shadow">
              <h2 className="font-semibold">{forecast.greeting}</h2>
            </div>

            <div className="bg-white border border-blue-200 p-4 rounded-xl shadow">
              <h3 className="text-blue-700 font-semibold mb-2">📊 Financial Forecast</h3>
              <p className="text-gray-700">{forecast.financial_forecast_summary}</p>
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
              <h3 className="text-red-700 font-semibold mb-2">⚠ Risk Warning Signals</h3>
              {forecast.risk_warning_signals?.map((risk, i) => (
                <div key={i} className="bg-white p-2 mb-2 rounded shadow text-sm">
                  {risk}
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <h3 className="text-green-700 font-semibold mb-2">💡 Smart Recommendations</h3>
              {forecast.smart_financial_recommendations?.map((rec, i) => (
                <div key={i} className="bg-white p-2 mb-2 rounded shadow text-sm">
                  {rec}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Alternative Funds */}
        {alternative && (
          <div className="space-y-5">

            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-xl shadow">
              <h2 className="font-semibold">{alternative.greeting}</h2>
            </div>

            {alternative.schemes?.map((scheme, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-4 rounded-xl shadow">
                <h3 className="text-gray-800 font-semibold mb-2">{scheme.scheme_name}</h3>
                <p className="text-gray-600 mb-2">Status: {scheme.status}</p>
                <p className="text-gray-500 italic mb-2">{scheme.note}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {scheme.alternatives?.map((alt, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded shadow text-sm">
                      <h4 className="font-semibold text-gray-700">{alt.fund_name}</h4>
                      <p className="text-gray-600 text-xs">
                        1yr: {alt.CAGR["1yr"]}, 3yr: {alt.CAGR["3yr"]}, 5yr: {alt.CAGR["5yr"]}, 10yr: {alt.CAGR["10yr"]}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>
        )}
        {/* Remaining Questions */}
        {sender === "bot" && (report || forecast || alternative) && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {getRemaining().map((q, i) => (
              <button
                key={i}
                className="bg-gradient-to-r from-[#0b2f22] to-[#145a42] text-white px-4 py-2 rounded-full text-sm hover:scale-105 transition-all"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("send-question", { detail: q })
                  )
                }
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
