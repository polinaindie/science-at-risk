import { useRef, useState, type DragEvent } from 'react';
import { Button } from '@/components/Button';
import { cabinetCopy, type CabinetLocale } from './cabinetCopy';
import { Modal } from './parts';

/** The rules the site sets for a photo. Kept as plain numbers so the Go side can check the same. */
export const PHOTO_MAX_BYTES = 10 * 1024 * 1024;
export const PHOTO_MIN_SIDE = 420;
const TYPES = ['image/jpeg', 'image/png'];

/**
 * “Change photo”: drop a file or pick one, see how it will be cropped, read the
 * advice, save. Nothing is uploaded here — it hands back a local preview URL.
 */
export function PhotoDialog({
  locale,
  current,
  onSave,
  onClose,
}: {
  locale: CabinetLocale;
  current: string;
  onSave: (src: string) => void;
  onClose: () => void;
}) {
  const t = cabinetCopy[locale].photoDialog;
  const input = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [over, setOver] = useState(false);

  // A chosen file is released only when another replaces it: a saved one lives on as the profile photo.
  const latest = useRef<string | null>(null);

  const take = (file?: File) => {
    if (!file) return;
    setError('');
    if (!TYPES.includes(file.type)) return setError(t.errType);
    if (file.size > PHOTO_MAX_BYTES) return setError(t.errSize);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (Math.min(img.naturalWidth, img.naturalHeight) < PHOTO_MIN_SIDE) {
        URL.revokeObjectURL(url);
        setError(t.errSmall(PHOTO_MIN_SIDE));
        return;
      }
      if (latest.current) URL.revokeObjectURL(latest.current);
      latest.current = url;
      setSrc(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError(t.errRead);
    };
    img.src = url;
  };

  const drop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    take(e.dataTransfer.files[0]);
  };

  return (
    <Modal
      title={t.title}
      onClose={onClose}
      actions={
        <>
          <Button variant="black" type="button" disabled={!src} onClick={() => src && onSave(src)}>
            {t.save}
          </Button>
          <Button variant="bordered" type="button" onClick={onClose}>
            {t.cancel}
          </Button>
        </>
      }
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={drop}
        data-testid="photo-drop"
        className={`flex flex-col items-center gap-3 border-2 border-dashed border-brand-black p-6 text-center ${
          over ? 'bg-brand-accent-blue' : 'bg-white'
        }`}
      >
        <img
          src={src ?? current}
          alt=""
          className="aspect-square w-[160px] object-cover"
          title={src ? t.preview : undefined}
        />
        {src ? <p className="m-0 font-mono text-breadcrumbs text-brand-muted">{t.preview}</p> : null}
        <p className="m-0 font-bold">{t.drop}</p>
        <p className="m-0 font-mono text-breadcrumbs text-brand-muted">{t.or}</p>
        <Button variant="bordered" type="button" onClick={() => input.current?.click()}>
          {src ? t.another : t.choose}
        </Button>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          tabIndex={-1}
          aria-label={t.choose}
          data-testid="photo-input"
          onChange={(e) => {
            take(e.currentTarget.files?.[0]);
            e.currentTarget.value = '';
          }}
        />
      </div>
      <p role="alert" className={error ? 'mt-3 bg-brand-accent-yellow px-3 py-2 font-mono text-text1-mobile' : 'sr-only'}>
        {error}
      </p>

      <h3 className="mt-6 mb-2 font-mono text-[16px] font-bold">{t.tipsTitle}</h3>
      <ul className="m-0 list-disc space-y-1 pl-5 text-[16px] leading-[22px]">
        {t.tips.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </Modal>
  );
}
