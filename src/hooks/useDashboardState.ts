
import { useState, useEffect } from 'react';

export const useDashboardState = () => {
  const [input, setInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("consultant");
  const [useEmojis, setUseEmojis] = useState(true);
  const [useHashtags, setUseHashtags] = useState(true);
  const [postToLinkedIn, setPostToLinkedIn] = useState(false);

  // Load LinkedIn posting preference from localStorage on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('postToLinkedIn');
    if (savedPreference !== null) {
      setPostToLinkedIn(savedPreference === 'true');
    }
  }, []);

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
    postToLinkedIn,
    setPostToLinkedIn,
    clearInput
  };
};
