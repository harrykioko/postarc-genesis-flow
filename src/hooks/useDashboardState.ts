
import { useState } from 'react';

export const useDashboardState = () => {
  const [input, setInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("consultant");
  const [useEmojis, setUseEmojis] = useState(true);
  const [useHashtags, setUseHashtags] = useState(true);

  const clearInput = () => setInput("");

  return {
    input,
    setInput,
    selectedTemplate,
    setSelectedTemplate,
    useEmojis,
    setUseEmojis,
    useHashtags,
    setUseHashtags,
    clearInput
  };
};
