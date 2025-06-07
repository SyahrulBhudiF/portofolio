import React, {useMemo, useRef} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';

const StarBackground: React.FC = () => {
    const ref = useRef(null);
    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [200, 0]);

    const stars = useMemo(() => {
        const count = 100;
        return Array.from({length: count}, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3,
            opacity: Math.random() * 0.7 + 0.3,
            depth: Math.random() * 2,
            isStatic: Math.random() < 0.1
        }));
    }, []);

    return (
        <motion.div
            ref={ref}
            className="absolute inset-0 overflow-hidden z-0 h-1/2"
            style={{y}}
        >
            {stars.map(star => (
                star.isStatic ? (
                    <div
                        key={`static-${star.id}`}
                        className="absolute bg-purple-500 rounded-full"
                        style={{
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            opacity: star.opacity,
                            transform: `translateY(${star.depth * 50}px)`
                        }}
                    />
                ) : (
                    <motion.div
                        key={`animated-${star.id}`}
                        className="absolute bg-purple-500 rounded-full"
                        style={{
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            opacity: star.opacity,
                            transform: `translateY(${star.depth * 50}px)`
                        }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [star.opacity, star.opacity * 0.5, star.opacity]
                        }}
                        transition={{
                            duration: Math.random() + 2,
                            repeat: Infinity,
                            repeatType: 'loop',
                            ease: "easeInOut",
                            delay: Math.random()
                        }}
                    />
                )
            ))}
        </motion.div>
    );
};

export default StarBackground;