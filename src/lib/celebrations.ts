import confetti from 'canvas-confetti';

export const celebrateLessonComplete = () => {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.9 },
  });
};

export const celebrateModuleComplete = () => {
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
  });
  confetti({
    particleCount: 80,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
  });
};

export const celebrateCourseComplete = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 30,
      spread: 100,
      startVelocity: 30,
      origin: { x: Math.random(), y: Math.random() * 0.3 },
    });
  }, 150);
};
