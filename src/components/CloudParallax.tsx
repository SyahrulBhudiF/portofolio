import {motion, useScroll, useTransform} from 'motion/react';
import React from 'react';
import cloud1 from '../assets/cloud1.png';
import cloud2 from '../assets/cloud2.png';
import cloud3 from '../assets/cloud3.png';
import cloud4 from '../assets/cloud4.png';

const CloudParallax = () => {
    const {scrollYProgress} = useScroll();

    const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 400]);
    const y3 = useTransform(scrollYProgress, [0, 1], [10, 800]);
    const y4 = useTransform(scrollYProgress, [0, 1], [20, 1500]);
    const y5 = useTransform(scrollYProgress, [0, 1], [40, 2000]);
    const y6 = useTransform(scrollYProgress, [0, 1], [60, 3000]);


    return (
        <div className="absolute w-full h-full overflow-hidden">
            <motion.div
                className="absolute top-0 left-4 w-1/12 max-sm:w-1/4 max-lg:w-1/6 z-10"
                style={{y: y1}}
            >
                <img src={cloud1.src} alt="awan1" loading="lazy"/>
            </motion.div>

            <motion.div
                className="absolute top-0 right-4 w-1/12 max-sm:w-1/4 max-lg:w-1/6 z-10"
                style={{y: y2}}
            >
                <img src={cloud2.src} alt="cloud2" loading="lazy"/>
            </motion.div>

            <motion.div
                className="absolute top-0 left-4 w-1/12 max-sm:w-1/4 max-lg:w-1/6 z-10"
                style={{y: y3}}
            >
                <img src={cloud3.src} alt="cloud1" loading="lazy"/>
            </motion.div>

            <motion.div
                className="absolute top-0 right-4 w-1/12 max-sm:w-1/4 max-lg:w-1/6 z-10"
                style={{y: y4}}
            >
                <img src={cloud4.src} alt="cloud1" loading="lazy"/>
            </motion.div>

            <motion.div
                className="absolute top-0 right-4 w-1/12 max-sm:w-1/4 max-lg:w-1/6 z-10"
                style={{y: y5}}
            >
                <img src={cloud1.src} alt="cloud1" loading="lazy"/>
            </motion.div>

            <motion.div
                className="absolute top-0 left-4 w-1/12 max-sm:w-1/4 max-lg:w-1/6 z-10"
                style={{y: y6}}
            >
                <img src={cloud3.src} alt="cloud1" loading="lazy"/>
            </motion.div>
        </div>
    );
};

export default CloudParallax;
