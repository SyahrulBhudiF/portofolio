import React from 'react';
import {motion, useScroll, useTransform} from 'motion/react';
import {useRef} from 'react';

const MountainSVG: React.FC = () => {
    const ref = useRef(null);
    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    // const y1 = useTransform(scrollYProgress, [0, 1], [0, 50]);
    // const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    // const y3 = useTransform(scrollYProgress, [0, 1], [0, 150]);

    return (
        <div className="absolute bottom-0 w-full h-full max-md:bottom-5 max-sm:bottom-8 overflow-hidden z-0" ref={ref}>
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                className="absolute bottom-0 w-full"
                // style={{y: y1}}
            >
                <path
                    d="M0,64 L360,128 L720,64 L1080,160 L1440,64 V320 H0 Z"
                    fill="url(#gradient1)"
                />
                <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#111827"/>
                        <stop offset="100%" stopColor="#1F2937"/>
                    </linearGradient>
                </defs>
            </motion.svg>

            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                className="absolute bottom-0 w-full"
                // style={{y: y2}}
            >
                <path
                    d="M0,128 L360,96 L720,192 L1080,128 L1440,128 V320 H0 Z"
                    fill="url(#gradient2)"
                />
                <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1F2937"/>
                        <stop offset="100%" stopColor="#111827"/>
                    </linearGradient>
                </defs>
            </motion.svg>

            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
                className="absolute bottom-0 w-full"
                // style={{y: y3}}
            >
                <path
                    d="M0,192 L360,160 L720,224 L1080,192 L1440,192 V320 H0 Z"
                    fill="url(#gradient3)"
                />
                <defs>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1F2937"/>
                        <stop offset="100%" stopColor="#000000"/>
                    </linearGradient>
                </defs>
            </motion.svg>
        </div>
    );
};

export default MountainSVG;
