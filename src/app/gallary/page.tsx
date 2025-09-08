'use client';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";
import Image from 'next/image';
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
      }}
    >
      <Image
        fill
        src={photo.src}
        alt={alt}
        title={title}
        sizes={sizes}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
        onClick={onClick}
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
