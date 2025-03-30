const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// बटन कॉन्फिगरेशन (आप इसे अपडेट कर सकते हैं)
let buttonConfig = {
  buttonText: "Click here to go",
  redirectUrl: "https://google.com",
  buttonColor: "#4285F4"
};

// CORS मिडलवेयर - सभी ओरिजिन की अनुमति देता है
app.use(cors());

// JSON पार्सिंग
app.use(express.json());

// मुख्य एंडपॉइंट जो बटन कॉन्फिगरेशन देता है
app.get('/api/button-config', (req, res) => {
  res.json(buttonConfig);
});

// कॉन्फिगरेशन अपडेट करने के लिए एंडपॉइंट (बेसिक सिक्योरिटी के साथ)
app.post('/api/update-config', (req, res) => {
  const { apiKey, newConfig } = req.body;
  
  // बेसिक सिक्योरिटी चेक - वास्तविक एप्लिकेशन में बेहतर सिक्योरिटी का उपयोग करें
  if (apiKey !== 'YOUR_SECRET_API_KEY') {
    return res.status(401).json({ error: 'अनाधिकृत एक्सेस' });
  }
  
  // कॉन्फिगरेशन अपडेट करें
  if (newConfig) {
    if (newConfig.buttonText) buttonConfig.buttonText = newConfig.buttonText;
    if (newConfig.redirectUrl) buttonConfig.redirectUrl = newConfig.redirectUrl;
    if (newConfig.buttonColor) buttonConfig.buttonColor = newConfig.buttonColor;
    
    return res.json({ success: true, message: 'कॉन्फिगरेशन अपडेट हो गया', currentConfig: buttonConfig });
  }
  
  res.status(400).json({ error: 'कोई कॉन्फिगरेशन डेटा नहीं मिला' });
});

// फ्रंटएंड इंटरफेस के लिए बेसिक वेबपेज
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>बटन कॉन्फिगरेशन पैनल</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        input, button {
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
        }
        button {
          background-color: #4285F4;
          color: white;
          border: none;
          padding: 10px;
          cursor: pointer;
          margin-top: 10px;
        }
        .result {
          margin-top: 20px;
          padding: 10px;
          background-color: #f0f0f0;
          border-radius: 4px;
          display: none;
        }
        #preview {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          text-align: center;
        }
        #previewButton {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4285F4;
          color: white;
          border-radius: 4px;
          text-decoration: none;
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <h1>बटन कॉन्फिगरेशन पैनल</h1>
      <p>अपने क्रोम एक्सटेंशन के बटन की सेटिंग यहां अपडेट करें:</p>
      
      <div class="form-group">
        <label for="apiKey">API की (सिक्योरिटी के लिए):</label>
        <input type="password" id="apiKey" placeholder="अपनी एपीआई की यहां डालें">
      </div>
      
      <div class="form-group">
        <label for="buttonText">बटन टेक्स्ट:</label>
        <input type="text" id="buttonText" placeholder="जैसे: Click here to go">
      </div>
      
      <div class="form-group">
        <label for="redirectUrl">रिडायरेक्ट URL:</label>
        <input type="text" id="redirectUrl" placeholder="जैसे: https://google.com">
      </div>
      
      <div class="form-group">
        <label for="buttonColor">बटन का रंग:</label>
        <input type="color" id="buttonColor" value="#4285F4">
      </div>
      
      <button onclick="updateConfig()">अपडेट करें</button>
      
      <div id="result" class="result"></div>
      
      <div id="preview">
        <h3>बटन प्रीव्यू:</h3>
        <a id="previewButton" href="#" target="_blank">Click here to go</a>
      </div>
      
      <script>
        // प्रीव्यू अपडेट करने के लिए
        function updatePreview() {
          const buttonText = document.getElementById('buttonText').value || 'Click here to go';
          const redirectUrl = document.getElementById('redirectUrl').value || '#';
          const buttonColor = document.getElementById('buttonColor').value;
          
          const previewButton = document.getElementById('previewButton');
          previewButton.textContent = buttonText;
          previewButton.href = redirectUrl;
          previewButton.style.backgroundColor = buttonColor;
        }
        
        // इनपुट फील्ड्स पर चेंज लिसनर्स
        document.getElementById('buttonText').addEventListener('input', updatePreview);
        document.getElementById('redirectUrl').addEventListener('input', updatePreview);
        document.getElementById('buttonColor').addEventListener('input', updatePreview);
        
        // कॉन्फिगरेशन अपडेट करने के लिए
        function updateConfig() {
          const apiKey = document.getElementById('apiKey').value;
          const buttonText = document.getElementById('buttonText').value;
          const redirectUrl = document.getElementById('redirectUrl').value;
          const buttonColor = document.getElementById('buttonColor').value;
          
          if (!apiKey) {
            alert('कृपया API की दर्ज करें');
            return;
          }
          
          // कम से कम एक फील्ड भरी होनी चाहिए
          if (!buttonText && !redirectUrl && !buttonColor) {
            alert('कृपया कम से कम एक फील्ड भरें');
            return;
          }
          
          const newConfig = {};
          if (buttonText) newConfig.buttonText = buttonText;
          if (redirectUrl) newConfig.redirectUrl = redirectUrl;
          if (buttonColor) newConfig.buttonColor = buttonColor;
          
          fetch('/api/update-config', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              apiKey,
              newConfig
            }),
          })
          .then(response => response.json())
          .then(data => {
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            
            if (data.error) {
              resultDiv.innerHTML = `<p style="color: red">त्रुटि: ${data.error}</p>`;
            } else {
              resultDiv.innerHTML = `
                <p style="color: green">सफलता: ${data.message}</p>
                <p>वर्तमान कॉन्फिगरेशन:</p>
                <pre>${JSON.stringify(data.currentConfig, null, 2)}</pre>
              `;
              
              // वर्तमान कॉन्फिगरेशन से प्रीव्यू अपडेट करें
              document.getElementById('buttonText').value = data.currentConfig.buttonText;
              document.getElementById('redirectUrl').value = data.currentConfig.redirectUrl;
              document.getElementById('buttonColor').value = data.currentConfig.buttonColor;
              updatePreview();
            }
          })
          .catch(error => {
            document.getElementById('result').innerHTML = `<p style="color: red">त्रुटि: ${error.message}</p>`;
            document.getElementById('result').style.display = 'block';
          });
        }
        
        // वर्तमान कॉन्फिगरेशन लोड करें
        fetch('/api/button-config')
          .then(response => response.json())
          .then(data => {
            document.getElementById('buttonText').value = data.buttonText || '';
            document.getElementById('redirectUrl').value = data.redirectUrl || '';
            document.getElementById('buttonColor').value = data.buttonColor || '#4285F4';
            updatePreview();
          });
      </script>
    </body>
    </html>
  `);
});

// सर्वर स्टार्ट करें
app.listen(port, () => {
  console.log(`सर्वर पोर्ट ${port} पर चल रहा है`);
});
