declare module "swiper" {
  export const Navigation: any;
  export const Pagination: any;
  export const Autoplay: any;
  export const EffectFade: any;
  export const Thumbs: any;
}

declare module "swiper/react" {
  import { ComponentType } from "react";
  export const Swiper: ComponentType<any>;
  export const SwiperSlide: ComponentType<any>;
}

declare module "swiper/css" {}
declare module "swiper/css/navigation" {}
declare module "swiper/css/pagination" {}
declare module "swiper/css/effect-fade" {}
declare module "swiper/css/thumbs" {}
