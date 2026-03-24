export async function copy (text) {
  if (!navigator?.clipboard) {
    console.warn('Clipboard not supported');
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(`Failed to copy text ${text} `, error);
  }
};

