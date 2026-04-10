import Image from 'next/image';

export default function MediaFrame({
  src,
  alt,
  variant = 'tall',
  className = '',
  priority = false,
  sizes,
}) {
  const variantClass =
    variant === 'wide' ? 'media-frame--wide' : variant === 'hero' ? 'media-frame--hero' : 'media-frame--tall';

  return (
    <div className={`media-frame ${variantClass} ${className}`.trim()}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || '(max-width: 900px) 100vw, 560px'}
        className="media-frame-img"
        priority={priority}
      />
    </div>
  );
}
