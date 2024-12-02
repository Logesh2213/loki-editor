import React, { useState, useEffect } from 'react';
import './TextEditor.css'; // Import CSS file for styling
import mammoth from 'mammoth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';

const TextEditor = () => {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const [showTableDialog, setShowTableDialog] = useState(false);
  const [tableDimensions, setTableDimensions] = useState({ rows: 2, columns: 2 });

  useEffect(() => {
    // Update word count whenever content changes
    const words = content.trim().split(/\s+/);
    setWordCount(words.length);
  }, [content]);



  const handleContentChange = (e) => {
    // Check if e.target.value is defined before calling trim()
    const newContent = e.target.value ? e.target.value.trim() : '';
    setContent(newContent);
  };

  const formatText = (format, value = null) => {
    document.execCommand(format, false, value);
  };

 



  const handleInsertLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  const handleClearFormatting = () => {
    formatText('removeFormat');
  };


  const handleDrop = (e) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    const { clientX, clientY } = e;
    const targetElement = document.elementFromPoint(clientX, clientY);
    const parentDiv = document.querySelector('.editing-area');
    const range = document.createRange();
    const sel = window.getSelection();

    range.setStart(targetElement, 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    document.execCommand('insertText', false, '\n' + text); // Insert new line before pasted text
    setContent(parentDiv.innerHTML);
  };


  const handleAlignment = (alignment) => {
    formatText(`justify${alignment}`);
  };

 
  const handleInsertTable = () => {
    // Show the table dialog
    setShowTableDialog(true);
  };

  const tableDialog = (
    <div className="table-dialog" style={{ display: showTableDialog ? 'block' : 'none' }}>
      <input
        type="number"
        value={tableDimensions.rows}
        onChange={(e) => setTableDimensions({ ...tableDimensions, rows: parseInt(e.target.value) })}
      />
      <span> x </span>
      <input
        type="number"
        value={tableDimensions.columns}
        onChange={(e) => setTableDimensions({ ...tableDimensions, columns: parseInt(e.target.value) })}
      />
      <button onClick={() => {
        setShowTableDialog(false);
        insertTable(tableDimensions.rows, tableDimensions.columns);
      }}>Insert Table</button>
    </div>
  );

  // Function to insert table with specified dimensions
  const insertTable = (rows, columns) => {
    let tableHTML = '<table style="width: 100%; border: 1px solid black;"><tbody>';
    // Adding rows and columns
    for (let i = 0; i < rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < columns; j++) {
        tableHTML += '<td></td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table>';
    // Update content state with the inserted table
    setContent(content + tableHTML);
  };
  


  return (
    <div className="text-editor">
      {/* Editor Name */}

      {/* Toolbar */}
      <div className="toolbar">
        {/* <input type="file" accept="image/*,.docx" onChange={(e) => handleFileUpload(e.target.files[0])} title="Upload Image or DOCX file" aria-label="Upload Image or DOCX file" /> */}

        <button onClick={() => formatText('bold')} aria-label="Bold"><strong>B</strong></button>
        <button onClick={() => formatText('italic')} aria-label="Italic"><em>I</em></button>
        <button onClick={() => formatText('underline')} aria-label="Underline"><u>U</u></button>
        <button onClick={() => formatText('insertOrderedList')} aria-label="Numbered List"><span role="img" aria-label="Numbered List">1️⃣</span></button>
        <button onClick={() => formatText('insertUnorderedList')} aria-label="Bulleted List"><span role="img" aria-label="Bulleted List">•</span></button>
        <button onClick={() => handleAlignment('Left')} aria-label="Align Left"><span role="img" aria-label="Align Left">🡄</span></button>
        <button onClick={() => handleAlignment('Center')} aria-label="Align Center"><span role="img" aria-label="Align Center">🡆</span></button>
        <button onClick={() => handleAlignment('Right')} aria-label="Align Right"><span role="img" aria-label="Align Right">🡆</span></button>
        <button onClick={() => formatText('insertHorizontalRule')} aria-label="Horizontal Rule">HR</button>
        <button onClick={() => formatText('insertHTML', '<br />')} aria-label="Line Break">Line Break</button>
        <button onClick={() => formatText('strikeThrough')} aria-label="Strikethrough">Strikethrough</button>
       
        <button onClick={handleInsertLink} aria-label="Insert Link">Link</button>
        <button onClick={handleClearFormatting} aria-label="Clear Formatting">Clear Formatting</button>
      
<button onClick={handleInsertTable}>
          <FontAwesomeIcon icon={faTable} />
        </button>      </div>
        {tableDialog}
      {/* Word Count */}
      {/* <div className="word-count">Word Count: {wordCount}</div> */}

      <div
        className="editing-area"
        contentEditable="true"
        onDrop={handleDrop}

        spellCheck="true" // Add this line to enable spell check
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={handleContentChange}
        placeholder="Start typing..."
        aria-label="Text Editor"
      />
    </div>
  );
};

export default TextEditor;
  