'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Camera, MapPin, Compass } from 'lucide-react';

export function ZoomParallax({ images = [], onImageClick }) {
	const container = useRef(null);
	const [device, setDevice] = useState('desktop'); // 'mobile' | 'tablet' | 'desktop'

	// Device detection
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setDevice('mobile');
			} else if (window.innerWidth < 1024) {
				setDevice('tablet');
			} else {
				setDevice('desktop');
			}
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	// Desktop Transforms
	const dScale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const dScale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const dScale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const dScale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const dScale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	// Tablet Transforms (Reduced Scaling)
	const tScale2 = useTransform(scrollYProgress, [0, 1], [1, 2]);
	const tScale2_5 = useTransform(scrollYProgress, [0, 1], [1, 2.5]);
	const tScale3 = useTransform(scrollYProgress, [0, 1], [1, 3]);
	const tScale3_5 = useTransform(scrollYProgress, [0, 1], [1, 3.5]);
	const tScale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);

	// Select scales based on device
	const scales = device === 'tablet'
		? [tScale2, tScale2_5, tScale3, tScale2_5, tScale3, tScale3_5, tScale4]
		: [dScale4, dScale5, dScale6, dScale5, dScale6, dScale8, dScale9];

	// For Desktop/Tablet, we slice to max 7 images to fit the hardcoded grid positions.
	// For Mobile, we show all filtered images in a swipeable reel.
	const displayImages = device === 'mobile' ? images : images.slice(0, 7);

	// ── MOBILE VIEW ──
	if (device === 'mobile') {
		return (
			<div className="w-full px-4 py-8 flex flex-col gap-6">
				<div 
					className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6"
					style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
				>
					{displayImages.map((photo, index) => (
						<div
							key={index}
							className="flex-shrink-0 w-[82vw] snap-center relative rounded-2xl overflow-hidden border border-white/10 aspect-[3/4] bg-black/40 shadow-2xl"
							onClick={() => onImageClick && onImageClick(photo)}
						>
							<img
								src={photo.src || '/placeholder.svg'}
								alt={photo.alt || `Photo ${index + 1}`}
								className="w-full h-full object-cover"
								loading="lazy"
							/>
							{/* Mobile Static Overlay */}
							<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-5 text-left pointer-events-none">
								<h4 className="text-white font-bold text-lg tracking-wide leading-tight">
									{photo.title || photo.alt}
								</h4>
								{photo.category && (
									<p className="text-[#00f2fe] text-xs font-semibold mt-1 tracking-wider uppercase">
										{photo.category}
									</p>
								)}
								<div className="mt-3 flex flex-col gap-1.5 text-[11px] text-gray-300 border-t border-white/10 pt-2.5">
									{photo.camera && (
										<div className="flex items-center gap-1.5">
											<Camera size={12} className="text-[#a78bfa]" />
											<span>{photo.camera}</span>
										</div>
									)}
									{photo.lens && (
										<div className="flex items-center gap-1.5">
											<Compass size={12} className="text-[#a78bfa]" />
											<span>{photo.lens}</span>
										</div>
									)}
									{photo.location && (
										<div className="flex items-center gap-1.5">
											<MapPin size={12} className="text-[#a78bfa]" />
											<span>{photo.location}</span>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
				<p className="text-center text-xs text-gray-400 opacity-60">← Swipe to explore gallery →</p>
			</div>
		);
	}

	// ── DESKTOP & TABLET VIEW ──
	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				{displayImages.map((photo, index) => {
					const scale = scales[index % scales.length];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 left-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''} `}
						>
							<div 
								className="relative h-[25vh] w-[25vw] group overflow-hidden rounded-xl border border-white/10 shadow-2xl cursor-pointer bg-black/40"
								onClick={() => onImageClick && onImageClick(photo)}
							>
								<img
									src={photo.src || '/placeholder.svg'}
									alt={photo.alt || `Parallax image ${index + 1}`}
									className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								{/* Hover Metadata Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 text-left pointer-events-none">
									<h4 className="text-white font-bold text-sm md:text-base leading-tight drop-shadow-md">
										{photo.title || photo.alt}
									</h4>
									{photo.category && (
										<p className="text-[#00f2fe] text-xs font-semibold mt-0.5 tracking-wider uppercase drop-shadow-sm">
											{photo.category}
										</p>
									)}
									<div className="mt-2 space-y-1 text-[11px] text-gray-300 border-t border-white/10 pt-1.5 backdrop-blur-sm">
										{photo.camera && (
											<div className="flex items-center gap-1.5">
												<Camera size={10} className="text-[#a78bfa]" />
												<span>{photo.camera}</span>
											</div>
										)}
										{photo.lens && (
											<div className="flex items-center gap-1.5">
												<Compass size={10} className="text-[#a78bfa]" />
												<span>{photo.lens}</span>
											</div>
										)}
										{photo.location && (
											<div className="flex items-center gap-1.5">
												<MapPin size={10} className="text-[#a78bfa]" />
												<span>{photo.location}</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
