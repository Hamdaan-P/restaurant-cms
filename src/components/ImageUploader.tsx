"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { signUpload } from "../../app/admin/actions";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function ImageUploader({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value?: string;
}) {
  const [imageUrl, setImageUrl] = useState(value ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG and WebP images are allowed.");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setError(`That file is ${sizeMb} MB. Please choose an image under 5 MB.`);
      return;
    }

    setUploading(true);
    try {
      const { signature, timestamp, apiKey, cloudName, folder } =
        await signUpload();

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("api_key", apiKey ?? "");
      uploadData.append("timestamp", String(timestamp));
      uploadData.append("signature", signature);
      uploadData.append("folder", folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: uploadData }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result: { secure_url: string } = await response.json();
      setImageUrl(result.secure_url);
    } catch {
      setError("Something went wrong uploading the image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={imageUrl} />

      {imageUrl && (
        <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-md border border-zinc-300">
          <Image
            src={imageUrl}
            alt={label}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        aria-label={imageUrl ? `Replace ${label}` : `Upload ${label}`}
        className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : imageUrl ? "Replace image" : "Upload image"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
