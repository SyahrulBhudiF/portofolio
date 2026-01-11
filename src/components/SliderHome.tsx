import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel.tsx";

const ROLES = [
  "Web Developer",
  "Full-Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Bug Maker :v",
] as const;

const CAROUSEL_ITEM_CLASS =
  "text-white font-bold text-3xl max-sm:text-xl w-fit text-carousel";

const SliderHome = () => {
  return (
    <Carousel
      className="w-fit pointer-events-none"
      plugins={[Autoplay({ playOnInit: true, delay: 1500 })]}
    >
      <CarouselContent>
        {ROLES.map((role) => (
          <CarouselItem key={role} className={CAROUSEL_ITEM_CLASS}>
            {role}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default SliderHome;
