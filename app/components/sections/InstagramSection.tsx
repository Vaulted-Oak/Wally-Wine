import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { SectionDefaultProps } from '~/lib/type';
import type { INSTAGRAM_SECTION_FRAGMENT } from '~/qroq/sections';
import { TypeFromSelection } from 'groqd';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '../ui/Carousel';
import Grid from '../grid/grid';

type ImageBannerSectionProps = TypeFromSelection<
    typeof INSTAGRAM_SECTION_FRAGMENT
>;

declare const Instafeed: any;
export function InstagramSection(
    props: SectionDefaultProps & { data: ImageBannerSectionProps },
) {
    const { data } = props;
    const [images, setImages] = useState<{ type: string; image: string; link: string; id: string }[]>([]);
    const [loading, setLoading] = useState(true); // Loading state to manage loading phase
    const sectionRef = useRef<HTMLDivElement | null>(null); // Ref to track when the section is in view

    // Async function to load the script
    const loadInstafeedScript = async (scriptId: string) => {
        return new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src =
                'https://cdn.jsdelivr.net/gh/stevenschobert/instafeed.js@2.0.0rc1/src/instafeed.min.js';
            script.defer = true;

            // Resolve when script is loaded
            script.onload = () => {
                resolve();
            };

            // Reject if there's an error loading the script
            script.onerror = (error) => {
                console.error("Error loading Instafeed script:", error);
                reject(error);
            };

            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        // Intersection Observer setup
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start fetching the images when the section is visible
                    fetchImages();
                    observer.disconnect(); // Disconnect observer once it's in view
                }
            });
        }, { threshold: 0.25 }); // Trigger when 25% of the section is visible

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect(); // Clean up observer when component is unmounted
        };
    }, []);

    const fetchImages = async () => {
        if (data?.accessToken) {
            try {
                const scriptId = 'instafeed-script';
                if (!document.getElementById(scriptId)) {
                    await loadInstafeedScript(scriptId);
                }
                const userFeed = new Instafeed({
                    get: 'user',
                    limit: 8,
                    target: 'instafeed-container',
                    resolution: 'standard_resolution',
                    accessToken: data.accessToken,
                    filter: function (image: { id: string; type: string; image: string; link: string }) {
                        if (
                            (image.type === 'image' || image.type === "video") &&
                            !images.some((img) => img.id === image.id) // Check uniqueness with state
                        ) {
                            setImages((prev) => [...prev, image]); // Update state with new image
                        }
                        return image.type === 'image' || image.type === "video";
                    },
                    after: function () {
                        // Lazy load images
                        const images = document.querySelectorAll('#instafeed-container img');
                        images.forEach((img) => {
                            img.setAttribute('loading', 'lazy');
                        });

                        setLoading(false); // Set loading state to false after images are loaded
                    },
                    error: function (error: string) {
                        console.error('Instafeed error:', error);
                        setLoading(false);
                    },
                });
                await userFeed.run();
            } catch (error) {
                console.error('Error fetching Instagram feed:', error);
                setLoading(false);
            }
        } else {
            console.error('No access token provided.');
            setLoading(false);
        }
    };

    function removeDuplicates(images: { type: string; image: string; link: string; id: string }[]) {
        const uniqueImages: { type: string; image: string; link: string; id: string }[] = [];
        const seenIds = new Set();

        images.forEach(image => {
            if (!seenIds.has(image.id)) {
                seenIds.add(image.id);
                uniqueImages.push(image);
            }
        });

        return uniqueImages;
    }

    const uniqueImages = removeDuplicates(images);

    return (
        <div ref={sectionRef}>
            {loading ? (
                <div className="container text-center py-8">
                    <div className="section-header text-center flex justify-between mb-[30px]">
                        <h2 className="md:text-[32px] text-[20px] tracking-[2px] uppercase">Follow Us</h2>
                        <Link target="_blank" to="https://www.instagram.com/wallysofficial/" className="flex gap-[10px] items-center text-primaryGreen md:text-[20px] text-[16px]">
                            <span>
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.0063 7.67589C10.9557 7.67589 7.68848 10.9431 7.68848 14.9937C7.68848 19.0443 10.9557 22.3116 15.0063 22.3116C19.0569 22.3116 22.3242 19.0443 22.3242 14.9937C22.3242 10.9431 19.0569 7.67589 15.0063 7.67589ZM15.0063 19.7513C12.3887 19.7513 10.2488 17.6177 10.2488 14.9937C10.2488 12.3698 12.3824 10.2362 15.0063 10.2362C17.6303 10.2362 19.7639 12.3698 19.7639 14.9937C19.7639 17.6177 17.6239 19.7513 15.0063 19.7513ZM24.3304 7.37655C24.3304 8.32551 23.5661 9.08341 22.6235 9.08341C21.6746 9.08341 20.9167 8.31914 20.9167 7.37655C20.9167 6.43395 21.6809 5.66969 22.6235 5.66969C23.5661 5.66969 24.3304 6.43395 24.3304 7.37655ZM29.1771 9.10889C29.0688 6.82246 28.5466 4.79715 26.8716 3.1285C25.2029 1.45985 23.1776 0.937606 20.8912 0.822966C18.5347 0.68922 11.4716 0.68922 9.11511 0.822966C6.83505 0.931237 4.80975 1.45349 3.13473 3.12213C1.45971 4.79078 0.943832 6.81609 0.829192 9.10252C0.695445 11.459 0.695445 18.5221 0.829192 20.8786C0.937463 23.165 1.45971 25.1903 3.13473 26.859C4.80975 28.5276 6.82868 29.0499 9.11511 29.1645C11.4716 29.2983 18.5347 29.2983 20.8912 29.1645C23.1776 29.0562 25.2029 28.534 26.8716 26.859C28.5402 25.1903 29.0625 23.165 29.1771 20.8786C29.3109 18.5221 29.3109 11.4654 29.1771 9.10889ZM26.1328 23.407C25.636 24.6553 24.6743 25.617 23.4196 26.1202C21.5408 26.8653 17.0826 26.6934 15.0063 26.6934C12.9301 26.6934 8.46549 26.859 6.59303 26.1202C5.34473 25.6234 4.38303 24.6617 3.87989 23.407C3.13473 21.5282 3.30669 17.07 3.30669 14.9937C3.30669 12.9175 3.1411 8.45289 3.87989 6.58044C4.37666 5.33214 5.33836 4.37044 6.59303 3.86729C8.47185 3.12213 12.9301 3.29409 15.0063 3.29409C17.0826 3.29409 21.5472 3.1285 23.4196 3.86729C24.6679 4.36407 25.6296 5.32577 26.1328 6.58044C26.8779 8.45926 26.706 12.9175 26.706 14.9937C26.706 17.07 26.8779 21.5346 26.1328 23.407Z" fill="#00461C" />
                                </svg>
                            </span>
                            <span>
                                @WallysOfficial
                            </span>
                        </Link>
                    </div>
                    <Grid>
                        <Grid.Item className="animate-pulse bg-gray-100 dark:bg-gray-100" />
                    </Grid>
                    <div id="instafeed-container" className='hidden'></div>
                </div>
            ) : (
                <Carousel
                    opts={{
                        active: true,
                        loop: false,
                    }}
                    style={
                        {
                            '--slides-per-view': 5,
                        } as React.CSSProperties
                    }
                    className="container mt-[60px]"
                >
                    <div className="section-header text-center flex justify-between mb-[30px]">
                        <h2 className="md:text-[32px] text-[20px] tracking-[2px] uppercase">Follow Us</h2>
                        <Link target="_blank" to="https://www.instagram.com/wallysofficial/" className="flex gap-[10px] items-center text-primaryGreen md:text-[20px] text-[16px]">
                            <span>
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.0063 7.67589C10.9557 7.67589 7.68848 10.9431 7.68848 14.9937C7.68848 19.0443 10.9557 22.3116 15.0063 22.3116C19.0569 22.3116 22.3242 19.0443 22.3242 14.9937C22.3242 10.9431 19.0569 7.67589 15.0063 7.67589ZM15.0063 19.7513C12.3887 19.7513 10.2488 17.6177 10.2488 14.9937C10.2488 12.3698 12.3824 10.2362 15.0063 10.2362C17.6303 10.2362 19.7639 12.3698 19.7639 14.9937C19.7639 17.6177 17.6239 19.7513 15.0063 19.7513ZM24.3304 7.37655C24.3304 8.32551 23.5661 9.08341 22.6235 9.08341C21.6746 9.08341 20.9167 8.31914 20.9167 7.37655C20.9167 6.43395 21.6809 5.66969 22.6235 5.66969C23.5661 5.66969 24.3304 6.43395 24.3304 7.37655ZM29.1771 9.10889C29.0688 6.82246 28.5466 4.79715 26.8716 3.1285C25.2029 1.45985 23.1776 0.937606 20.8912 0.822966C18.5347 0.68922 11.4716 0.68922 9.11511 0.822966C6.83505 0.931237 4.80975 1.45349 3.13473 3.12213C1.45971 4.79078 0.943832 6.81609 0.829192 9.10252C0.695445 11.459 0.695445 18.5221 0.829192 20.8786C0.937463 23.165 1.45971 25.1903 3.13473 26.859C4.80975 28.5276 6.82868 29.0499 9.11511 29.1645C11.4716 29.2983 18.5347 29.2983 20.8912 29.1645C23.1776 29.0562 25.2029 28.534 26.8716 26.859C28.5402 25.1903 29.0625 23.165 29.1771 20.8786C29.3109 18.5221 29.3109 11.4654 29.1771 9.10889ZM26.1328 23.407C25.636 24.6553 24.6743 25.617 23.4196 26.1202C21.5408 26.8653 17.0826 26.6934 15.0063 26.6934C12.9301 26.6934 8.46549 26.859 6.59303 26.1202C5.34473 25.6234 4.38303 24.6617 3.87989 23.407C3.13473 21.5282 3.30669 17.07 3.30669 14.9937C3.30669 12.9175 3.1411 8.45289 3.87989 6.58044C4.37666 5.33214 5.33836 4.37044 6.59303 3.86729C8.47185 3.12213 12.9301 3.29409 15.0063 3.29409C17.0826 3.29409 21.5472 3.1285 23.4196 3.86729C24.6679 4.36407 25.6296 5.32577 26.1328 6.58044C26.8779 8.45926 26.706 12.9175 26.706 14.9937C26.706 17.07 26.8779 21.5346 26.1328 23.407Z" fill="#00461C" />
                                </svg>
                            </span>
                            <span>
                                @WallysOfficial
                            </span>
                        </Link>
                    </div>
                    <div>
                        <div id="slider-container" className="insta-section">
                            <CarouselContent>
                                {uniqueImages?.map((img, index) => (
                                    <CarouselItem className="[&>span]:h-full" key={index}>
                                        <Link target="_blank" to={img.link}>
                                            <img
                                                src={img.image}
                                                alt={`Instagram post ${index + 1}`}
                                                className="md:h-[530px] h-[265px] w-full flex-shrink-0"
                                                loading="lazy"
                                            />
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </div>
                        <div id="instafeed-container" className='hidden'></div>
                    </div>
                </Carousel>
            )}
        </div>
    );
}
