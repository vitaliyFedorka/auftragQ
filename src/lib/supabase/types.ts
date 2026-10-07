/**
 * Hand-written mirror of the schema in supabase/migrations/0001_init.sql.
 * Shape matches what `supabase gen types typescript` would produce — once a
 * live project exists, regenerate with the Supabase CLI and replace this file.
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          business_name: string | null;
          user_name: string | null;
          business_category: string | null;
          currency: string;
          country: string | null;
          logo_url: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          business_name?: string | null;
          user_name?: string | null;
          business_category?: string | null;
          currency?: string;
          country?: string | null;
          logo_url?: string | null;
          onboarding_completed?: boolean;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          notes?: string | null;
        };
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string | null;
          title: string;
          description: string | null;
          order_type: string | null;
          date: string | null;
          start_time: string | null;
          end_time: string | null;
          price: number;
          deposit: number;
          material_cost: number;
          delivery_fee: number;
          payment_status: 'unpaid' | 'partially_paid' | 'paid';
          order_status: 'new' | 'confirmed' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
          delivery_required: boolean;
          delivery_address: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          customer_id?: string | null;
          title: string;
          description?: string | null;
          order_type?: string | null;
          date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          price?: number;
          deposit?: number;
          material_cost?: number;
          delivery_fee?: number;
          payment_status?: 'unpaid' | 'partially_paid' | 'paid';
          order_status?: 'new' | 'confirmed' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
          delivery_required?: boolean;
          delivery_address?: string | null;
          notes?: string | null;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'orders_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'customers';
            referencedColumns: ['id'];
          },
        ];
      };
      order_images: {
        Row: {
          id: string;
          order_id: string;
          user_id: string;
          storage_path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          user_id: string;
          storage_path: string;
        };
        Update: Partial<Database['public']['Tables']['order_images']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'order_images_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          order_id: string | null;
          type: string;
          scheduled_for: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_id?: string | null;
          type: string;
          scheduled_for?: string | null;
          sent_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'notifications_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
