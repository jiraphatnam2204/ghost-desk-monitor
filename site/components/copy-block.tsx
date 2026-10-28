"use client";

import * as React from "react";

// A code block with a copy button, for templates teammates paste into a data file.
export function CopyBlock({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <figure className="copy-block">
      <figcaption>
        <span>{label}</span>
        <button type="button" className="text-button" onClick={copy}>
          {copied ? "คัดลอกแล้ว" : "Copy"}
        </button>
      </figcaption>
      <pre>{text}</pre>
    </figure>
  );
}
