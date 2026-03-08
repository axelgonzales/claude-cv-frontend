const STORAGE_KEY = 'learn-completed-lessons';

export function getCompletedLessons(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markLessonComplete(moduleSlug: string, lessonSlug: string): void {
  const key = `${moduleSlug}/${lessonSlug}`;
  const completed = getCompletedLessons();
  if (!completed.includes(key)) {
    completed.push(key);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }
}

export function isLessonComplete(moduleSlug: string, lessonSlug: string): boolean {
  return getCompletedLessons().includes(`${moduleSlug}/${lessonSlug}`);
}
