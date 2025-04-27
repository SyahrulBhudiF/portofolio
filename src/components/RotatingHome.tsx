import React from 'react';
import RotatingText from "@/components/ui/RotatingText.tsx";

const RotatingHome = () => {
    return (
        <RotatingText
            texts={['Web Developer', 'Full-Stack Developer', 'Frontend Developer', 'Backend Developer', 'Bug Maker :v']}
            mainClassName="text-white font-bold text-3xl max-sm:text-xl w-fit text-carousel"
            staggerFrom={"last"}
            initial={{y: "100%"}}
            animate={{y: 0}}
            exit={{y: "-100%"}}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{type: "spring", damping: 30, stiffness: 400}}
            rotationInterval={2000}
        />
    );
};

export default RotatingHome;