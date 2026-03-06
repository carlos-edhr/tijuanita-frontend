import { toast } from 'sonner';

interface ApiError {
  response?: {
    status?: number;
    data?: {
      detail?: string;
      message?: string;
    };
  };
  message?: string;
  code?: string;
}

type ToastType = 'error' | 'warning' | 'info';

export function handleApiError(
  error: ApiError,
  defaultMessage: string,
  context?: string
): void {
  const status = error.response?.status;
  const detail = error.response?.data?.detail || error.response?.data?.message;
  
  let message = defaultMessage;
  let type: ToastType = 'error';

  if (status === 401) {
    message = context 
      ? `Tu sesión ha expirado. Inicia sesión de nuevo para ${context}.`
      : 'Tu sesión ha expirado. Inicia sesión de nuevo.';
  } else if (status === 403) {
    message = context
      ? `No tienes permisos para ${context}. Contacta al administrador si crees que es un error.`
      : "No tienes permisos para realizar esta acción.";
  } else if (status === 404) {
    message = context
      ? `El ${context} que buscas no fue encontrado. Puede que haya sido eliminado.`
      : 'El recurso solicitado no fue encontrado.';
  } else if (status === 422) {
    message = detail || 'La información proporcionada es inválida. Por favor verifica tus datos.';
    type = 'warning';
  } else if (status === 429) {
    message = 'Demasiadas solicitudes. Por favor espera un momento e intenta de nuevo.';
  } else if (status && status >= 500) {
    message = 'Error del servidor. Nuestro equipo ha sido notificado. Por favor intenta más tarde.';
  } else if (!status) {
    message = context
      ? `No se puede ${context}. Verifica tu conexión a internet.`
      : 'No se puede conectar. Verifica tu conexión a internet.';
  } else if (detail) {
    message = detail;
  }

  if (type === 'warning') {
    toast.warning(message);
  } else {
    toast.error(message);
  }
}

export function handleFormError(
  error: ApiError,
  fieldErrors?: Record<string, string[]>
): Record<string, string> | null {
  if (error.response?.status === 422 && fieldErrors) {
    const errors: Record<string, string> = {};
    
    for (const [field, messages] of Object.entries(fieldErrors)) {
      if (messages && messages.length > 0) {
        errors[field] = messages[0];
      }
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }
  
  return null;
}

export function getErrorMessage(error: ApiError, action: string): string {
  const status = error.response?.status;
  
  if (status === 401) return `No se pudo ${action}. Inicia sesión e intenta de nuevo.`;
  if (status === 403) return `No tienes permisos para ${action}.`;
  if (status === 404) return `El elemento que intentas ${action} no fue encontrado.`;
  if (status === 422) return error.response?.data?.detail || `Datos inválidos. Por favor verifica tus datos.`;
  if (!status) return `Error de red. Verifica tu conexión e intenta de nuevo.`;
  
  return `No se pudo ${action}. Por favor intenta de nuevo.`;
}
