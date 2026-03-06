import { API_BASE_URL } from "../config";
import type {
  Form,
  FormListItem,
  PublicForm,
  FormAnswer,
  CreateFormData,
  CreateQuestionData,
  AnswerSubmission,
} from "../types/forms";
import { getValidAccessToken } from "./apiClient";

const getAuthHeaders = async (): Promise<HeadersInit> => {
  const accessToken = await getValidAccessToken();
  return {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
};

export const formsService = {
  async listForms(): Promise<FormListItem[]> {
    const response = await fetch(`${API_BASE_URL}/forms/`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Error al listar formularios");
    }
    return response.json();
  },

  async getForm(slug: string): Promise<Form> {
    const response = await fetch(`${API_BASE_URL}/forms/${slug}/`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Error al obtener formulario");
    }
    return response.json();
  },

  async createForm(data: CreateFormData): Promise<Form> {
    const response = await fetch(`${API_BASE_URL}/forms/`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Error al crear formulario");
    }
    return response.json();
  },

  async updateForm(slug: string, data: Partial<CreateFormData>): Promise<Form> {
    const response = await fetch(`${API_BASE_URL}/forms/${slug}/`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar formulario");
    }
    return response.json();
  },

  async deleteForm(slug: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/forms/${slug}/`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Error al eliminar formulario");
    }
  },

  async duplicateForm(slug: string, name?: string): Promise<Form> {
    const response = await fetch(`${API_BASE_URL}/forms/${slug}/duplicate/`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error("Error al duplicar formulario");
    }
    return response.json();
  },

  async toggleFormActive(slug: string, isActive: boolean): Promise<Form> {
    return formsService.updateForm(slug, { is_active: isActive });
  },

  async getFormQuestions(formSlug: string): Promise<CreateQuestionData[]> {
    const response = await fetch(`${API_BASE_URL}/forms/${formSlug}/questions/`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Error al obtener preguntas");
    }
    return response.json();
  },

  async addQuestion(formSlug: string, data: CreateQuestionData): Promise<CreateQuestionData> {
    const response = await fetch(`${API_BASE_URL}/forms/${formSlug}/add_question/`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Error al agregar pregunta");
    }
    return response.json();
  },

  async updateQuestion(
    formSlug: string,
    questionId: number,
    data: Partial<CreateQuestionData>
  ): Promise<CreateQuestionData> {
    const response = await fetch(
      `${API_BASE_URL}/forms/${formSlug}/question/${questionId}/`,
      {
        method: "PUT",
        headers: await getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error("Error al actualizar pregunta");
    }
    return response.json();
  },

  async deleteQuestion(formSlug: string, questionId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/forms/${formSlug}/question/${questionId}/`,
      {
        method: "DELETE",
        headers: await getAuthHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error("Error al eliminar pregunta");
    }
  },

  async reorderQuestions(formSlug: string, questionIds: number[]): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/forms/${formSlug}/reorder_questions/`,
      {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ question_ids: questionIds }),
      }
    );
    if (!response.ok) {
      throw new Error("Error al reordenar preguntas");
    }
  },

  async getFormAnswers(formSlug: string): Promise<FormAnswer[]> {
    const response = await fetch(`${API_BASE_URL}/forms/${formSlug}/answers/`, {
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Error al obtener respuestas");
    }
    const data = await response.json();
    // Handle paginated response - backend returns { count, next, previous, results }
    return data.results || data || [];
  },

  async listPublicForms(): Promise<PublicForm[]> {
    const response = await fetch(`${API_BASE_URL}/forms/public/`);
    if (!response.ok) {
      throw new Error("Error al listar formularios públicos");
    }
    return response.json();
  },

  async listInternalForms(): Promise<PublicForm[]> {
    const accessToken = await getValidAccessToken();
    const response = await fetch(`${API_BASE_URL}/forms/internal/`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
    if (!response.ok) {
      throw new Error("Error al listar formularios internos");
    }
    return response.json();
  },

  async getPublicForm(slug: string): Promise<PublicForm> {
    const response = await fetch(`${API_BASE_URL}/forms/public/${slug}/`);
    if (!response.ok) {
      throw new Error("Formulario no encontrado");
    }
    return response.json();
  },

  async submitForm(slug: string, answers: AnswerSubmission[]): Promise<{ success: boolean; message: string }> {
    const accessToken = await getValidAccessToken();
    const response = await fetch(
      `${API_BASE_URL}/forms/public/${slug}/submit/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ answers }),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Error al enviar formulario");
    }
    
    return data;
  },
};
