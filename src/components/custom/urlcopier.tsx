"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";

const UrlCopier = ({
  url = "https://example.com/share-link",
  iconOnly = false,
}: {
  url?: string;
  iconOnly?: boolean;
}) => {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

const copyToClipboard = () => {
  if (iconOnly) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  } else if (inputRef.current) {
    inputRef.current.select();
    navigator.clipboard.writeText(inputRef.current.value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
};

  return (
    <>
      {iconOnly ? (
        <Button
          onClick={copyToClipboard}
          variant="ghost"
          className="flex items-center space-x-2"
          aria-label={copied ? "URL copied" : "Copy URL"}
        >
          <Copy className="w-4 h-4" />
        </Button>
      ) : (
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <Input
              ref={inputRef}
              value={url}
              readOnly
              className="flex-grow"
              aria-label="URL to share"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="flex items-center space-x-2"
              aria-label={copied ? "URL copied" : "Copy URL"}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
          {copied && (
            <p className="mt-2 text-sm text-green-600" role="status">
              URL copied to clipboard!
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default UrlCopier;
