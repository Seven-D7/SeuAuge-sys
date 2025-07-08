import React from 'react';

function TestPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#1ab894', fontSize: '2rem', marginBottom: '20px' }}>
        Teste de Funcionamento
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#333' }}>
        Se você está vendo esta mensagem, o React está funcionando!
      </p>
      <div style={{ 
        backgroundColor: '#1ab894', 
        color: 'white', 
        padding: '10px 20px', 
        borderRadius: '8px',
        display: 'inline-block',
        marginTop: '20px'
      }}>
        Botão de Teste
      </div>
    </div>
  );
}

export default TestPage;

