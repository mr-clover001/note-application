declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.webp';

declare module "*.mp4" {
  const src: string;
  export default src;
}
declare module "*.gif" {
  const src: string;
  export default src;
}