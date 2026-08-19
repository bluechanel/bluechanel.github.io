import {
  RenderSlideProps,
  isImageFitCover,
  useLightboxProps,
  useLightboxState,
  isImageSlide,
  Slide,
} from "yet-another-react-lightbox";

// src/data/gallay.json 里的相册图片结构
type GallerySlide = {
  src: string;
  width: number;
  height: number;
  srcSet?: { src: string; width: number; height: number }[];
  blurDataURL?: string;
};

function isGallerySlide(slide: Slide): slide is GallerySlide {
  return (
    isImageSlide(slide) &&
    typeof slide.width === "number" &&
    typeof slide.height === "number"
  );
}

export default function NextJsImage({ slide, offset, rect }: RenderSlideProps) {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps();

  const { currentIndex } = useLightboxState();

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

  if (!isGallerySlide(slide)) return undefined;

  const width = !cover
    ? Math.round(
        Math.min(rect.width, (rect.height / slide.height) * slide.width)
      )
    : rect.width;

  const height = !cover
    ? Math.round(
        Math.min(rect.height, (rect.width / slide.width) * slide.height)
      )
    : rect.height;

  const srcSet = slide.srcSet
    ?.map((s) => `${s.src} ${s.width}w`)
    .join(", ");

  return (
    <div style={{ position: "relative", width, height }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: slide.blurDataURL
            ? `url(${slide.blurDataURL})`
            : undefined,
          backgroundSize: "cover",
        }}
      />
      <img
        src={slide.src}
        srcSet={srcSet}
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
        alt=""
        loading="eager"
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: cover ? "cover" : "contain",
          cursor: click ? "pointer" : undefined,
        }}
        onClick={
          offset === 0 ? () => click?.({ index: currentIndex }) : undefined
        }
      />
    </div>
  );
}
