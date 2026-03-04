/**
 * Safe copy-to-clipboard utility
 * Uses the modern Clipboard API with fallback for older browsers
 */

/**
 * Copy text to clipboard
 *
 * @param text - The text to copy
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) {
    return false;
  }

  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    return fallbackCopyToClipboard(text);
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback copy method using textarea selection
 */
function fallbackCopyToClipboard(text: string): boolean {
  // Create a temporary textarea element
  const textArea = document.createElement("textarea");

  // Set styling to be invisible but focused
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  textArea.value = text;

  // Add to DOM
  document.body.appendChild(textArea);

  try {
    // Focus and select the text
    textArea.focus();
    textArea.select();

    // Try to execute copy command
    const successful = document.execCommand("copy");
    return successful;
  } catch (err) {
    console.error("Fallback copy failed:", err);
    return false;
  } finally {
    // Clean up
    document.body.removeChild(textArea);
  }
}

/**
 * Check if clipboard API is available
 */
export function isClipboardSupported(): boolean {
  return !!(
    navigator.clipboard &&
    navigator.clipboard.writeText &&
    typeof navigator.clipboard.writeText === "function"
  );
}
