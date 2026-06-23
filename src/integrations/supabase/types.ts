export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          gender: Database["public"]["Enums"]["gender_t"] | null
          hero_image_url: string | null
          id: string
          is_featured: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          gender?: Database["public"]["Enums"]["gender_t"] | null
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          gender?: Database["public"]["Enums"]["gender_t"] | null
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      homepage_banners: {
        Row: {
          cta_href: string | null
          cta_label: string | null
          eyebrow: string | null
          headline: string
          id: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          subhead: string | null
        }
        Insert: {
          cta_href?: string | null
          cta_label?: string | null
          eyebrow?: string | null
          headline: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          subhead?: string | null
        }
        Update: {
          cta_href?: string | null
          cta_label?: string | null
          eyebrow?: string | null
          headline?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          subhead?: string | null
        }
        Relationships: []
      }
      product_collections: {
        Row: {
          collection_id: string
          product_id: string
        }
        Insert: {
          collection_id: string
          product_id: string
        }
        Update: {
          collection_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt: string | null
          id: string
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt?: string | null
          id?: string
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt?: string | null
          id?: string
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          id: string
          price: number
          product_id: string
          sale_price: number | null
          size_ml: number
          sku: string
          stock_qty: number
        }
        Insert: {
          id?: string
          price: number
          product_id: string
          sale_price?: number | null
          size_ml: number
          sku: string
          stock_qty?: number
        }
        Update: {
          id?: string
          price?: number
          product_id?: string
          sale_price?: number | null
          size_ml?: number
          sku?: string
          stock_qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_notes: string[]
          base_price: number
          brand_id: string
          concentration: Database["public"]["Enums"]["concentration_t"] | null
          created_at: string
          description: string | null
          fragrance_family: string | null
          gender: Database["public"]["Enums"]["gender_t"]
          hero_image_url: string | null
          id: string
          is_best_seller: boolean
          is_new_arrival: boolean
          longevity: string | null
          middle_notes: string[]
          name: string
          projection: string | null
          rating_avg: number
          rating_count: number
          sale_price: number | null
          slug: string
          top_notes: string[]
        }
        Insert: {
          base_notes?: string[]
          base_price: number
          brand_id: string
          concentration?: Database["public"]["Enums"]["concentration_t"] | null
          created_at?: string
          description?: string | null
          fragrance_family?: string | null
          gender?: Database["public"]["Enums"]["gender_t"]
          hero_image_url?: string | null
          id?: string
          is_best_seller?: boolean
          is_new_arrival?: boolean
          longevity?: string | null
          middle_notes?: string[]
          name: string
          projection?: string | null
          rating_avg?: number
          rating_count?: number
          sale_price?: number | null
          slug: string
          top_notes?: string[]
        }
        Update: {
          base_notes?: string[]
          base_price?: number
          brand_id?: string
          concentration?: Database["public"]["Enums"]["concentration_t"] | null
          created_at?: string
          description?: string | null
          fragrance_family?: string | null
          gender?: Database["public"]["Enums"]["gender_t"]
          hero_image_url?: string | null
          id?: string
          is_best_seller?: boolean
          is_new_arrival?: boolean
          longevity?: string | null
          middle_notes?: string[]
          name?: string
          projection?: string | null
          rating_avg?: number
          rating_count?: number
          sale_price?: number | null
          slug?: string
          top_notes?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author: string
          created_at: string
          id: string
          quote: string
          sort_order: number
          source: string | null
        }
        Insert: {
          author: string
          created_at?: string
          id?: string
          quote: string
          sort_order?: number
          source?: string | null
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          quote?: string
          sort_order?: number
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      concentration_t:
        | "eau_de_cologne"
        | "eau_de_toilette"
        | "eau_de_parfum"
        | "parfum"
        | "extrait"
      gender_t: "women" | "men" | "unisex"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      concentration_t: [
        "eau_de_cologne",
        "eau_de_toilette",
        "eau_de_parfum",
        "parfum",
        "extrait",
      ],
      gender_t: ["women", "men", "unisex"],
    },
  },
} as const
