// Monaco loader config
require.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs" } });

(function() {
  // ----- INSERT YOUR JUDGE0 RAPIDAPI KEY HERE -----
  const RAPIDAPI_KEY = '48a606867dmsh31b61f549a7ce65p1eacebjsn867a819d8678';
  // -----------------------------------------------
  let editor;
  const languageMap = {
    python: { id: 71, monaco: 'python', default: `print('Hello, world!')` },
    javascript: { id: 63, monaco: 'javascript', default: `console.log('Hello, world!')` },
    cpp: { id: 54, monaco: 'cpp', default: `#include <iostream>\nint main() {\n  std::cout << "Hello, world!\\n" << std::flush;\n  return 0;\n}` },
    c: { id: 50, monaco: 'c', default: `#include <stdio.h>\nint main() {\n  printf("Hello, world!\\n");\n  fflush(stdout);\n  return 0;\n}` },
    java: { id: 62, monaco: 'java', default: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}'}
  };

  // UI Elements
  const langSelect = document.getElementById('language-select');
  const runBtn = document.getElementById('run-button');
  const output = document.getElementById('output');

  // Init Monaco
  require(["vs/editor/editor.main"], function() {
    const langInfo = languageMap[langSelect.value];
    editor = monaco.editor.create(document.getElementById("monaco-editor"), {
      value: langInfo.default,
      language: langInfo.monaco,
      theme: "vs-dark",
      fontSize: 15,
      minimap: { enabled: false }
    });
  });

  langSelect.addEventListener('change', function() {
    const langKey = langSelect.value;
    const langInfo = languageMap[langKey];
    if (editor) {
      monaco.editor.setModelLanguage(editor.getModel(), langInfo.monaco);
      editor.setValue(langInfo.default);
    }
    output.innerText = '';
  });

  runBtn.addEventListener('click', async function() {
    output.innerText = 'Running...';
    const source_code = editor.getValue();
    const langKey = langSelect.value;
    const langInfo = languageMap[langKey];
    // Judge0 API (public, RapidAPI key required)
    const reqBody = {
      source_code,
      language_id: langInfo.id,
      stdin: '',
      redirect_stderr_to_stdout: true
    };

    try {
      // submit for execution
      const resp = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': RAPIDAPI_KEY
        },
        body: JSON.stringify(reqBody)
      });
      const data = await resp.json();
      let result = '';
      if (data.stdout) {
        result += `Output:\n${data.stdout}\n`;
      }
      if (data.stderr) {
        result += `Runtime Error:\n${data.stderr}\n`;
      }
      if (data.compile_output) {
        result += `Compilation Output:\n${data.compile_output}\n`;
      }
      if (data.message) {
        result += `Message:\n${data.message}\n`;
      }
      if (!result.trim()) {
        result = 'No output (did your code run? Check for errors or output statements.)';
      }
      output.innerText = result;
    } catch (e) {
      output.innerText = 'Error running code: ' + e.toString();
    }
  });
})();
