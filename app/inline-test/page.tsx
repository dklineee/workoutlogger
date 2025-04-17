'use client';

export default function InlineTest() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f7ff', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
        maxWidth: '28rem', 
        width: '100%' 
      }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#2563eb', 
          marginBottom: '1rem' 
        }}>
          Inline Styles Test
        </h1>
        <p style={{ 
          color: '#374151', 
          marginBottom: '1rem' 
        }}>
          This is a test page using inline styles instead of Tailwind CSS.
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          <div style={{ 
            backgroundColor: '#dbeafe', 
            padding: '1rem', 
            borderRadius: '0.375rem', 
            color: '#1e40af' 
          }}>
            Blue Box 1
          </div>
          <div style={{ 
            backgroundColor: '#bfdbfe', 
            padding: '1rem', 
            borderRadius: '0.375rem', 
            color: '#1e40af' 
          }}>
            Blue Box 2
          </div>
        </div>
        <button style={{ 
          width: '100%', 
          backgroundColor: '#2563eb', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '0.375rem', 
          cursor: 'pointer' 
        }}>
          Test Button
        </button>
      </div>
    </div>
  );
} 