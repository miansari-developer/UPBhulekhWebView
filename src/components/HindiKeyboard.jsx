import React from 'react';

const HindiKeyboard = ({ inputRef, value, onChange }) => {
  const keyboardRows = [
    // Row 1 (Matras)
    ['\u093E', '\u0940', '\u093F', '\u0941', '\u0942', '\u0947', '\u0948', '\u094B', '\u094C', '\u0902'],
    // Row 2 (Vowels)
    ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'],
    // Row 3 (Consonants)
    ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'],
    // Row 4 (Consonants)
    ['ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न'],
    // Row 5 (Consonants)
    ['प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श'],
    // Row 6 (Consonants + special)
    ['ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ', 'ऋ', 'श्र', 'space', 'backspace']
  ];

  const handleKeyClick = (key, e) => {
    // Prevent the button from stealing focus from the text input
    e.preventDefault();

    let newValue = value;
    const input = inputRef?.current;

    if (input) {
      input.blur(); // Dismiss the native mobile keyboard
    }

    if (key === 'backspace') {
      if (input) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        if (start !== end) {
          newValue = value.substring(0, start) + value.substring(end);
          onChange(newValue);
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(start, start);
          }, 0);
        } else if (start > 0) {
          newValue = value.substring(0, start - 1) + value.substring(end);
          onChange(newValue);
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(start - 1, start - 1);
          }, 0);
        }
      } else {
        newValue = value.slice(0, -1);
        onChange(newValue);
      }
    } else {
      const charToInsert = key === 'space' ? ' ' : key;
      if (input) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        newValue = value.substring(0, start) + charToInsert + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          input.focus();
          input.setSelectionRange(start + charToInsert.length, start + charToInsert.length);
        }, 0);
      } else {
        newValue = value + charToInsert;
        onChange(newValue);
      }
    }
  };

  const getDisplayLabel = (key) => {
    if (key === 'space') return '␣';
    if (key === 'backspace') return '⌫';
    const matras = ['\u093E', '\u0940', '\u093F', '\u0941', '\u0942', '\u0947', '\u0948', '\u094B', '\u094C', '\u0902'];
    if (matras.includes(key)) {
      return `\u25CC${key}`;
    }
    return key;
  };

  return (
    <div className="hindi-keyboard-container">
      <div className="hindi-keyboard-grid">
        {keyboardRows.flat().map((key, index) => {
          const isSpecial = key === 'space' || key === 'backspace';
          return (
            <button
              key={`${key}-${index}`}
              className={`hindi-keyboard-key ${isSpecial ? 'special-key' : ''}`}
              onMouseDown={(e) => handleKeyClick(key, e)}
              type="button"
            >
              {getDisplayLabel(key)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HindiKeyboard;
