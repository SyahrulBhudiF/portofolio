import {motion, useScroll, useTransform} from 'framer-motion';
import React, {useEffect, useMemo, useState} from 'react';

import cloud1 from '../assets/cloud1.png';
import cloud2 from '../assets/cloud2.png';
import cloud3 from '../assets/cloud3.png';
import cloud4 from '../assets/cloud4.png';

const CloudParallax = () => {
    const {scrollYProgress} = useScroll();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) return null;

    const y1 = useTransform(scrollYProgress, [0, 1], [50, -100]);   // total 150px
    const y2 = useTransform(scrollYProgress, [0, 1], [-40, 80]);    // total 120px
    const y3 = useTransform(scrollYProgress, [0, 1], [60, -90]);    // total 150px
    const y4 = useTransform(scrollYProgress, [0, 1], [-30, 70]);    // total 100px
    const y5 = useTransform(scrollYProgress, [0, 1], [40, -60]);    // total 100px


    const clouds = useMemo(() => {
        return [
            {
                id: 'top-left',
                image: cloud1,
                position: 'left-[1%]',
                top: 'top-[20%]',
                y: y1,
                size: 'w-1/12 max-lg:w-1/6',
            },
            {
                id: 'top-right',
                image: cloud2,
                position: 'right-[2%]',
                top: 'top-[30%]',
                y: y2,
                size: 'w-1/10 max-lg:w-1/6',
            },
            {
                id: 'middle-left',
                image: cloud3,
                position: 'left-[3%]',
                top: 'top-[50%]',
                y: y3,
                size: 'w-1/8 max-lg:w-1/5',
            },
            {
                id: 'middle-right',
                image: cloud4,
                position: 'right-[1%]',
                top: 'top-[60%]',
                y: y4,
                size: 'w-1/12 max-lg:w-1/6',
            },
            {
                id: 'center',
                image: cloud1,
                position: 'left-[45%]',
                top: 'top-[55%]',
                y: y5,
                size: 'w-1/14 max-lg:w-1/8',
            },
        ];
    }, [isMobile, y1, y2, y3, y4, y5]);

    return (
        <div className="absolute w-full h-full overflow-hidden pointer-events-none">
            {clouds.map((cloud) => (
                <motion.div
                    key={cloud.id}
                    className={`absolute z-10 ${cloud.position} ${cloud.top} ${cloud.size}`}
                    style={{
                        y: cloud.y,
                        willChange: 'transform',
                    }}
                    initial={false}
                    transition={{type: 'tween', ease: 'linear', duration: 0}}
                >
                    <img
                        src={cloud.image.src}
                        alt={`cloud-${cloud.id}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto pointer-events-none select-none"
                        draggable={false}
                    />
                </motion.div>
            ))}
        </div>
    );
};

export default CloudParallax;
