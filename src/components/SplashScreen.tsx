import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'motion/react';

const SplashScreen = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [typedText, setTypedText] = useState('');
    const [showSecondText, setShowSecondText] = useState(false);
    const [typedResponse, setTypedResponse] = useState('');

    const fullText = ' sudo dnf install ryuko';
    const promptText = ' Is this ok [y/N]: ';
    const responseText = 'y';

    useEffect(() => {
        if (typedText.length < fullText.length) {
            const typingTimer = setTimeout(() => {
                setTypedText((prev) => prev + fullText[typedText.length]);
            }, 80);
            return () => clearTimeout(typingTimer);
        } else if (!showSecondText) {
            const delayTimer = setTimeout(() => setShowSecondText(true), 300);
            return () => clearTimeout(delayTimer);
        }
    }, [typedText, showSecondText]);

    useEffect(() => {
        if (showSecondText && typedResponse.length < responseText.length) {
            const typingTimer = setTimeout(() => {
                setTypedResponse((prev) => prev + responseText[typedResponse.length]);
            }, 600);
            return () => clearTimeout(typingTimer);
        } else if (typedResponse.length === responseText.length) {
            const closeTimer = setTimeout(() => setShowSplash(false), 500);
            return () => clearTimeout(closeTimer);
        }
    }, [showSecondText, typedResponse]);

    useEffect(() => {
        if (showSplash) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showSplash]);


    return (
        <AnimatePresence>
            {showSplash && (
                <motion.div
                    className="splash-screen flex justify-center items-center w-full h-full bg-black z-40 inset-0 fixed"
                    initial={{opacity: 1}}
                    exit={{opacity: 0, transition: {duration: 1.5}}}
                >
                    <motion.div
                        className="terminal border-2 border-purple-900 p-5 w-4/5 h-48 bg-gray-950 overflow-hidden relative"
                        initial={{scale: 0.95}}
                        animate={{scale: 1}}
                        transition={{duration: 0.5}}
                    >
                        <span className="command-line text-lg leading-relaxed text-white">
                            <span className="text-purple-600">ryuko@fedora:~$</span>
                            <span className="command">{typedText}</span>
                        </span>
                        {showSecondText && (
                            <motion.div
                                className="command-line text-lg leading-relaxed text-white mt-2"
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.5}}
                            >
                                <span className="text-purple-600">ryuko@fedora:~$</span>
                                <span className="command"> {promptText}</span>
                                <span className="command">{typedResponse}</span>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
