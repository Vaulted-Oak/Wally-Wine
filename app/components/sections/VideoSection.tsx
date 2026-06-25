import React, {lazy, useEffect, useState, useCallback, Suspense} from 'react';
import imageUrlBuilder from '@sanity/image-url';
import type {TypeFromSelection} from 'groqd';
import type {SectionDefaultProps} from '~/lib/type';
import type {VIDEO_SECTION_FRAGMENT} from '~/qroq/sections';
import {useRootLoaderData} from '~/root';
import type {PortableTextBlock} from '@portabletext/types';
import {ImageUrlBuilder} from 'sanity';
import {useNavigate} from 'react-router';
const Blog = React.lazy(() => import('../sanity/richtext/BannerRichtext'));

type VideoSectionProps = TypeFromSelection<typeof VIDEO_SECTION_FRAGMENT>;
interface VideoSection {
  _id: string;
  url: string;
}
interface SanityRoot {
  data: {
    videoSection: VideoSection[];
  };
}

export function VideoSection(
  props: SectionDefaultProps & {data: VideoSectionProps},
) {
  const {data} = props;
  const videoUrl = getVideoUrl(data); // Memoize video URL
  const {fileUrl, imageUrl} = videoUrl || {};
  const navigation = useNavigate();

  const [isVideoInViewport, setIsVideoInViewport] = useState(false);
  const handleVideoIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setIsVideoInViewport(true); // Start loading video when it enters the viewport
      }
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleVideoIntersection, {
      rootMargin: '200px',
    });
    const videoElement = document.getElementById('videoElement');
    if (videoElement) {
      observer.observe(videoElement);
    }
    return () => observer.disconnect();
  }, [handleVideoIntersection]);

  const preloadVideo = useCallback(() => {
    if (fileUrl && isVideoInViewport) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = fileUrl;
    }
  }, [fileUrl, isVideoInViewport]);

  useEffect(() => {
    preloadVideo();
  }, [preloadVideo]);

  const handleButtonClick = useCallback((route: string) => {
    navigation(route);
  }, [navigation]);

  return (
    <div className="relative h-screen md:h-[1024px]" id="videoElement">
      <link rel="preload" href={imageUrl} as="image" />
      {!isVideoInViewport && (
        <div
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        ></div>
      )}

      {isVideoInViewport && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          preload="metadata"
          poster={imageUrl}
        >
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {isVideoInViewport && (
        <div className="mainBannerContent absolute inset-0 flex items-center justify-center">
          <Suspense fallback={null}>
            <div>
              <svg
                width="482"
                height="193"
                viewBox="0 0 482 193"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M468.084 0C469.441 1.16653 471.186 2.33306 472.349 3.69401C474.676 6.41592 475.063 9.13782 472.931 12.443C467.115 20.9975 459.36 27.4135 451.218 33.635C447.147 36.7457 443.076 39.8564 439.005 42.9672C436.872 44.5226 434.934 46.2724 432.22 46.4668C430.863 46.6612 429.118 47.4389 428.342 45.4947C427.567 43.7449 428.342 42.5784 429.893 41.4118C434.74 37.7178 439.199 33.4405 443.464 29.1633C452.188 20.2199 459.942 10.3043 467.115 0C467.503 0 467.697 0 468.084 0Z"
                  fill="white"
                />
                <path
                  d="M272.67 191.894C272.67 192.283 272.67 192.478 272.476 192.866C270.925 192.866 269.18 192.866 267.629 192.866C267.823 192.478 267.629 192.283 267.435 191.894C269.374 191.894 270.925 191.894 272.67 191.894Z"
                  fill="white"
                />
                <path
                  d="M471.961 78.1576C470.604 77.5743 468.86 76.019 467.696 77.1855C466.339 78.5464 467.696 80.2962 468.472 81.6572C469.829 83.7958 470.023 84.9624 467.115 85.5456C458.391 87.4898 449.861 87.4898 439.974 87.101C448.892 76.2134 453.35 63.576 464.013 55.4103C465.37 54.2437 467.696 53.2716 466.145 50.7441C464.788 48.4111 462.85 46.6613 459.748 47.6334C455.871 48.7999 452.381 50.7441 449.085 53.0772C445.208 55.9935 441.331 59.1043 437.26 61.4373C413.221 75.2413 389.569 89.6285 366.693 105.182C363.979 106.932 361.265 108.682 357.97 110.626C357.97 109.459 357.776 109.071 357.97 108.876C368.438 97.7942 379.101 86.7122 392.09 78.1576C394.998 76.2134 397.324 73.8803 398.487 70.5751C399.069 68.6309 399.456 67.0756 397.712 65.3258C396.161 63.7704 394.416 63.576 392.477 64.3537C389.763 65.5202 387.243 66.8811 384.917 68.6309C373.673 76.4078 361.459 82.6293 348.664 87.6843C342.267 90.2117 335.675 92.3504 328.502 91.9615C329.084 88.8508 331.41 87.101 333.349 85.3512C338.196 81.0739 343.624 77.7688 349.052 74.2692C352.348 72.1305 352.348 69.4086 349.246 67.0756C347.113 65.5202 344.981 65.3258 342.461 66.2979C338.777 67.6588 335.675 69.7975 332.38 71.7417C322.686 77.7687 312.993 83.7958 302.331 88.0731C298.066 89.8229 293.801 91.1839 288.566 91.1839C291.087 86.1289 295.352 83.2126 299.229 80.4907C315.126 69.603 331.41 58.9098 347.307 48.0222C356.225 41.8007 365.918 36.5513 374.448 29.5522C378.907 25.8581 378.519 23.1362 373.479 20.4143C371.152 19.0534 369.408 20.4143 367.663 21.3864C348.083 31.1075 330.247 43.5505 313.381 57.3545C298.841 69.4086 282.751 78.5464 265.497 86.1289C264.527 86.5177 263.364 86.9066 262.395 87.101C261.619 87.2954 260.65 87.101 260.262 86.5177C259.681 85.9345 260.456 85.1568 260.844 84.3791C263.364 80.6851 266.854 77.9632 270.343 75.4357C285.659 64.9369 300.974 54.6326 316.289 44.1338C324.237 38.69 333.155 34.6071 340.328 28.1912C342.461 26.247 345.562 24.3028 342.654 20.6088C340.134 17.3036 337.42 17.1092 333.931 19.2478C328.115 22.9418 321.911 26.247 316.095 29.941C293.219 44.7171 272.088 62.0206 249.988 77.7688C242.039 83.407 234.285 89.0452 224.979 92.156C223.428 92.5448 221.49 93.5169 220.52 92.156C219.551 90.6006 221.296 89.2396 222.265 88.0731C226.336 83.407 231.958 80.4907 236.611 76.7966C241.458 72.9082 241.458 72.3249 236.805 68.2421C235.836 68.0477 234.866 67.8532 233.897 68.0477C236.999 67.4644 240.294 66.8811 243.59 66.4923C243.59 60.0764 241.845 58.3266 236.029 59.2987C225.755 61.0485 215.286 61.8262 204.817 62.6039C195.706 63.1871 186.207 65.1313 177.87 59.1043C177.483 58.7154 176.513 58.7154 176.126 58.9098C172.442 60.0764 169.34 62.4094 166.045 64.5481C163.912 66.1035 164.494 68.2421 164.688 70.1863C164.882 71.5473 163.718 72.1305 162.943 72.9082C153.25 82.6293 142.781 91.5727 130.955 98.5719C127.078 100.905 123.007 103.238 117.579 103.432C121.262 97.2109 125.915 92.5448 130.762 88.0731C139.098 80.2962 148.403 73.4915 156.158 65.1313C158.484 62.6039 159.26 60.2708 156.739 57.5489C154.413 55.0214 152.087 53.0772 148.403 55.6047C145.495 57.5489 142.2 58.9098 139.292 61.0485C119.905 74.658 99.3557 86.3233 78.0307 96.8221C72.2148 99.7384 66.5928 102.655 59.226 103.627C61.5523 100.322 63.8787 97.9886 66.3989 96.0444C89.2748 78.7409 112.151 61.6317 137.353 47.6334C140.261 45.8836 143.169 44.1338 145.689 41.8007C148.791 38.69 148.403 35.9681 144.526 33.8294C142.781 32.8573 140.649 32.2741 138.516 32.0796C133.088 31.6908 127.66 32.4685 122.232 33.4406C84.0405 40.8286 45.8494 48.0222 7.46442 55.4103C4.9442 55.7991 2.42397 55.7991 0.679199 58.1322C0.679199 59.1043 0.679199 60.0764 0.679199 61.0485C4.16874 69.603 10.7601 68.2421 17.5453 66.4923C30.3403 63.1871 43.1353 60.0764 56.1242 57.5489C76.286 53.6605 96.4478 49.3832 116.61 45.3003C117.579 45.1059 118.548 44.7171 117.773 46.2724C116.222 47.2445 114.865 48.4111 113.314 49.1888C93.1521 62.0206 73.7657 76.019 54.961 90.6006C50.5021 94.1002 46.0433 97.5998 43.3292 102.849C39.8396 109.654 43.1353 115.487 50.696 116.459C55.5426 117.042 60.0014 115.681 64.2664 113.931C79.1939 107.904 93.5398 100.711 107.886 93.3225C109.243 92.5448 110.6 90.795 113.314 92.5448C111.375 94.2946 109.63 95.85 108.08 97.4053C106.335 99.1551 104.59 100.711 103.039 102.655C99.3557 107.321 99.3557 111.209 103.233 115.681C106.335 119.569 110.018 118.403 113.702 117.042C116.028 116.07 117.967 114.903 120.099 113.737C139.679 103.238 157.321 90.2117 174.381 76.019C175.932 74.658 177.289 72.9082 179.615 72.9082C185.043 72.9082 190.665 72.9082 197.451 72.9082C195.124 74.2692 193.961 74.8524 192.798 75.4357C186.4 78.7409 180.585 82.8237 176.513 88.8508C173.218 93.7113 173.218 101.488 176.32 105.377C178.84 108.487 183.299 108.487 190.084 105.182C190.665 104.988 191.247 104.599 191.829 104.405C196.094 101.877 200.552 99.3496 204.817 96.8221C206.95 95.4611 207.919 95.6556 208.889 98.3775C211.409 105.377 212.96 105.96 220.133 103.821C228.081 101.488 235.06 97.0165 241.845 92.5448C244.172 90.9894 245.529 90.9894 246.11 93.9058C246.886 98.5719 249.988 99.1552 253.865 99.1552C257.354 98.9607 260.456 97.9886 263.558 96.4332C268.792 93.9058 273.833 91.1839 279.067 88.2675C278.873 89.4341 278.873 90.4062 278.679 91.3783C278.098 98.183 280.812 100.905 287.791 100.127C289.342 99.9328 290.893 99.544 292.444 99.1552C300.004 97.2109 306.984 93.9058 313.963 90.6006C316.289 89.6285 317.646 88.8508 317.452 92.7392C317.258 100.516 320.942 103.627 328.696 102.071C338.002 100.127 346.726 96.4332 355.449 92.7392C357.97 91.5727 360.49 90.6006 363.786 89.0452C363.204 90.4062 363.204 90.9894 362.816 91.1839C344.205 107.904 326.951 125.985 309.116 143.483C294.964 157.093 278.098 167.008 262.589 178.674C255.804 183.729 255.997 187.034 263.752 190.728C264.915 191.311 266.078 191.505 267.435 191.894C268.792 192.672 270.343 192.089 271.894 192.283C274.802 192.089 276.353 189.95 278.292 188.2C293.801 173.23 308.147 157.093 325.982 144.455C348.083 128.902 370.765 114.126 392.865 98.5719C395.967 96.4332 397.324 97.4053 399.263 100.322C408.18 114.126 413.221 116.653 426.21 104.405C429.118 101.683 432.413 99.7384 436.29 99.1552C442.106 98.3775 448.116 97.5998 453.932 97.2109C461.299 96.8221 468.666 96.2388 475.839 93.5169C478.553 92.5448 480.879 91.1839 481.655 88.2675C481.655 86.9066 481.655 85.74 481.655 84.3791C478.165 82.4349 475.645 79.3241 471.961 78.1576ZM204.43 86.7122C199.971 89.2396 195.318 91.1839 190.084 91.7671C190.084 90.2117 191.053 89.4341 191.829 88.8508C199.195 83.2126 206.756 77.5743 215.286 73.6859C220.327 71.5473 225.561 69.7975 230.989 68.6309C229.632 69.2142 228.275 69.9919 227.112 70.964C219.745 76.7966 212.378 82.2405 204.43 86.7122ZM411.864 97.0165C414.772 96.6277 417.292 95.85 420.2 96.6277C416.904 100.905 415.159 100.905 411.864 97.0165ZM436.097 77.5743C429.118 88.4619 422.72 91.3783 409.925 89.0452C409.537 89.0452 409.15 88.6564 408.374 88.0731C418.261 80.8795 428.536 74.8524 439.198 69.603C439.78 69.2142 440.362 69.0198 440.943 69.603C441.913 70.5751 440.943 70.964 440.555 71.5473C439.392 73.4915 437.648 75.4357 436.097 77.5743Z"
                  fill="white"
                />
              </svg>
              <div className="splash-video max-w-[975px] p-8 text-center text-white">
                <Blog value={data.content as PortableTextBlock[]} />
                {data.buttons && data.buttons.length > 0 && (
                  <div className="mx-auto flex min-h-[90px] max-w-[800px] flex-wrap justify-center gap-[20px] md:min-h-[115px]">
                    {data.buttons
                      .filter((button) => button.isVisible !== false)
                      .map((button) => (
                        <button
                          key={button._key || button.label}
                          className="h-[47px] w-[277px] bg-[#00461b] p-3 text-[18px] uppercase text-white duration-300 hover:bg-white hover:text-primaryGreen md:h-[89px] md:text-[22px]"
                          onClick={() => handleButtonClick(button.route)}
                        >
                          {button.label}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </Suspense>
        </div>
      )}
    </div>
  );
}

function getVideoUrl(data: VideoSectionProps) {
  const rootData = useRootLoaderData();
  const {sanityRoot, env} = rootData || {};
  const config = {
    dataset: env.SANITY_STUDIO_DATASET,
    projectId: env.SANITY_STUDIO_PROJECT_ID,
  };
  const urlBuilder = imageUrlBuilder({
    dataset: env.SANITY_STUDIO_DATASET,
    projectId: env.SANITY_STUDIO_PROJECT_ID,
  })
    .image({
      _ref: data?.placeholderImage?.asset?._ref,
    })
    .auto('format');
  const urlDefault = generateImageUrl({
    urlBuilder,
    width: 1440,
  });
  const videoData = (sanityRoot as SanityRoot)?.data?.videoSection?.find(
    (video: VideoSection) => video._id === data?.videos?.asset?._ref,
  );
  return videoData ? {fileUrl: videoData.url, imageUrl: urlDefault} : null;
}

function generateImageUrl(args: {
  aspectRatioHeight?: number;
  aspectRatioWidth?: number;
  blur?: number;
  urlBuilder: ImageUrlBuilder;
  width: number;
}) {
  const {
    aspectRatioHeight,
    aspectRatioWidth,
    blur = 0,
    urlBuilder,
    width,
  } = args;
  let imageUrl = urlBuilder.width(width);
  const imageHeight =
    aspectRatioHeight && aspectRatioWidth
      ? Math.round((width / aspectRatioWidth) * aspectRatioHeight)
      : undefined;

  if (imageHeight) {
    imageUrl = imageUrl.height(imageHeight);
  }

  if (blur && blur > 0) {
    imageUrl = imageUrl.blur(blur);
  }

  return imageUrl.url();
}
