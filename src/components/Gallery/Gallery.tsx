export interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

export interface GalleryProps {
  images: GalleryImage[];
}

/**
 * The `.storySlider` strip of attachments inside a story.
 *
 * The site drives this with Swiper; this package has no slider dependency, so
 * the track is a plain horizontally scrollable row. The markup and styling are
 * the site's, so dropping a slider library on top of it needs no changes here.
 */
export function Gallery({ images }: GalleryProps) {
  return (
    <div className="storySlider">
      <div className="swiper-gallery" style={{ overflowX: 'auto' }}>
        <div className="swiper-wrapper" style={{ display: 'flex', gap: 16 }}>
          {images.map((image) => (
            <div className="swiper-slide" key={image.src} style={{ flex: '0 0 auto' }}>
              <div className="storySlider__slide">
                <figure className="image">
                  <picture className="storySlider__img">
                    <img src={image.src} alt={image.alt ?? ''} loading="lazy" />
                  </picture>
                  <figcaption className="image__figcaption">{image.caption}</figcaption>
                </figure>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
