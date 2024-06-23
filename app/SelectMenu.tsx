"use client";

import { useEffect, useState } from "react";
import { Twitter } from "lucide-react";
import { toast } from "sonner";

export default function SelectMenu() {
  const [selection, setSelection] = useState<string>();
  const [position, setPosition] = useState<Record<string, number>>();

  function onSelectStart() {
    setSelection(undefined);
  }

  function onSelectEnd() {
    const activeSelection = document.getSelection();
    const text = activeSelection?.toString();

    if (!activeSelection || !text) {
      setSelection(undefined);
      return;
    }

    setSelection(text);

    const rect = activeSelection.getRangeAt(0).getBoundingClientRect();

    setPosition({
      x: rect.left + rect.width / 2 - 140,
      y: rect.top + window.scrollY - 170,
      width: rect.width,
      height: rect.height,
    });
    toast("Share this snippet!", {
      action: {
        label: "Tweet",
        onClick: () => onShare(text),
      },
    });
  }

  useEffect(() => {
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("mouseup", onSelectEnd);
    return () => {
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("mouseup", onSelectEnd);
    };
  }, []);

  function onShare(text?: string) {
    const textToShare = text || selection;
    if (!textToShare) return;
    const message = [
      `"${encodeURIComponent(textToShare.substring(0, 120))}"`,
      encodeURIComponent(window.location.href),
    ].join("%0A%0A");
    const url = `https://twitter.com/intent/tweet?text=${message}`;
    window.open(url, "share-twitter", "width=550, height=550");
  }

  return (
    <div
      role="dialog"
      aria-labelledby="share"
      aria-haspopup="dialog"
      className="relative"
    >
      {selection && position && (
        <p
          className="absolute top-0 left-0 w-[100px] h-[48px]"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          }}
        >
          <button
            className="btn btn-secondary flex-nowrap hover:after:border-t-[#EF46BC] after:transition-all after:duration-200 after:ease-in-out
              after:absolute after:-bottom-[9px] after:left-1/2 after:h-0 after:w-0 after:border-x-8 after:border-x-transparent after:border-t-[10px] after:border-t-[#FF5FD4]
            "
            onClick={() => onShare()}
          >
            Share
            <Twitter className="w-5 h-5" />
          </button>
        </p>
      )}
    </div>
  );
}
