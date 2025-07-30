import React, { useState } from 'react';

function App() {
  const [contacts, setContacts] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const lines = evt.target.result.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const contactList = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, i) => {
          obj[header] = values[i]?.trim();
          return obj;
        }, {});
      });
      setContacts(contactList);
    };
    reader.readAsText(file);
  };

  const handleSendEmails = async () => {
    const response = await fetch('http://localhost:3001/send-emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacts, subject, message })
    });
    const result = await response.json();
    alert(result.status || result.error);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>CRM App</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} /><br /><br />
      <input type="text" placeholder="Email Subject" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%' }} /><br /><br />
      <textarea placeholder="Email Message (use {{Name}})" rows="6" value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: '100%' }} /><br /><br />
      <button onClick={handleSendEmails}>Send Emails</button>
    </div>
  );
}

export default App;
