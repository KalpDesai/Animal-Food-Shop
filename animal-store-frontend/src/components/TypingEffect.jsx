import React, { useState, useEffect } from "react";

const TypingEffect = ({
  sentences = ["Welcome!", "Shop for your pets!", "Everything they love in one place!"],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
}) => {
  const [text, setText] = useState("");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentSentence = sentences[sentenceIndex];
    let timeout;

    if (!isDeleting && charIndex <= currentSentence.length) {
      timeout = setTimeout(() => {
        setText(currentSentence.slice(0, charIndex));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
    } else if (isDeleting && charIndex >= 0) {
      timeout = setTimeout(() => {
        setText(currentSentence.slice(0, charIndex));
        setCharIndex(charIndex - 1);
      }, deletingSpeed);
    } else if (!isDeleting && charIndex > currentSentence.length) {
      // Pause before deleting
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && charIndex < 0) {
      // Move to next sentence
      setIsDeleting(false);
      setSentenceIndex((sentenceIndex + 1) % sentences.length);
      setCharIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, sentenceIndex, sentences, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="text-gray-900 text-lg sm:text-xl md:text-2xl font-semibold">
      {text}
      <span className="border-r-2 border-gray-900 animate-blink ml-1"></span>

      {/* Scoped cursor animation */}
      <style>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-start infinite;
        }
      `}</style>
    </span>
  );
};

export default TypingEffect;
