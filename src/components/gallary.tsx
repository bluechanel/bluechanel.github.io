'use client';

import Image from 'next/image';
import { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import { Photo } from '@/types/photo';

export default function PhotoGalleryWithLightbox({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((image, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden cursor-pointer group"
            onClick={() => setIndex(idx)} // 2. 点击时设置当前图片的索引
          >
            <div className='relative w-full h-48'>
              <Image
                src={image.src}
                alt={image.description || "生活照片"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{image.description}</p>
            </div>
          </div>
        ))}
      </div>

    <Lightbox
        plugins={[Captions]} 
        open={index > -1}
        close={() => setIndex(-1)}
        index={index}
        slides={photos}
        captions={{
          descriptionTextAlign: "center",
        }}
      />
    </>
  );
}