import { API_BASE_URL } from "@/config";
import { getValidAccessToken } from "./apiClient";

const getAuthHeaders = async (): Promise<HeadersInit> => {
  const accessToken = await getValidAccessToken();
  return {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
};

export interface CMSNavbar {
  id?: number;
  logo: string | null;
  logo_text: { es: string; en: string } | null;
  cta_text: { es: string; en: string } | null;
  cta_link: { es: string; en: string } | null;
}

export interface CMSHeroCard {
  title: { es: string; en: string } | null;
  description: { es: string; en: string } | null;
  button_text: { es: string; en: string } | null;
  image: string | null;
  video: string | null;
  color: string;
  url: { es: string; en: string } | null;
}

export interface CMSHero {
  id?: number;
  variant: string;
  title: { es: string; en: string } | null;
  card1_title: { es: string; en: string } | null;
  card1_description: { es: string; en: string } | null;
  card1_button_text: { es: string; en: string } | null;
  card1_image: string | null;
  card1_video: string | null;
  card1_color: string;
  card1_url: { es: string; en: string } | null;
  card2_title: { es: string; en: string } | null;
  card2_description: { es: string; en: string } | null;
  card2_button_text: { es: string; en: string } | null;
  card2_image: string | null;
  card2_color: string;
  card2_url: { es: string; en: string } | null;
  card3_title: { es: string; en: string } | null;
  card3_description: { es: string; en: string } | null;
  card3_button_text: { es: string; en: string } | null;
  card3_image: string | null;
  card3_color: string;
  card3_url: { es: string; en: string } | null;
  video_background: string | null;
  video_overlay_text: { es: string; en: string } | null;
  centered_cta_text: { es: string; en: string } | null;
  centered_cta_url: { es: string; en: string } | null;
  split_image: string | null;
  split_image_position: string;
}

export interface CMSQueEsCard {
  title: { es: string; en: string } | null;
  description: { es: string; en: string } | null;
  button_text: { es: string; en: string } | null;
  image: string | null;
  color: string;
}

export interface CMSQueEs {
  id?: number;
  title: { es: string; en: string } | null;
  card1_title: { es: string; en: string } | null;
  card1_description: { es: string; en: string } | null;
  card1_button_text: { es: string; en: string } | null;
  card1_image: string | null;
  card1_color: string;
  card2_title: { es: string; en: string } | null;
  card2_description: { es: string; en: string } | null;
  card2_button_text: { es: string; en: string } | null;
  card2_image: string | null;
  card2_color: string;
  card3_title: { es: string; en: string } | null;
  card3_description: { es: string; en: string } | null;
  card3_button_text: { es: string; en: string } | null;
  card3_image: string | null;
  card3_color: string;
}

export interface CMSWhoWeAre {
  id?: number;
  title: { es: string; en: string } | null;
  content: { es: string; en: string } | null;
  image: string | null;
}

export interface CMSGallery {
  id?: number;
  title: { es: string; en: string } | null;
}

export interface CMSGalleryImage {
  id?: number;
  image: string | null;
  title: { es: string; en: string } | null;
  description: { es: string; en: string } | null;
  alt_text: { es: string; en: string } | null;
  order: number;
  is_active: boolean;
  section: number;
}

export interface CMSContact {
  id?: number;
  title: { es: string; en: string } | null;
  subtitle: { es: string; en: string } | null;
  email_label: { es: string; en: string } | null;
  phone_label: { es: string; en: string } | null;
  address_label: { es: string; en: string } | null;
  form_title: { es: string; en: string } | null;
  form_button_text: { es: string; en: string } | null;
  map_embed: string | null;
}

export interface CMSFooter {
  id?: number;
  copyright_text: { es: string; en: string } | null;
  privacy_policy_url: { es: string; en: string } | null;
  terms_url: { es: string; en: string } | null;
  facebook_url: { es: string; en: string } | null;
  instagram_url: { es: string; en: string } | null;
  twitter_url: { es: string; en: string } | null;
}

export interface CMSTeamMember {
  id?: number;
  name: { es: string; en: string } | null;
  role: { es: string; en: string } | null;
  bio: { es: string; en: string } | null;
  photo: string | null;
  email: string | null;
  order: number;
}

export interface CMSTeamSection {
  id?: number;
  title: { es: string; en: string } | null;
  subtitle: { es: string; en: string } | null;
  members: CMSTeamMember[];
}

export interface CMSCTA {
  id?: number;
  title: { es: string; en: string } | null;
  description: { es: string; en: string } | null;
  button_text: { es: string; en: string } | null;
  button_url: { es: string; en: string } | null;
  background_color: string;
}

export interface CMSConfig {
  id?: number;
  navbar_enabled: boolean;
  hero_enabled: boolean;
  quees_enabled: boolean;
  whoweare_enabled: boolean;
  gallery_enabled: boolean;
  contact_enabled: boolean;
  footer_enabled: boolean;
  cta_sections: number[];
}

export interface CMSLandingPageContent {
  config: CMSConfig | null;
  navbar: CMSNavbar | null;
  hero: CMSHero | null;
  quees: CMSQueEs | null;
  whoweare: CMSWhoWeAre | null;
  gallery: CMSGallery | null;
  contact: CMSContact | null;
  footer: CMSFooter | null;
  ctas: CMSCTA[];
}

export const cmsService = {
  async getLandingPageContent(usePreview = false): Promise<CMSLandingPageContent> {
    const endpoint = usePreview ? 'preview' : 'content';
    const response = await fetch(`${API_BASE_URL}/cms/${endpoint}/`);
    if (!response.ok) {
      throw new Error("Failed to fetch CMS content");
    }
    return response.json();
  },

  async getSingleSectionPreview(section: string): Promise<Record<string, unknown> | null> {
    const response = await fetch(`${API_BASE_URL}/cms/preview/?section=${section}`);
    if (!response.ok) {
      if (response.status === 400) {
        console.warn(`Invalid section: ${section}`);
        return null;
      }
      throw new Error("Failed to fetch section preview");
    }
    const data = await response.json();
    return data[section] || null;
  },

  async getLandingPageConfig(): Promise<CMSConfig> {
    const response = await fetch(`${API_BASE_URL}/cms/config/`);
    if (!response.ok) {
      throw new Error("Failed to fetch CMS config");
    }
    return response.json();
  },

  async getPreviewContent(): Promise<CMSLandingPageContent> {
    return cmsService.getLandingPageContent(true);
  },

  async getHero(): Promise<CMSHero | null> {
    const response = await fetch(`${API_BASE_URL}/cms/hero/`);
    if (!response.ok) {
      throw new Error("Failed to fetch hero content");
    }
    const data = await response.json();
    return data.results?.[0] || null;
  },

  async getQueEs(): Promise<CMSQueEs | null> {
    const response = await fetch(`${API_BASE_URL}/cms/quees/`);
    if (!response.ok) {
      throw new Error("Failed to fetch quees content");
    }
    const data = await response.json();
    return data.results?.[0] || null;
  },

  async getContact(): Promise<CMSContact | null> {
    const response = await fetch(`${API_BASE_URL}/cms/contact/`);
    if (!response.ok) {
      throw new Error("Failed to fetch contact content");
    }
    const data = await response.json();
    return data.results?.[0] || null;
  },

  async getFooter(): Promise<CMSFooter | null> {
    const response = await fetch(`${API_BASE_URL}/cms/footer/`);
    if (!response.ok) {
      throw new Error("Failed to fetch footer content");
    }
    const data = await response.json();
    return data.results?.[0] || null;
  },

  async getNavbar(): Promise<CMSNavbar | null> {
    const response = await fetch(`${API_BASE_URL}/cms/navbar/`);
    if (!response.ok) {
      throw new Error("Failed to fetch navbar content");
    }
    const data = await response.json();
    return data || null;
  },

  async getWhoWeAre(): Promise<CMSWhoWeAre | null> {
    const response = await fetch(`${API_BASE_URL}/cms/whoweare/`);
    if (!response.ok) {
      throw new Error("Failed to fetch whoweare content");
    }
    const data = await response.json();
    return data.results?.[0] || null;
  },

  async getGallery(): Promise<CMSGallery | null> {
    const response = await fetch(`${API_BASE_URL}/cms/gallery/`);
    if (!response.ok) {
      throw new Error("Failed to fetch gallery content");
    }
    const data = await response.json();
    return data.results?.[0] || null;
  },

  async getCTA(): Promise<CMSCTA[]> {
    const response = await fetch(`${API_BASE_URL}/cms/cta/`);
    if (!response.ok) {
      throw new Error("Failed to fetch CTA content");
    }
    const data = await response.json();
    return data.results || [];
  },

  async updateNavbar(data: Partial<CMSNavbar>): Promise<CMSNavbar> {
    const existing = await cmsService.getNavbar();
    const method = existing?.id ? "PATCH" : "POST";
    const url = existing?.id
      ? `${API_BASE_URL}/cms/admin/navbar/${existing.id}/`
      : `${API_BASE_URL}/cms/admin/navbar/`;

    const response = await fetch(url, {
      method,
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to update navbar");
    }
    return response.json();
  },

  async updateHero(data: Partial<CMSHero>): Promise<CMSHero> {
    const existing = await cmsService.getHero();
    const method = existing?.id ? "PATCH" : "POST";
    const url = existing?.id
      ? `${API_BASE_URL}/cms/admin/hero/${existing.id}/`
      : `${API_BASE_URL}/cms/admin/hero/`;

    const response = await fetch(url, {
      method,
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to update hero");
    }
    return response.json();
  },

  async updateQueEs(data: Partial<CMSQueEs>): Promise<CMSQueEs> {
    const existing = await cmsService.getQueEs();
    const method = existing?.id ? "PATCH" : "POST";
    const url = existing?.id
      ? `${API_BASE_URL}/cms/admin/quees/${existing.id}/`
      : `${API_BASE_URL}/cms/admin/quees/`;

    const response = await fetch(url, {
      method,
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to update quees");
    }
    return response.json();
  },

  async updateWhoWeAre(data: Partial<CMSWhoWeAre>): Promise<CMSWhoWeAre> {
    const existing = await cmsService.getWhoWeAre();
    const method = existing?.id ? "PATCH" : "POST";
    const url = existing?.id
      ? `${API_BASE_URL}/cms/admin/whoweare/${existing.id}/`
      : `${API_BASE_URL}/cms/admin/whoweare/`;

    const response = await fetch(url, {
      method,
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to update whoweare");
    }
    return response.json();
  },

  async updateGallery(data: Partial<CMSGallery>): Promise<CMSGallery> {
    const existing = await cmsService.getGallery();
    const method = existing?.id ? "PATCH" : "POST";
    const url = existing?.id
      ? `${API_BASE_URL}/cms/admin/gallery/${existing.id}/`
      : `${API_BASE_URL}/cms/admin/gallery/`;

    const response = await fetch(url, {
      method,
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to update gallery");
    }
    return response.json();
  },

  async updateContact(data: Partial<CMSContact>): Promise<CMSContact> {
    const existing = await cmsService.getContact();
    const method = existing?.id ? "PATCH" : "POST";
    const url = existing?.id
      ? `${API_BASE_URL}/cms/admin/contact/${existing.id}/`
      : `${API_BASE_URL}/cms/admin/contact/`;

    const response = await fetch(url, {
      method,
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to update contact");
    }
    return response.json();
  },

  async updateFooter(data: Partial<CMSFooter>): Promise<CMSFooter> {
    const existing = await cmsService.getFooter();
    const method = existing?.id ? "PATCH" : "POST";
    const url = existing?.id
      ? `${API_BASE_URL}/cms/admin/footer/${existing.id}/`
      : `${API_BASE_URL}/cms/admin/footer/`;

    const response = await fetch(url, {
      method,
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to update footer");
    }
    return response.json();
  },

  async updateConfig(data: Partial<CMSConfig>): Promise<CMSConfig> {
    const existing = await cmsService.getLandingPageConfig();
    const method = existing?.id ? "PATCH" : "POST";
    const url = existing?.id
      ? `${API_BASE_URL}/cms/admin/config/${existing.id}/`
      : `${API_BASE_URL}/cms/admin/config/`;

    const response = await fetch(url, {
      method,
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to update config");
    }
    return response.json();
  },

  async uploadImage(file: File): Promise<{ url: string; filename: string; size: number }> {
    const accessToken = await getValidAccessToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/cms/upload/`, {
      method: 'POST',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to upload image');
    }

    return response.json();
  },

  async updateCTA(data: Partial<CMSCTA>, existingId?: number): Promise<CMSCTA> {
    const id = existingId ?? await cmsService.getCTA()?.then(cta => cta?.id);
    const method = id ? "PATCH" : "POST";
    const url = id
      ? `${API_BASE_URL}/cms/admin/cta/${id}/`
      : `${API_BASE_URL}/cms/admin/cta/`;

    const response = await fetch(url, {
      method,
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to update CTA");
    }
    return response.json();
  },

  async getTeamSection(): Promise<CMSTeamSection | null> {
    const response = await fetch(`${API_BASE_URL}/cms/team-section/`);
    if (!response.ok) {
      throw new Error("Failed to fetch team section");
    }
    const data = await response.json();
    return data.results?.[0] || null;
  },

  async getPublicTeamMembers(): Promise<CMSTeamMember[]> {
    const response = await fetch(`${API_BASE_URL}/cms/team-members/`);
    if (!response.ok) {
      throw new Error("Failed to fetch team members");
    }
    const data = await response.json();
    return data.results || [];
  },

  async getTeamMembers(): Promise<CMSTeamMember[]> {
    const response = await fetch(`${API_BASE_URL}/cms/admin/team-members/`);
    if (!response.ok) {
      throw new Error("Failed to fetch team members");
    }
    const data = await response.json();
    return data.results || [];
  },

  async createTeamMember(data: Partial<CMSTeamMember>): Promise<CMSTeamMember> {
    const response = await fetch(`${API_BASE_URL}/cms/admin/team-members/`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to create team member");
    }
    return response.json();
  },

  async updateTeamMember(id: number, data: Partial<CMSTeamMember>): Promise<CMSTeamMember> {
    const response = await fetch(`${API_BASE_URL}/cms/admin/team-members/${id}/`, {
      method: 'PATCH',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to update team member");
    }
    return response.json();
  },

  async deleteTeamMember(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cms/admin/team-members/${id}/`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to delete team member");
    }
  },

  async getGalleryImages(): Promise<CMSGalleryImage[]> {
    const response = await fetch(`${API_BASE_URL}/cms/admin/gallery-images/`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to fetch gallery images");
    }
    return response.json();
  },

  async getPublicGalleryImages(): Promise<CMSGalleryImage[]> {
    const response = await fetch(`${API_BASE_URL}/cms/gallery-images/`);
    if (!response.ok) {
      throw new Error("Failed to fetch gallery images");
    }
    const data = await response.json();
    return data.results || [];
  },

  async createGalleryImage(data: Partial<CMSGalleryImage>): Promise<CMSGalleryImage> {
    const response = await fetch(`${API_BASE_URL}/cms/admin/gallery-images/`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to create gallery image");
    }
    return response.json();
  },

  async updateGalleryImage(id: number, data: Partial<CMSGalleryImage>): Promise<CMSGalleryImage> {
    const response = await fetch(`${API_BASE_URL}/cms/admin/gallery-images/${id}/`, {
      method: 'PATCH',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to update gallery image");
    }
    return response.json();
  },

  async deleteGalleryImage(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cms/admin/gallery-images/${id}/`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "Failed to delete gallery image");
    }
  },

  getLocalizedValue: <T extends Record<string, unknown>>(
    field: T | null,
    lang: string = "es"
  ): string => {
    if (!field) return "";
    return (field as Record<string, string>)[lang] || "";
  },
};
