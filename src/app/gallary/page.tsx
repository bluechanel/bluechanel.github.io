'use client';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";
import {
  RenderImageContext,
  RenderImageProps,
  RowsPhotoAlbum,
} from "react-photo-album";
import "react-photo-album/rows.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import photos from '@/data/gallay.json';
import NextJsImage from "@/components/nextjsimage";


// 静态导出下 next/image 的 unoptimized 模式不支持 srcset，直接用原生 <img>
function renderNextImage(
  { alt = "", title, sizes, onClick }: RenderImageProps,
  { photo, width, height }: RenderImageContext,
) {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: `${width} / ${height}`,
        backgroundImage:
          "blurDataURL" in photo ? `url(${photo.blurDataURL})` : undefined,
        backgroundSize: "cover",
      }}
    >
      <img
        src={photo.src}
        srcSet={photo.srcSet?.map((s) => `${s.src} ${s.width}w`).join(", ")}
        sizes={sizes}
        alt={alt}
        title={title}
        loading="lazy"
        decoding="async"
        onClick={onClick}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

export default function Gallary(props: { params: any }) {
  const [index, setIndex] = useState(-1);
  return (
    <div className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16'>
      <RowsPhotoAlbum
        photos={photos}
        render={{ image: renderNextImage }}
        defaultContainerWidth={1200}
        sizes={{
          size: "1168px",
          sizes: [
            { viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" },
          ],
        }}
        onClick={({ index: current }) => setIndex(current)}
      />
      <Lightbox
          plugins={[Captions]} 
          open={index > -1}
          close={() => setIndex(-1)}
          index={index}
          slides={photos}
          render={{ slide: NextJsImage }}
          captions={{
            descriptionTextAlign: "center",
          }}
        />
    </div>
  )
}
