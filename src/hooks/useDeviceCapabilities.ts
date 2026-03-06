export const useDeviceCapabilities = () => {
  return {
    isMobile: false,
    isLowEndDevice: false,
    prefersReducedMotion: false,
    maxTextureSize: 4096,
  };
};
