import { useState, useEffect, useCallback } from 'react';

/**
 * Network connection information
 */
export interface NetworkInformation {
  /**
   * Whether the device is online
   */
  isOnline: boolean;

  /**
   * Network connection type (if supported by browser)
   * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/type
   */
  connectionType?: string;

  /**
   * Effective network connection type (if supported by browser)
   * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType
   */
  effectiveType?: string;

  /**
   * Downlink speed in Mbps (if supported by browser)
   * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/downlink
   */
  downlink?: number;

  /**
   * Round-trip time in ms (if supported by browser)
   * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/rtt
   */
  rtt?: number;

  /**
   * Whether the Network Information API is supported
   */
  isNetworkInfoSupported: boolean;

  /**
   * Last time the network status was updated
   */
  lastUpdated?: Date;
}

/**
 * Options for the useNetworkStatus hook
 */
export interface UseNetworkStatusOptions {
  /**
   * Polling interval in milliseconds for checking network status
   * Set to 0 or undefined to disable polling (rely on events only)
   * @default 10000 (10 seconds)
   */
  pollingInterval?: number;

  /**
   * Whether to track detailed network information (connection type, speed, etc.)
   * This requires the Network Information API which may not be supported in all browsers
   * @default true
   */
  trackDetailedInfo?: boolean;

  /**
   * Callback function called when network status changes
   */
  onStatusChange?: (status: NetworkInformation) => void;
}

// Vendor-prefixed network information types
interface VendorNetworkConnection {
  type?: string;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  mozConnection?: VendorNetworkConnection;
  webkitConnection?: VendorNetworkConnection;
}

// Helper function defined OUTSIDE the hook to avoid initialization issues
function getNetworkConnectionHelper(): NetworkInformation | null {
  if (typeof navigator === 'undefined') return null;

  // Check for the modern API
  const nav = navigator as unknown as { connection?: VendorNetworkConnection } & VendorNetworkConnection;
  if (nav.connection) {
    return nav.connection as unknown as NetworkInformation;
  }

  // Check for vendor-prefixed versions
  if (nav.mozConnection) {
    return nav.mozConnection as unknown as NetworkInformation;
  }

  if (nav.webkitConnection) {
    return nav.webkitConnection as unknown as NetworkInformation;
  }

  return null;
}

// Helper function to extract connection info
function extractConnectionInfoHelper(connection: NetworkInformation) {
  return {
    connectionType: connection.type || connection.connectionType,
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
  };
}

/**
 * A React hook that tracks network connectivity status and detailed network information
 *
 * @example
 * const { isOnline, connectionType, effectiveType } = useNetworkStatus();
 *
 * @example
 * const networkStatus = useNetworkStatus({
 *   pollingInterval: 5000,
 *   onStatusChange: (status) => console.log('Network changed:', status)
 * });
 *
 * @returns NetworkInformation object with current network status
 */
export function useNetworkStatus(options: UseNetworkStatusOptions = {}): NetworkInformation {
  const {
    pollingInterval = 10000,
    trackDetailedInfo = true,
    onStatusChange,
  } = options;

  const [networkInfo, setNetworkInfo] = useState<NetworkInformation>(() => {
    // Initial state - don't call helper functions here to avoid initialization issues
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const connection = getNetworkConnectionHelper();

    return {
      isOnline,
      isNetworkInfoSupported: connection !== null,
      ...(connection && trackDetailedInfo ? extractConnectionInfoHelper(connection) : {}),
      lastUpdated: new Date(),
    };
  });

  // Update network status
  const updateNetworkStatus = useCallback(() => {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const connection = getNetworkConnectionHelper();

    const newInfo: NetworkInformation = {
      isOnline,
      isNetworkInfoSupported: connection !== null,
      ...(connection && trackDetailedInfo ? extractConnectionInfoHelper(connection) : {}),
      lastUpdated: new Date(),
    };

    setNetworkInfo(newInfo);
    onStatusChange?.(newInfo);
  }, [trackDetailedInfo, onStatusChange]);

  // Event handler for online/offline events
  const handleOnline = useCallback(() => {
    console.debug('[useNetworkStatus] Device came online');
    updateNetworkStatus();
  }, [updateNetworkStatus]);

  const handleOffline = useCallback(() => {
    console.warn('[useNetworkStatus] Device went offline');
    updateNetworkStatus();
  }, [updateNetworkStatus]);

  // Event handler for connection change events
  const handleConnectionChange = useCallback(() => {
    console.debug('[useNetworkStatus] Network connection changed');
    updateNetworkStatus();
  }, [updateNetworkStatus]);

  useEffect(() => {
    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set up connection change listener if supported
    const connection = getNetworkConnectionHelper();
    if (connection && 'addEventListener' in connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Initial update
    updateNetworkStatus();

    // Set up polling if interval is provided
    let pollingTimer: NodeJS.Timeout | null = null;
    if (pollingInterval > 0) {
      pollingTimer = setInterval(updateNetworkStatus, pollingInterval);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (connection && 'removeEventListener' in connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }

      if (pollingTimer) {
        clearInterval(pollingTimer);
      }
    };
  }, [
    handleOnline,
    handleOffline,
    handleConnectionChange,
    updateNetworkStatus,
    pollingInterval,
  ]);

  return networkInfo;
}

/**
 * Custom hook that returns a simplified online/offline status
 * @returns boolean indicating if device is online
 */
export function useIsOnline(): boolean {
  const { isOnline } = useNetworkStatus({ trackDetailedInfo: false });
  return isOnline;
}

/**
 * Utility function to get current network status synchronously
 * @returns Current network information (does not trigger re-renders)
 */
export function getCurrentNetworkStatus(): Omit<NetworkInformation, 'lastUpdated'> {
  if (typeof navigator === 'undefined') {
    return {
      isOnline: true,
      isNetworkInfoSupported: false,
    };
  }

  const nav = navigator as unknown as VendorNetworkConnection;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  const isOnline = navigator.onLine;

  return {
    isOnline,
    isNetworkInfoSupported: !!connection,
    connectionType: connection?.type || connection?.connectionType,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
  };
}

export default useNetworkStatus;
