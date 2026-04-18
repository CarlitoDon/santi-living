export function showAlert(message: string, title?: string, type?: "error" | "info" | "warning") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent('show-alert', { 
        detail: { message, title, type } 
      })
    );
  } else {
    console.warn("[Alert]", title || "Perhatian", ":", message);
  }
}
