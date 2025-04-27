import React from 'react';
import {Github, Linkedin, Mail, FileUser} from "lucide-react";
import cv from "@/assets/cv.pdf";

const social = [
    {
        href: "mailto:syahrul4w@gmail.com",
        title: "email",
        ariaLabel: "email",
        icon: Mail,
    },
    {
        href: "https://www.linkedin.com/in/syahrulbhudif/",
        title: "linkedIn",
        ariaLabel: "linkedIn",
        icon: Linkedin,
    },
    {
        href: "https://github.com/SyahrulBhudiF",
        title: "github",
        ariaLabel: "github",
        icon: Github,
    },
    {
        href: cv,
        title: "cv",
        ariaLabel: "cv",
        icon: FileUser,
    },
];

const Contact: React.FC = () => {
    return (
        <div className="flex flex-col items-center gap-6">
            <a
                href={social.find(({title}) => title === "cv")?.href}
                download="Syahrul_CV.pdf"
                className="mt-4 px-6 py-2 max-sm:p-3 max-sm:text-sm bg-white opacity-50 text-black rounded-md flex gap-2 items-center transition-transform duration-300 ease-in-out hover:-translate-y-1"
            >
                Download CV
                <FileUser size={20}/>
            </a>
            <div className="flex gap-6">
                {social.map(({href, title, ariaLabel, icon: Icon}) => (
                    title !== "cv" &&
                    <a
                        key={title}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={ariaLabel}
                        className="flex items-center justify-center w-8 h-8 border-2 border-white opacity-50 rounded text-white transition-transform duration-300 ease-in-out hover:-translate-y-1"
                    >
                        <Icon size={24} className="group-hover:border-purple-700 ease-in-out transition ease-in-out"/>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Contact;
