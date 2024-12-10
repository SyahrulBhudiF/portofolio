import React from 'react';
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import Autoplay from "embla-carousel-autoplay";

const SliderHome = () => {
    return (
        <Carousel className="w-fit" plugins={[Autoplay({playOnInit: true, delay: 1500})]}>
            <CarouselContent>
                <CarouselItem className="text-white font-bold text-3xl max-sm:text-xl w-fit text-carousel">
                    Web Developer
                </CarouselItem>
                <CarouselItem className="text-white font-bold text-3xl max-sm:text-xl w-fit text-carousel">
                    Full-Stack Developer
                </CarouselItem>
                <CarouselItem className="text-white font-bold text-3xl max-sm:text-xl w-fit text-carousel">
                    Frontend Developer
                </CarouselItem>
                <CarouselItem className="text-white font-bold text-3xl max-sm:text-xl w-fit text-carousel">
                    Backend Developer
                </CarouselItem>
                <CarouselItem className="text-white font-bold text-3xl max-sm:text-xl w-fit text-carousel">
                    Bug Maker :v
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    );
};

// @ts-ignore
export default SliderHome;