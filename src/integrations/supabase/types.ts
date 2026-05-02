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
      clientes: {
        Row: {
          abonos: number
          ajuste_de_abonos: number
          ajuste_de_deuda: number
          apellido_materno: string | null
          apellido_paterno: string | null
          cliente_activo: boolean
          contadorid: number
          created_at: string
          deuda: number
          direccion: string | null
          email: string | null
          foto: string | null
          id: string
          nombre: string
          rfc: string | null
          telefono: string | null
          tipo_de_cliente: Database["public"]["Enums"]["tipo_cliente"] | null
          updated_at: string
        }
        Insert: {
          abonos?: number
          ajuste_de_abonos?: number
          ajuste_de_deuda?: number
          apellido_materno?: string | null
          apellido_paterno?: string | null
          cliente_activo?: boolean
          contadorid?: number
          created_at?: string
          deuda?: number
          direccion?: string | null
          email?: string | null
          foto?: string | null
          id: string
          nombre: string
          rfc?: string | null
          telefono?: string | null
          tipo_de_cliente?: Database["public"]["Enums"]["tipo_cliente"] | null
          updated_at?: string
        }
        Update: {
          abonos?: number
          ajuste_de_abonos?: number
          ajuste_de_deuda?: number
          apellido_materno?: string | null
          apellido_paterno?: string | null
          cliente_activo?: boolean
          contadorid?: number
          created_at?: string
          deuda?: number
          direccion?: string | null
          email?: string | null
          foto?: string | null
          id?: string
          nombre?: string
          rfc?: string | null
          telefono?: string | null
          tipo_de_cliente?: Database["public"]["Enums"]["tipo_cliente"] | null
          updated_at?: string
        }
        Relationships: []
      }
      detalles_de_compra: {
        Row: {
          cantidad: number
          contadorid: number
          created_at: string
          fecha: string
          id: string
          ordenid: string | null
          precio_unidad: number
          productoid: string
          subtotal: number | null
        }
        Insert: {
          cantidad?: number
          contadorid?: number
          created_at?: string
          fecha?: string
          id: string
          ordenid?: string | null
          precio_unidad?: number
          productoid: string
          subtotal?: number | null
        }
        Update: {
          cantidad?: number
          contadorid?: number
          created_at?: string
          fecha?: string
          id?: string
          ordenid?: string | null
          precio_unidad?: number
          productoid?: string
          subtotal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "detalles_de_compra_ordenid_fkey"
            columns: ["ordenid"]
            isOneToOne: false
            referencedRelation: "ordenes_de_compra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalles_de_compra_productoid_fkey"
            columns: ["productoid"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["productoid"]
          },
        ]
      }
      esm_prod_cer: {
        Row: {
          created_at: string
          esmalte_id: string | null
          id: string
          produccionid: string | null
        }
        Insert: {
          created_at?: string
          esmalte_id?: string | null
          id?: string
          produccionid?: string | null
        }
        Update: {
          created_at?: string
          esmalte_id?: string | null
          id?: string
          produccionid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "esm_prod_cer_esmalte_id_fkey"
            columns: ["esmalte_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["productoid"]
          },
          {
            foreignKeyName: "esm_prod_cer_produccionid_fkey"
            columns: ["produccionid"]
            isOneToOne: false
            referencedRelation: "producciones"
            referencedColumns: ["produccionid"]
          },
        ]
      }
      firing_logs: {
        Row: {
          apertura_de_chimenea: string | null
          consumo_energia: number | null
          contadorid: number
          created_at: string
          id_bq: string
          id_quema: string
          imagen: string | null
          observaciones: string | null
          temperatura_c: number
          tiempo: string
        }
        Insert: {
          apertura_de_chimenea?: string | null
          consumo_energia?: number | null
          contadorid?: number
          created_at?: string
          id_bq: string
          id_quema: string
          imagen?: string | null
          observaciones?: string | null
          temperatura_c?: number
          tiempo?: string
        }
        Update: {
          apertura_de_chimenea?: string | null
          consumo_energia?: number | null
          contadorid?: number
          created_at?: string
          id_bq?: string
          id_quema?: string
          imagen?: string | null
          observaciones?: string | null
          temperatura_c?: number
          tiempo?: string
        }
        Relationships: [
          {
            foreignKeyName: "firing_logs_id_quema_fkey"
            columns: ["id_quema"]
            isOneToOne: false
            referencedRelation: "quemas"
            referencedColumns: ["id_quema"]
          },
        ]
      }
      formulas: {
        Row: {
          cantidad: number
          componente_id: string
          contadorfmlid: number
          created_at: string
          fecha: string
          fmlid: string
          productoid: string
          quien_modifica: string | null
          updated_at: string
          valor_de_gasto: number
        }
        Insert: {
          cantidad?: number
          componente_id: string
          contadorfmlid?: number
          created_at?: string
          fecha?: string
          fmlid: string
          productoid: string
          quien_modifica?: string | null
          updated_at?: string
          valor_de_gasto?: number
        }
        Update: {
          cantidad?: number
          componente_id?: string
          contadorfmlid?: number
          created_at?: string
          fecha?: string
          fmlid?: string
          productoid?: string
          quien_modifica?: string | null
          updated_at?: string
          valor_de_gasto?: number
        }
        Relationships: [
          {
            foreignKeyName: "formulas_componente_id_fkey"
            columns: ["componente_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["productoid"]
          },
          {
            foreignKeyName: "formulas_productoid_fkey"
            columns: ["productoid"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["productoid"]
          },
          {
            foreignKeyName: "formulas_quien_modifica_fkey"
            columns: ["quien_modifica"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      lista_de_hornos: {
        Row: {
          alto_interno: number
          ancho_interno: number
          cantidad_de_quemadores: number | null
          contadorid: number
          created_at: string
          descripcion: string | null
          foto: string | null
          id_horno: string
          largo_interno: number
          nombre: string | null
          notas: string | null
          plano: string | null
          tamano_tanque: number | null
          tipo_de_energia: string | null
          updated_at: string
          volumen_interno: number | null
        }
        Insert: {
          alto_interno?: number
          ancho_interno?: number
          cantidad_de_quemadores?: number | null
          contadorid?: number
          created_at?: string
          descripcion?: string | null
          foto?: string | null
          id_horno: string
          largo_interno?: number
          nombre?: string | null
          notas?: string | null
          plano?: string | null
          tamano_tanque?: number | null
          tipo_de_energia?: string | null
          updated_at?: string
          volumen_interno?: number | null
        }
        Update: {
          alto_interno?: number
          ancho_interno?: number
          cantidad_de_quemadores?: number | null
          contadorid?: number
          created_at?: string
          descripcion?: string | null
          foto?: string | null
          id_horno?: string
          largo_interno?: number
          nombre?: string | null
          notas?: string | null
          plano?: string | null
          tamano_tanque?: number | null
          tipo_de_energia?: string | null
          updated_at?: string
          volumen_interno?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lista_de_hornos_tipo_de_energia_fkey"
            columns: ["tipo_de_energia"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["productoid"]
          },
        ]
      }
      ordenes_de_compra: {
        Row: {
          contadorid: number
          created_at: string
          fecha: string
          id: string
          notas: string | null
          proveedorid: string | null
          quien_modifica: string | null
          total: number
          updated_at: string
        }
        Insert: {
          contadorid?: number
          created_at?: string
          fecha?: string
          id: string
          notas?: string | null
          proveedorid?: string | null
          quien_modifica?: string | null
          total?: number
          updated_at?: string
        }
        Update: {
          contadorid?: number
          created_at?: string
          fecha?: string
          id?: string
          notas?: string | null
          proveedorid?: string | null
          quien_modifica?: string | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_de_compra_proveedorid_fkey"
            columns: ["proveedorid"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["proveedorid"]
          },
          {
            foreignKeyName: "ordenes_de_compra_quien_modifica_fkey"
            columns: ["quien_modifica"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      produccion_clientes: {
        Row: {
          cantidad_de_piezas: number
          cliente_id: string | null
          contadorid: number
          created_at: string
          fecha_fin: string | null
          fecha_inicio: string
          notas: string | null
          precio_total: number
          produccioncliid: string
          productoid: string | null
          status: Database["public"]["Enums"]["status_produccion"]
          updated_at: string
          volumen_de_pieza: number
        }
        Insert: {
          cantidad_de_piezas?: number
          cliente_id?: string | null
          contadorid?: number
          created_at?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          notas?: string | null
          precio_total?: number
          produccioncliid: string
          productoid?: string | null
          status?: Database["public"]["Enums"]["status_produccion"]
          updated_at?: string
          volumen_de_pieza?: number
        }
        Update: {
          cantidad_de_piezas?: number
          cliente_id?: string | null
          contadorid?: number
          created_at?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          notas?: string | null
          precio_total?: number
          produccioncliid?: string
          productoid?: string | null
          status?: Database["public"]["Enums"]["status_produccion"]
          updated_at?: string
          volumen_de_pieza?: number
        }
        Relationships: [
          {
            foreignKeyName: "produccion_clientes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produccion_clientes_productoid_fkey"
            columns: ["productoid"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["productoid"]
          },
        ]
      }
      producciones: {
        Row: {
          cantidad_de_piezas: number
          contadorid: number
          created_at: string
          encargado: string | null
          fecha_fin: string | null
          fecha_inicio: string
          imagen: string | null
          nombre: string | null
          notas: string | null
          produccionid: string
          productoid: string | null
          status: Database["public"]["Enums"]["status_produccion"]
          updated_at: string
          volumen_de_pieza: number
        }
        Insert: {
          cantidad_de_piezas?: number
          contadorid?: number
          created_at?: string
          encargado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string
          imagen?: string | null
          nombre?: string | null
          notas?: string | null
          produccionid: string
          productoid?: string | null
          status?: Database["public"]["Enums"]["status_produccion"]
          updated_at?: string
          volumen_de_pieza?: number
        }
        Update: {
          cantidad_de_piezas?: number
          contadorid?: number
          created_at?: string
          encargado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string
          imagen?: string | null
          nombre?: string | null
          notas?: string | null
          produccionid?: string
          productoid?: string | null
          status?: Database["public"]["Enums"]["status_produccion"]
          updated_at?: string
          volumen_de_pieza?: number
        }
        Relationships: [
          {
            foreignKeyName: "producciones_encargado_fkey"
            columns: ["encargado"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producciones_productoid_fkey"
            columns: ["productoid"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["productoid"]
          },
        ]
      }
      productos: {
        Row: {
          categoria_esmaltes:
            | Database["public"]["Enums"]["categoria_esmaltes"]
            | null
          contadorid: number
          costo_de_formula: number
          created_at: string
          en_bodega: number | null
          entrantes: number
          ficha_tecnica: string | null
          imagen: string | null
          nombre: string
          notas: string | null
          precio_de_compra: number
          precio_de_venta: number | null
          precio_manual: number
          productoid: string
          salientes: number
          tipo: Database["public"]["Enums"]["tipo_producto"]
          unidad: Database["public"]["Enums"]["unidad_producto"]
          updated_at: string
          valor_en_bodega: number
        }
        Insert: {
          categoria_esmaltes?:
            | Database["public"]["Enums"]["categoria_esmaltes"]
            | null
          contadorid?: number
          costo_de_formula?: number
          created_at?: string
          en_bodega?: number | null
          entrantes?: number
          ficha_tecnica?: string | null
          imagen?: string | null
          nombre: string
          notas?: string | null
          precio_de_compra?: number
          precio_de_venta?: number | null
          precio_manual?: number
          productoid: string
          salientes?: number
          tipo?: Database["public"]["Enums"]["tipo_producto"]
          unidad?: Database["public"]["Enums"]["unidad_producto"]
          updated_at?: string
          valor_en_bodega?: number
        }
        Update: {
          categoria_esmaltes?:
            | Database["public"]["Enums"]["categoria_esmaltes"]
            | null
          contadorid?: number
          costo_de_formula?: number
          created_at?: string
          en_bodega?: number | null
          entrantes?: number
          ficha_tecnica?: string | null
          imagen?: string | null
          nombre?: string
          notas?: string | null
          precio_de_compra?: number
          precio_de_venta?: number | null
          precio_manual?: number
          productoid?: string
          salientes?: number
          tipo?: Database["public"]["Enums"]["tipo_producto"]
          unidad?: Database["public"]["Enums"]["unidad_producto"]
          updated_at?: string
          valor_en_bodega?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          apellido_materno: string | null
          apellido_paterno: string | null
          created_at: string
          direccion: string | null
          foto: string | null
          id: string
          nombre: string | null
          telefono: string | null
          updated_at: string
          useractive: boolean
          useremail: string | null
          username: string | null
        }
        Insert: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          created_at?: string
          direccion?: string | null
          foto?: string | null
          id: string
          nombre?: string | null
          telefono?: string | null
          updated_at?: string
          useractive?: boolean
          useremail?: string | null
          username?: string | null
        }
        Update: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          created_at?: string
          direccion?: string | null
          foto?: string | null
          id?: string
          nombre?: string | null
          telefono?: string | null
          updated_at?: string
          useractive?: boolean
          useremail?: string | null
          username?: string | null
        }
        Relationships: []
      }
      proveedores: {
        Row: {
          contadorid: number
          created_at: string
          descripcion: string | null
          direccion: string | null
          email: string | null
          etiquetas: Database["public"]["Enums"]["etiqueta_proveedor"][] | null
          logo: string | null
          nombre_proveedor: string
          proveedorid: string
          telefono: string | null
          updated_at: string
          url: string | null
          whatsapp: string | null
        }
        Insert: {
          contadorid?: number
          created_at?: string
          descripcion?: string | null
          direccion?: string | null
          email?: string | null
          etiquetas?: Database["public"]["Enums"]["etiqueta_proveedor"][] | null
          logo?: string | null
          nombre_proveedor: string
          proveedorid: string
          telefono?: string | null
          updated_at?: string
          url?: string | null
          whatsapp?: string | null
        }
        Update: {
          contadorid?: number
          created_at?: string
          descripcion?: string | null
          direccion?: string | null
          email?: string | null
          etiquetas?: Database["public"]["Enums"]["etiqueta_proveedor"][] | null
          logo?: string | null
          nombre_proveedor?: string
          proveedorid?: string
          telefono?: string | null
          updated_at?: string
          url?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      quemadepieza: {
        Row: {
          cantidad_de_piezas: number
          contadorid: number
          costo_de_quema: number
          costo_de_quema_unidad: number
          created_at: string
          id_horno: string | null
          id_quema: string
          porcentaje_espacio_en_horno: number
          produccioncliid: string | null
          produccionid: string | null
          quemadepiezaid: string
          status_de_produccion: string | null
          tipo_de_quema: string | null
          updated_at: string
          volumen_de_pieza: number
          volumen_total: number
        }
        Insert: {
          cantidad_de_piezas?: number
          contadorid?: number
          costo_de_quema?: number
          costo_de_quema_unidad?: number
          created_at?: string
          id_horno?: string | null
          id_quema: string
          porcentaje_espacio_en_horno?: number
          produccioncliid?: string | null
          produccionid?: string | null
          quemadepiezaid: string
          status_de_produccion?: string | null
          tipo_de_quema?: string | null
          updated_at?: string
          volumen_de_pieza?: number
          volumen_total?: number
        }
        Update: {
          cantidad_de_piezas?: number
          contadorid?: number
          costo_de_quema?: number
          costo_de_quema_unidad?: number
          created_at?: string
          id_horno?: string | null
          id_quema?: string
          porcentaje_espacio_en_horno?: number
          produccioncliid?: string | null
          produccionid?: string | null
          quemadepiezaid?: string
          status_de_produccion?: string | null
          tipo_de_quema?: string | null
          updated_at?: string
          volumen_de_pieza?: number
          volumen_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "quemadepieza_id_quema_fkey"
            columns: ["id_quema"]
            isOneToOne: false
            referencedRelation: "quemas"
            referencedColumns: ["id_quema"]
          },
          {
            foreignKeyName: "quemadepieza_produccioncliid_fkey"
            columns: ["produccioncliid"]
            isOneToOne: false
            referencedRelation: "produccion_clientes"
            referencedColumns: ["produccioncliid"]
          },
          {
            foreignKeyName: "quemadepieza_produccionid_fkey"
            columns: ["produccionid"]
            isOneToOne: false
            referencedRelation: "producciones"
            referencedColumns: ["produccionid"]
          },
        ]
      }
      quemas: {
        Row: {
          cantidad_de_piezas: number
          cantidad_usado_en_lt: number
          cerrar_al_ultimo_log: boolean
          contadorid: number
          costo_de_la_quema: number
          created_at: string
          encargado_de_quema: string | null
          energia_usada: string | null
          fin_de_quema: string | null
          id_horno: string
          id_quema: string
          inicio_de_quema: string
          notas: string | null
          porc_fin_gas: number
          porc_inicio_gas: number
          porc_usado: number
          status: Database["public"]["Enums"]["status_quema"]
          temperatura_alcanzada: number
          temperatura_estimada: number
          tiempo_total_de_quema: number
          tipo_de_quema: string | null
          updated_at: string
        }
        Insert: {
          cantidad_de_piezas?: number
          cantidad_usado_en_lt?: number
          cerrar_al_ultimo_log?: boolean
          contadorid?: number
          costo_de_la_quema?: number
          created_at?: string
          encargado_de_quema?: string | null
          energia_usada?: string | null
          fin_de_quema?: string | null
          id_horno: string
          id_quema: string
          inicio_de_quema?: string
          notas?: string | null
          porc_fin_gas?: number
          porc_inicio_gas?: number
          porc_usado?: number
          status?: Database["public"]["Enums"]["status_quema"]
          temperatura_alcanzada?: number
          temperatura_estimada?: number
          tiempo_total_de_quema?: number
          tipo_de_quema?: string | null
          updated_at?: string
        }
        Update: {
          cantidad_de_piezas?: number
          cantidad_usado_en_lt?: number
          cerrar_al_ultimo_log?: boolean
          contadorid?: number
          costo_de_la_quema?: number
          created_at?: string
          encargado_de_quema?: string | null
          energia_usada?: string | null
          fin_de_quema?: string | null
          id_horno?: string
          id_quema?: string
          inicio_de_quema?: string
          notas?: string | null
          porc_fin_gas?: number
          porc_inicio_gas?: number
          porc_usado?: number
          status?: Database["public"]["Enums"]["status_quema"]
          temperatura_alcanzada?: number
          temperatura_estimada?: number
          tiempo_total_de_quema?: number
          tipo_de_quema?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quemas_encargado_de_quema_fkey"
            columns: ["encargado_de_quema"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quemas_energia_usada_fkey"
            columns: ["energia_usada"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["productoid"]
          },
          {
            foreignKeyName: "quemas_id_horno_fkey"
            columns: ["id_horno"]
            isOneToOne: false
            referencedRelation: "lista_de_hornos"
            referencedColumns: ["id_horno"]
          },
        ]
      }
      transacciones_contabilidad: {
        Row: {
          cliente_id: string | null
          concepto: string | null
          contadorid: number
          created_at: string
          egreso: number
          fecha: string
          id: string
          ingreso: number
        }
        Insert: {
          cliente_id?: string | null
          concepto?: string | null
          contadorid?: number
          created_at?: string
          egreso?: number
          fecha?: string
          id: string
          ingreso?: number
        }
        Update: {
          cliente_id?: string | null
          concepto?: string | null
          contadorid?: number
          created_at?: string
          egreso?: number
          fecha?: string
          id?: string
          ingreso?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacciones_contabilidad_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          apellido_materno: string | null
          apellido_paterno: string | null
          contadorid: number
          created_at: string
          direccion: string | null
          foto: string | null
          id: string
          nombre: string | null
          telefono: string | null
          updated_at: string
          user_id: string | null
          useractive: boolean
          useremail: string
          username: string | null
          userrole: Database["public"]["Enums"]["app_role"] | null
        }
        Insert: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          contadorid?: number
          created_at?: string
          direccion?: string | null
          foto?: string | null
          id: string
          nombre?: string | null
          telefono?: string | null
          updated_at?: string
          user_id?: string | null
          useractive?: boolean
          useremail: string
          username?: string | null
          userrole?: Database["public"]["Enums"]["app_role"] | null
        }
        Update: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          contadorid?: number
          created_at?: string
          direccion?: string | null
          foto?: string | null
          id?: string
          nombre?: string | null
          telefono?: string | null
          updated_at?: string
          user_id?: string | null
          useractive?: boolean
          useremail?: string
          username?: string | null
          userrole?: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: []
      }
      ventas: {
        Row: {
          cantidad: number
          cliente_id: string | null
          contadorid: number
          created_at: string
          fecha: string
          id: string
          notas: string | null
          precio_unidad: number
          productoid: string | null
          tipo: Database["public"]["Enums"]["tipo_producto"] | null
          total: number | null
          updated_at: string
        }
        Insert: {
          cantidad?: number
          cliente_id?: string | null
          contadorid?: number
          created_at?: string
          fecha?: string
          id: string
          notas?: string | null
          precio_unidad?: number
          productoid?: string | null
          tipo?: Database["public"]["Enums"]["tipo_producto"] | null
          total?: number | null
          updated_at?: string
        }
        Update: {
          cantidad?: number
          cliente_id?: string | null
          contadorid?: number
          created_at?: string
          fecha?: string
          id?: string
          notas?: string | null
          precio_unidad?: number
          productoid?: string | null
          tipo?: Database["public"]["Enums"]["tipo_producto"] | null
          total?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ventas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ventas_productoid_fkey"
            columns: ["productoid"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["productoid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_usuario_id: { Args: never; Returns: string }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      recalc_cliente: { Args: { _cid: string }; Returns: undefined }
      recalc_producto: { Args: { _pid: string }; Returns: undefined }
      recalc_quema: { Args: { _qid: string }; Returns: undefined }
      tipo_de_quema_from_temp: { Args: { temp: number }; Returns: string }
    }
    Enums: {
      app_role:
        | "SU"
        | "Administrador"
        | "Maestro Ceramista"
        | "Ceramista"
        | "Vendedor"
        | "Bodegero"
      categoria_esmaltes:
        | "Esmalte Media"
        | "Esmalte Baja"
        | "Engobe"
        | "Raku"
        | "Esmalte Media Semi Mate"
        | "Esmalte Alta"
        | "Wash"
        | "Esmalte Alta Satín"
      etiqueta_proveedor:
        | "Arcilla"
        | "Energía"
        | "Esmalte"
        | "Materia prima"
        | "Otro"
        | "Óxido"
        | "Pasta"
        | "Pigmento"
        | "Herramientas"
        | "Servicios"
      status_produccion: "En proceso" | "Terminada" | "Merma" | "Cancelada"
      status_quema: "Programada" | "En curso" | "Terminada" | "Cancelada"
      tipo_cliente:
        | "Empleado"
        | "Preferente"
        | "Casual"
        | "Superior"
        | "Especial"
      tipo_producto:
        | "Arcilla"
        | "Energía"
        | "Esmalte"
        | "Materia prima"
        | "Otro"
        | "Óxido"
        | "Pasta"
        | "Pigmento"
        | "Renta"
        | "Mano de Obra"
      unidad_producto: "kg" | "lt" | "u" | "m"
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
      app_role: [
        "SU",
        "Administrador",
        "Maestro Ceramista",
        "Ceramista",
        "Vendedor",
        "Bodegero",
      ],
      categoria_esmaltes: [
        "Esmalte Media",
        "Esmalte Baja",
        "Engobe",
        "Raku",
        "Esmalte Media Semi Mate",
        "Esmalte Alta",
        "Wash",
        "Esmalte Alta Satín",
      ],
      etiqueta_proveedor: [
        "Arcilla",
        "Energía",
        "Esmalte",
        "Materia prima",
        "Otro",
        "Óxido",
        "Pasta",
        "Pigmento",
        "Herramientas",
        "Servicios",
      ],
      status_produccion: ["En proceso", "Terminada", "Merma", "Cancelada"],
      status_quema: ["Programada", "En curso", "Terminada", "Cancelada"],
      tipo_cliente: [
        "Empleado",
        "Preferente",
        "Casual",
        "Superior",
        "Especial",
      ],
      tipo_producto: [
        "Arcilla",
        "Energía",
        "Esmalte",
        "Materia prima",
        "Otro",
        "Óxido",
        "Pasta",
        "Pigmento",
        "Renta",
        "Mano de Obra",
      ],
      unidad_producto: ["kg", "lt", "u", "m"],
    },
  },
} as const
