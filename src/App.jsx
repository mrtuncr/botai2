import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import nutribot from "../src/assets/nutribot.jpg"

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();
    setAnswer("Cevabınız hazırlanıyor... \n 5-10 sn sürebilir.");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      setAnswer(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );
    } catch (error) {
      console.log(error);
      setAnswer("Bir hata oluştu, lütfen yeniden deneyin.");
    }

    setGeneratingAnswer(false);
  }

  return (
    <>
      <div className="bg-white h-lvh p-3 bg-gradient-to-r from-cyan-500 to-blue-500">
        <form
          onSubmit={generateAnswer}
          className="w-full md:w-2/3 m-auto text-center rounded bg-gray-50 py-2"
        >
          <div>
            <img src={nutribot} height={200} width={200} className="m-auto py-3"/>
            <h1 className="text-2xl text-center mt-2 font-bold">Merhaba, Ben Yapay zeka ile eğitilmiş bir diyetisyen robotuyum.</h1>
            <p><h1 className="text xl text-center">Sağlıklı yaşam için gerekli, ihtiyaca yönelik diyet programlarını, beslenme önerilerini hazırlayabilir ve bunlara yönelik tüm sorularına cevap verebilirim.</h1></p>
          </div>
          
          <textarea
            required
            className="border rounded w-full my-2 min-h-fit p-2 border-solid border-black"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Sorunuzu buraya yazınız"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-300 p-3 rounded-md hover:bg-blue-400 transition-all duration-300"
            disabled={generatingAnswer}
          >
            Gönder
          </button>
        <div className="w-full md:w-2/3 m-auto text-center rounded bg-gray-50 my-1">
          <ReactMarkdown className="p-3">{answer}</ReactMarkdown>
        </div>
        </form>
      </div>
    </>
  );
}

export default App;
