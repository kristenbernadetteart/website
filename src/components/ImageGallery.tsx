import { useState } from "react";

export type GalleryImage = {
  src: string;
  alt: string;
  /** Tina click-to-edit target for this image. */
  field?: string;
};

/**
 * A large image with a row of thumbnails underneath. Clicking a thumbnail
 * shows it in the large view. With a single image, no thumbnails are shown.
 */
export default function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState(0);
  // Images can be removed while editing in Tina; don't point past the end.
  const index = selected < images.length ? selected : 0;
  const current = images[index];

  return (
    <div className="gallery-viewer">
      <div className="mat mat--tall">
        {current && (
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            data-tina-field={current.field}
          />
        )}
      </div>

      {images.length > 1 && (
        <ul className="gallery-viewer__thumbs" aria-label="More images">
          {images.map((img, i) => (
            <li key={`${img.src}-${i}`}>
              <button
                type="button"
                className="gallery-viewer__thumb"
                aria-pressed={i === index}
                aria-label={`Show image ${i + 1} of ${images.length}: ${img.alt}`}
                onClick={() => setSelected(i)}
              >
                <img src={img.src} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
