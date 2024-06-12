import { useState, useRef } from 'react';
import './App.css';
import { requestGroq } from './utils/groq';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

function App() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const topRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const ai = await requestGroq(inputValue);
    setResponses(prevResponses => [{ input: inputValue, response: ai }, ...prevResponses]);
    setInputValue(""); // Clear the input field
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className='flex flex-col min-h-screen justify-start items-center max-w-xl w-full mx-auto'>
      <div ref={topRef}></div> {/* Empty div for scrolling to top */}
      <h1 className='text-4xl text-white'>NGAB AI</h1>
      <form className='form flex flex-col gap-4 py-4 w-full' onSubmit={handleSubmit}>
        <input
          className='py-2 px-4 text-md rounded-md'
          id='content'
          type='text'
          placeholder='Ketik disini'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className={`bg-indigo-500 py-2 px-4 font-bold text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed button-loading' : ''}`}
          type='submit'
          disabled={loading}
        >
          {loading ? '' : 'Kirim'}
        </button>
      </form>
      <div className='max-w-xl w-full mx-auto'>
        {responses.map((response, index) => (
          <div key={index} className="fade-in mt-10">
            <p className='text-md text-white'>{response.input}</p>
            <SyntaxHighlighter language="swift" style={darcula} wrapLongLines={true}>{response.response}</SyntaxHighlighter>
          </div>
        ))}
      </div>
      {responses.length > 0 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-full shadow-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
        >
          Kembali ke Atas
        </button>
      )}
    </main>
  );
}

export default App;
