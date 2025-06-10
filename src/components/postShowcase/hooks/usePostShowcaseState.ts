
import { useState, useEffect } from 'react';

export const usePostShowcaseState = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [postsCreated, setPostsCreated] = useState(247);

  useEffect(() => {
    const activityInterval = setInterval(() => {
      setCurrentActivity(prev => (prev + 1) % 5); // 5 activities
    }, 4000);

    return () => clearInterval(activityInterval);
  }, []);

  useEffect(() => {
    // Simulate live counter for posts created
    const postsInterval = setInterval(() => {
      setPostsCreated(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(postsInterval);
  }, []);

  return {
    currentActivity,
    postsCreated
  };
};
